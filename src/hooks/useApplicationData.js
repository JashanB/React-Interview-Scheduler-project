import React, { useState, useEffect, useReducer } from "react"
import axios from 'axios';

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
  SET_SPOTS
} from "reducers/application";

export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get('http://localhost:8001/api/days')),
      Promise.resolve(axios.get('http://localhost:8001/api/appointments')),
      Promise.resolve(axios.get('http://localhost:8001/api/interviewers'))])
      .then((all) => {
        // setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
        dispatch({ type: SET_APPLICATION_DATA, days: all[0].data, appointments: all[1].data, interviewers: all[2].data })
      })
  }, [])

  //function to update number of spots 
  function updateDays(state, appointmentId, increment) {
    return state.days.map((day) => {
      if (day.appointments.includes(appointmentId)) {
        return { ...day, spots: day.spots + increment }
      } else {
        return day
      }
    })
  }
  //function to find days with appointment Id 
  function findDays(state, appointmentId) {
    const result = state.days.filter(function (day) {
      return day.appointments.includes(appointmentId)
    })
    return result[0]
  }

  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    return axios.put(`http://localhost:8001/api/appointments/${id}`, interview)
      .then(() => {
        //update day spots
        const daySpots = findDays(state, id)
        if (daySpots.spots > 0 && state.appointments[id].interview === null) {
          const days = updateDays(state, id, -1)
          dispatch({ type: SET_SPOTS, days: days })
        }
      })
      .then(() => {
        dispatch({ type: SET_INTERVIEW, interview: { ...state.appointments, [id]: appointment } })
      })
  }

  function cancelInterview(appointmentId) {
    return axios.delete(`http://localhost:8001/api/appointments/${appointmentId}`)
      .then(() => {
        //update day spots
        const daySpots = findDays(state, appointmentId)
        if (daySpots.spots < 5) {
          const days = updateDays(state, appointmentId, 1)
          dispatch({ type: SET_SPOTS, days: days })
        }
      })
      .then(() => {
        const appointment = state.appointments[appointmentId]
        appointment.interview = null
        dispatch({ type: SET_INTERVIEW, interview: { ...state.appointments, [appointmentId]: appointment } })
      })
  }

  function setDay(day) {
    dispatch({ type: SET_DAY, day: day })
  }

  return { state, setDay, bookInterview, cancelInterview }
}