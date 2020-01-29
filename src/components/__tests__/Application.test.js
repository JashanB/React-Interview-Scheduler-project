import React from "react";
import { act } from 'react-dom/test-utils';

import { render, cleanup, waitForElement, getAllByTestId, getByAltText, getByPlaceholderText, getByText, prettyDOM, queryByText, queryByAltText } from "@testing-library/react";

import Application from "components/Application";
import { fireEvent } from "@testing-library/react/dist";

import axios from "axios";


afterEach(cleanup);

//cleanup not working, uncomment out code and comment out test below it to run tests 
describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"))
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it('loads data, books an interview and reduces the spots remaining for the first day by 1', async () => {
    const { debug} = render(<Application />)
    const container = document.body
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment-input")
    const appointment = appointments[0]

    fireEvent.click(getByAltText(appointment, "Add"))

    let press = await act(() => Promise.resolve(fireEvent.change(getByPlaceholderText(container,'Enter Student Name'), {
      target: { value: "Lydia Miller-Jones" }
    })))
    
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))

    expect(getByText(appointment, "Save")).toBeInTheDocument()

    let val = await act( () => Promise.resolve(fireEvent.click(getByText(container, "Save"))));

    expect(getByText(appointment, "Sylvia Palmer")).toBeInTheDocument()

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"))

    expect(getByText(container, "no spots remaining")).toBeInTheDocument()
  })
  // it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
  //   const { debug } = render(<Application />);
  //   const container = document.body
  //   await waitForElement(() => getByText(container, "Archie Cohen"));
  //   const appointments = getAllByTestId(container, "appointment-input")
  //   const appointment = appointments[1]
  //   fireEvent.click(getByAltText(appointment, "Delete"))
  //   let val = await act( () => Promise.resolve(fireEvent.click(getByText(container, "Confirm"))));
  //   await waitForElement(() => getByAltText(appointment, "Add"))
  //   expect(queryByText(appointment, "Archie Cohen")).toBeNull();
  //   expect(getByText(container, "2 spots remaining")).toBeInTheDocument()

  // });
  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    cleanup();
    const { debug } = render(<Application />);
    let container = document.body
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // console.log(prettyDOM(container))
    const appointments = getAllByTestId(container, "appointment-input")
    const appointment = appointments[1];
    fireEvent.click(getByAltText(appointment, "Edit"))
    expect(getByText(appointment, "Save")).toBeInTheDocument();
    fireEvent.click(getByAltText(appointment, "Tori Malcolm"))
    fireEvent.click(getByText(appointment, "Save"))
    await waitForElement(() => getByText(container, "Tori Malcolm"));
    expect(getByText(container, "1 spot remaining")).toBeInTheDocument()

  })
  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { debug} = render(<Application />)
    const container = document.body
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment-input")
    const appointment = appointments[0]

    fireEvent.click(getByAltText(appointment, "Add"))

    let press = await act(() => Promise.resolve(fireEvent.change(getByPlaceholderText(container,'Enter Student Name'), {
      target: { value: "Lydia Miller-Jones" }
    })))
    
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))

    expect(getByText(appointment, "Save")).toBeInTheDocument()

    let val = await act( () => Promise.resolve(fireEvent.click(getByText(container, "Save"))));
    await waitForElement(() => getByText(container, "Error"))
  });
  it("shows the delete error when failing to delete an appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    const { debug } = render(<Application />);
    const container = document.body
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment-input")
    const appointment = appointments[1]
    fireEvent.click(getByAltText(appointment, "Delete"))
    let val = await act( () => Promise.resolve(fireEvent.click(getByText(container, "Confirm"))));
    await waitForElement(() => getByText(container, "Error"))
  })
})
