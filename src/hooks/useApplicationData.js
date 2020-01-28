import React, { useState, useEffect, useReducer } from "react"
import axios from 'axios';

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const SET_SPOTS = "SET_SPOTS"

  function reducer(state, action) {
    if (action.type === SET_DAY) {
      return { ...state, day: action.day }
    } else if (action.type === SET_APPLICATION_DATA) {
      // return {...state, days: action.value[days], appointments: action.value[appointments], interviewers: action.value[interviewers]}
      return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers }
    } else if (action.type === SET_INTERVIEW) {
      return { ...state, appointments: action.interview }
    } else if (action.type === SET_SPOTS) {
      return { ...state, days: action.days }
      // return {...state, days: [...state.days, action.spots]}
    } else {
      return `Tried to reduce with unsupported action type: ${action.type}`
    }
  }

  // const[state, dispatch] = useReducer(reducer, state)

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

  function updateDays(state, appointmentId, increment) {
    return state.days.map((day) => {
      if (day.appointments.includes(appointmentId)) {
        return { ...day, spots: day.spots + increment }
      } else {
        return day
      }
    })
  }

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
        const daySpots = findDays(state, id)
        console.log('DAY SPOTS THING', daySpots)
        if (daySpots.spots > 0) {
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
        const daySpots = findDays(state, appointmentId)
        if (daySpots.spots < 5) {
          const days = updateDays(state, appointmentId, 1)
          dispatch({ type: SET_SPOTS, days: days })
        }
        // for (let day of state.days) {
        //   //map - make new days state, then dispatch with days: days 
        //   for (let i = 0; i < state.days[day].appointments.length; i++) {
        //     if (state.days[day].appointments[i] === appointmentId) {
        //       const dayIndex = state.days[day]
        //       if (state.days[day].spots > 0) {
        //         dispatch({type: SET_SPOTS, spots: [...state.days, state.days[dayIndex] state.days[day].spots -1]})
        //         // state.days[day].spots++
        //       }
        //     }
        //   }
        // }
      })
      .then(() => {
        const appointment = state.appointments[appointmentId]
        appointment.interview = null
        dispatch({ type: SET_INTERVIEW, interview: { ...state.appointments, [appointmentId]: appointment } })
      })
    // setState(state => { 
    //   const appointment = state.appointments[appointmentId]
    //   appointment.interview = null
    //   return {
    //     ...state, 
    //     appointments: {
    //       ...state.appointments,
    //       [appointmentId] : appointment
    //     }
    //   }
    // })

  }

  // function setDay(day) {
  //   setState({...state, day});
  // }

  function setDay(day) {
    dispatch({ type: SET_DAY, day: day })
  }

  return { state, setDay, bookInterview, cancelInterview }
}