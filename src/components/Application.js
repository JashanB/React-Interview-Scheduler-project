import React, { useState, useEffect } from "react";

import axios from "axios"

import "components/Application.scss";

import DayList from "components/DayList";

import Appointment from "components/Appointments/index";

import {getAppointmentsForDay, getInterview, getInterviewersByDay} from "helpers/selectors";

export default function Application(props) {
  // const[day, setDay] = useState('Monday');
  // const[days, setDays] = useState([])
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const appointments = getAppointmentsForDay(state, state.day);

  function bookInterview(id, interview) {
    console.log(state.appointments);
    console.log('book interview----->', id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    
    return axios.put(`http://localhost:8001/api/appointments/${id}`, interview).then(() => {
      setState(state => ({
        ...state,
        appointments: {
          ...state.appointments,
          [id]: appointment
        }
      }));
      return true;
    })
  }

  function cancelInterview(appointmentId) {
    return axios.delete(`http://localhost:8001/api/appointments/${appointmentId}`)
    .then(() => {
      setState(state => { 
        const appointment = state.appointments[appointmentId]
        appointment.interview = null
        return {
          ...state, 
          appointments: {
            ...state.appointments,
            [appointmentId] : appointment
          }
        }
      })
      
    })
  }

  const setDay = day => setState({...state, day});
  // const setDays = days => setState(prev => ({...prev, days}));

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get('http://localhost:8001/api/days')),
      Promise.resolve(axios.get('http://localhost:8001/api/appointments')),
      Promise.resolve(axios.get('http://localhost:8001/api/interviewers'))])
    .then((all) => {
      // setState(prev => ({...prev, days}))
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    })
    //   (response) => {
    //   console.log(response.data)
    //   // setDays(response.data)
    // })
  }, [])

  const appointmentsData = appointments.map((appointment) => {
  const interview = getInterview(state, appointment.interview)
  return (
    <Appointment 
      key={appointment.id}
      time={appointment.time}
      interview={interview ? interview.interviewer : null}
      interviewers={getInterviewersByDay(state, state.day)}
      bookInterview={bookInterview}
      cancelInterview={cancelInterview}
      {...appointment}
    />
  ) 
  })
  return (
    <main className="layout">
      <section className="sidebar">
      <img
  className="sidebar--centered"
  src="images/logo.png"
  alt="Interview Scheduler"
/>
<hr className="sidebar__separator sidebar--centered" />
<nav className="sidebar__menu">
<DayList
  days={state.days}
  day={state.day}
  setDay={setDay}
/>
</nav>
<img
  className="sidebar__lhl sidebar--centered"
  src="images/lhl.png"
  alt="Lighthouse Labs"
/>
      </section>
      <section className="schedule">
        {appointmentsData}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
