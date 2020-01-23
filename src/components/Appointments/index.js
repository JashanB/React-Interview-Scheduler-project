import React from "react";

import "components/Appointments/styles.scss";

import Header from "components/Appointments/Header"

import Show from "components/Appointments/Show"

import Empty from "components/Appointments/Empty"

import useVisualMode from "hooks/useVisualMode"

import Form from "components/Appointments/Form"

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE"
const BACK = "BACK"

export default function Appointment (props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

    return (
  <article className="appointment">
    <Header time={props.time}/>
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && (
    <Show
    student={props.interview.student}
    interviewer={props.interview.interviewer}
  />
)}
  {mode === CREATE && (
    <Form  
    interviewers={[]}
    onCancel={() => transition(BACK)}
    />
  )}
  </article> )
}

