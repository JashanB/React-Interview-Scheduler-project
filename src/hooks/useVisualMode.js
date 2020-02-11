import { useState } from "react"

export default function useVisualMode(initial) {
  const [state, setState] = useState({mode: initial, previous: []});

  const transition = function (newMode, replace) {
    setState({mode: newMode, previous: [...state.previous, ...[state.mode]]})
    if (replace) {
      setState({mode: newMode, previous: state.previous})
    }
  }

  const back = function () {
    if (state.previous.length === 0) {
      return console.log('no')
    } else {
      setState({mode: state.previous[state.previous.length - 1], previous: state.previous.slice(0, -1)})
    }
  }


  return { mode: state.mode, transition, back};
}