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

import Error from "components/Appointments/Error"


const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE"
const BACK = "BACK"
const STATUS = "STATUS"
const CONFIRM = "CONFIRM"
const DELETING = "DELETING"
const SAVING = "SAVING"
const EDIT = "EDIT"
const ERROR_SAVING = "ERROR_SAVING"
const ERROR_DELETING = "ERROR_DELETING"

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
    .catch(() => {
      transition(ERROR_SAVING, true)
    })
  }

  function deleteInterview () {
    transition(CONFIRM)
  }

  function deleteDeleteInterview (student, interviewerId) {
    transition(DELETING, true)
    props.cancelInterview(props.id)
    .then(() => {
      transition(EMPTY)
    })
    .catch(() => {
      transition(ERROR_DELETING, true)
    })
  }

  function editInterview () {
    transition(EDIT)
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
    onEdit={editInterview}
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
    />
  )}
    {mode === EDIT && (
    <Form
    name={props.interview.student}  
    interviewers={props.interviewers}
    onCancel={() => back()}
    onSave={save}
    />
  )}
  {mode === ERROR_DELETING && (
  <Error 
  message={'Error Deleting'}
  onClose={() => back()}
  />
)}
{mode === ERROR_SAVING && (
  <Error 
  message={'Error Saving'}
  onClose={() => back()}
  />
)}
  </article> )
}

