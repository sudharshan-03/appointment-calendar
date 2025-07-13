import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import CalendarView from "./Components/CalendarView";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/calendar" element={<CalendarView />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
