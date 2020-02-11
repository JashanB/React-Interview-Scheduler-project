export function getAppointmentsForDay(state, day) {
  let dayAppointments = [];
  const resultArray = [];
  for (let i = 0; i < state.days.length; i++) {
    if (state.days[i].name === day) {
      if (state.days[i].appointments) {
        dayAppointments = state.days[i].appointments;
      }
    }
  }
  for (let i = 0; i < dayAppointments.length; i++) {
    for (let appointment of Object.keys(state.appointments)) {
      if (dayAppointments[i] === state.appointments[appointment].id) {
        resultArray.push(state.appointments[appointment]);
      }
    }
  }
  return resultArray;
}

export function getInterview(state, interview) {
  let interviewObject;
  if (interview) {
    interviewObject = {...interview, interviewer: state.interviewers[interview.interviewer]}
  } else {
    interviewObject = null;
  }
  return interviewObject;
}

export function getInterviewersByDay(state, day) {
  let interviewersDay = [];
  const resultArray = [];
  for (let i = 0; i < state.days.length; i++) {
    if (state.days[i].name === day) {
      interviewersDay = state.days[i].interviewers
    }
  }
  for (let i = 0; i < interviewersDay.length; i++) {
    for (let interviewersKey of Object.keys(state.interviewers)) {
      if (interviewersDay[i] === state.interviewers[interviewersKey].id) {
        resultArray.push(state.interviewers[interviewersKey])
      }
    }
  }
  return resultArray;
}