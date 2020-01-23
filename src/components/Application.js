import React, { useState, useEffect } from "react";

import axios from "axios"

import "components/Application.scss";

import DayList from "components/DayList";

import Appointment from "components/Appointments/index";

import {getAppointmentsForDay, getInterview} from "helpers/selectors";


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
  const schedule = appointments.map((appointment) => {
  const interview = getInterview(state, appointment.interview);

  
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
      />
    );
  });

  const setDay = day => setState({...state, day});
  // const setDays = days => setState(prev => ({...prev, days}));

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get('http://localhost:8001/api/days')),
      Promise.resolve(axios.get('http://localhost:8001/api/appointments')),
      Promise.resolve(axios.get('http://localhost:8001/api/interviewers'))])
    .then((all) => {
      // setState(prev => ({...prev, days}))
      console.log(all)
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    })
    //   (response) => {
    //   console.log(response.data)
    //   // setDays(response.data)
    // })
  }, [])

  const appointmentsData = appointments.map(appointment => <Appointment 
    key={appointment.id}
    time={appointment.time}
    {...appointment}
    />) 
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
