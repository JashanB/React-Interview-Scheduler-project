import React, { useState, useEffect, useReducer } from "react"
import axios from 'axios';

export default function useApplicationData () {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  
  // function reducer(state, action) {
  //   switch (action.type) {
  //     case SET_DAY:
  //       return { /* insert logic */ }
  //     case SET_APPLICATION_DATA:
  //       return { /* insert logic */ }
  //     case SET_INTERVIEW: {
  //       return /* insert logic */
  //     }
  //     default:
  //       throw new Error(
  //         `Tried to reduce with unsupported action type: ${action.type}`
  //       ); 
  //   }
  // }
  function reducer(state, action) {
    console.log(action.type,  { state, action });
    if (action.type === SET_DAY) {
      // return {...state, day: {...state.day, day: action.value}}
      return {...state, day: action.day}
    } else if (action.type === SET_APPLICATION_DATA) {
      // return {...state, days: action.value[days], appointments: action.value[appointments], interviewers: action.value[interviewers]}
      return {...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers}
    } else if (action.type === SET_INTERVIEW) {
      return {...state, appointments: action.interview}
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
      dispatch({type: SET_APPLICATION_DATA, days: all[0].data, appointments: all[1].data, interviewers: all[2].data})
    })
  }, [])

  function bookInterview(id, interview) {
    console.log(state.appointments);
    console.log('book interview----->', id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    
    return axios.put(`http://localhost:8001/api/appointments/${id}`, interview)
    .then(() => {
      console.log('book interview', {state, [id]: appointment})
      dispatch({type: SET_INTERVIEW, interview: {...state.appointments, [id]: appointment}})
      // setState(state => ({
      //   ...state,
      //   appointments: {
      //     ...state.appointments,
      //     [id]: appointment
      //   }
      // }));
      // return true;
    })
  }

  function cancelInterview(appointmentId) {
    return axios.delete(`http://localhost:8001/api/appointments/${appointmentId}`)
    .then(() => {
      const appointment = state.appointments[appointmentId]
      appointment.interview = null
      dispatch({type: SET_INTERVIEW, interview: {...state.appointments, [appointmentId]: appointment}})
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
      
    })
  }

  // function setDay(day) {
  //   setState({...state, day});
  // }

  function setDay(day) {
    dispatch({type: SET_DAY, day: day })
  }

  return {state, setDay, bookInterview, cancelInterview}
}