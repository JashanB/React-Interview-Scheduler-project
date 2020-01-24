import React from "react";

import "components/Appointments/styles.scss";

import Header from "components/Appointments/Header"

import Show from "components/Appointments/Show"

import Empty from "components/Appointments/Empty"

import useVisualMode from "hooks/useVisualMode"

import Form from "components/Appointments/Form"

import Status from "components/Appointments/Status"

import { transformFileSync } from "@babel/core";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE"
const BACK = "BACK"
const STATUS = "STATUS"




export default function Appointment (props) {

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(STATUS)
    props.bookInterview(props.id, interview)
    .then(() => {
      transition(SHOW)
    })
  }

  function deleteInterview (name, interviewer) {
    
  }


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
    interviewer={props.interviewers.filter( i => i.id === props.interview.interviewer)[0]}
  />
)}
{mode === STATUS && (
  <Status 
  message={'SAVING'}
  />
)}
  {mode === CREATE && (
    <Form  
    interviewers={props.interviewers}
    onCancel={() => back()}
    onSave={save}
    bookInterview={props.bookInterview}
    />
  )}
  </article> )
}

