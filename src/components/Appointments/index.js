import React from "react";

import "components/Appointments/styles.scss";

import Header from "components/Appointments/Header"

import Show from "components/Appointments/Show"

import Empty from "components/Appointments/Empty"

import useVisualMode from "hooks/useVisualMode"

import Form from "components/Appointments/Form"

import Status from "components/Appointments/Status"

import Confirm from "components/Appointments/Confirm"

import { transformFileSync } from "@babel/core";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE"
const BACK = "BACK"
const STATUS = "STATUS"
const CONFIRM = "CONFIRM"
const DELETING = "DELETING"
const SAVING = "SAVING"




export default function Appointment (props) {
  // console.log('APPOINTMENT PROPS----', props, 'PROPS ID', props.id)

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
    props.bookInterview(props.id, interview)
    .then(() => {
      transition(SHOW)
    })
  }

  function deleteInterview () {
    console.log('INITIAL DELETE')
    transition(CONFIRM)
  }

  function deleteDeleteInterview (student, interviewerId) {
    console.log('SECOND DELETE')
    transition(DELETING)
    props.cancelInterview(props.id)
    .then(() => {
      transition(EMPTY)
    })
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
    onDelete={deleteInterview}
  />
)}
{mode === SAVING && (
  <Status 
  message={'SAVING'}
  />
)}
{mode === DELETING && (
  <Status 
  message={'DELETING'}
  />
)}
{mode === CONFIRM && (
  <Confirm 
  onCancel={() => back()}
  message={'DELETING'}
  onConfirm={deleteDeleteInterview}
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

