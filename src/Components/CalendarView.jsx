// Responsive Calendar View with Mobile and Desktop support
import React, { useState, useEffect } from "react";
import { Calendar } from "react-calendar";
import patients from "../data/patients.json";
import doctors from "../data/doctors.json";
import initialAppointments from "../data/appointments.json";
import "react-calendar/dist/Calendar.css";
import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function CalendarView() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);
  const [appointments, setAppointments] = useState(() => {
    const stored = localStorage.getItem("appointments");
    return stored ? JSON.parse(stored) : initialAppointments;
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [helperMessage, setHelperMessage] = useState("");
  const [addAppointment, setAddAppointments] = useState({
    id: "",
    date: "",
    time: "",
    patientId: "",
    doctorId: "",
  });

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDayClick = (dateObj) => {
    setSelectedDate(dateObj);
    setShowForm(true);
  };

  const addEvent = (e) => {
    e.preventDefault();
    const { id, doctorId, patientId, time } = addAppointment;
    if (!doctorId || !patientId || !time) {
      return setHelperMessage("Please Enter all fields");
    }
    const newEntry = {
      ...addAppointment,
      date: selectedDate.toISOString().split("T")[0],
    };
    if (id) {
      setAppointments(appointments.map((a) => (a.id === id ? newEntry : a)));
    } else {
      setAppointments([
        ...appointments,
        { ...newEntry, id: appointments.length + 1 },
      ]);
    }
    resetForm();
  };

  const handleEdit = (appointment) => {
    setAddAppointments(appointment);
    setSelectedDate(new Date(appointment.date));
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setAppointments(appointments.filter((a) => a.id !== id));
  };

  const resetForm = () => {
    setHelperMessage("");
    setShowForm(false);
    setAddAppointments({
      id: "",
      date: "",
      time: "",
      patientId: "",
      doctorId: "",
    });
  };

  const renderAppointments = (dateObj, view) => {
    if (view !== "month") return null;
    const dateStr = dateObj.toISOString().split("T")[0];
    const dayAppointments = appointments.filter((a) => a.date === dateStr);
    return (
      <div className="mt-1 space-y-1">
        {dayAppointments.map((app) => {
          const patient = patients.find((p) => p.id === app.patientId)?.name;
          return (
            <div
              key={app.id}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(app);
              }}
              className="text-[10px] text-blue-700 flex justify-between items-center gap-1 cursor-pointer"
            >
              <span className="truncate">
                {app.time} - {patient}
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(app.id);
                }}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                ✕
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMobileView = () => {
    const selectedStr = date.toISOString().split("T")[0];
    const filtered = appointments.filter((a) => a.date === selectedStr);
    return (
      <div className="w-full px-4 py-4 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Appointments</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-gray-800 text-white w-10 h-10 px-3 py-1 rounded-full text-sm"
            >
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-red-500 text-white h-10 w-10 px-3 py-1 rounded-full"
              title="logout"
            >
              <FontAwesomeIcon icon={faPowerOff} />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setDate(new Date())}
            className="bg-amber-500 text-white px-3 py-1 rounded text-sm"
          >
            Today
          </button>
          <input
            type="date"
            value={date.toISOString().split("T")[0]}
            onChange={(e) => setDate(new Date(e.target.value))}
            className="border rounded px-2 py-1 w-2/3"
          />
        </div>

        <ul className="space-y-2">
          {filtered.map((app) => (
            <li key={app.id} className="border p-2 rounded shadow-sm">
              <div className="text-sm font-medium">
                {app.time} -{" "}
                {patients.find((p) => p.id === app.patientId)?.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-300">
                Doctor: {doctors.find((d) => d.id === app.doctorId)?.name}
              </div>
              <div className="text-right text-xs text-red-500">
                <button onClick={() => handleEdit(app)}>Edit</button> |
                <button onClick={() => handleDelete(app.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
        <button
          onClick={() => {
            setSelectedDate(date);
            setShowForm(true);
          }}
          className="mt-4 w-full bg-amber-500 text-white py-2 rounded"
        >
          Add Appointment
        </button>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen w-full ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="p-6 flex flex-col items-center">
        {!isMobile ? (
          <>
            <div className="flex justify-between items-center w-[90%] mb-2">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Appointments
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setDate(new Date())}
                  className="bg-amber-500 px-3 py-1 text-white rounded"
                >
                  Today
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="bg-gray-800 text-white h-10 w-10 px-3 py-1 rounded-full"
                >
                  <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="bg-red-500 text-white h-10 w-10 px-3 py-1 rounded-full"
                  title="logout"
                >
                  <FontAwesomeIcon icon={faPowerOff} />
                </button>
              </div>
            </div>
            <div className="w-full px-4 sm:px-6">
              <Calendar
                key={date.toISOString()}
                value={date}
                onChange={setDate}
                onClickDay={handleDayClick}
                tileContent={({ date, view }) => renderAppointments(date, view)}
                calendarType="gregory"
                className="w-full calendar-custom"
              />
            </div>
          </>
        ) : (
          renderMobileView()
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">
              Add Appointment for {selectedDate?.toDateString()}
            </h2>
            <form onSubmit={addEvent} className="space-y-2">
              <div>
                <label>Patient:</label>
                <select
                  value={addAppointment.patientId}
                  onChange={(e) =>
                    setAddAppointments({
                      ...addAppointment,
                      patientId: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Select</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Doctor:</label>
                <select
                  value={addAppointment.doctorId}
                  onChange={(e) =>
                    setAddAppointments({
                      ...addAppointment,
                      doctorId: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Select</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Time:</label>
                <input
                  type="time"
                  value={addAppointment.time}
                  onChange={(e) =>
                    setAddAppointments({
                      ...addAppointment,
                      time: e.target.value,
                    })
                  }
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              {helperMessage && (
                <p className="text-red-500 text-sm">{helperMessage}</p>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-4 py-1 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarView;
