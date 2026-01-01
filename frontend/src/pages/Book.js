import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const eventOptions = [
  { name: "Art Gallery Opening", price: 25 },
  { name: "Comedy Night Show", price: 30 },
  { name: "Food & Wine Expo", price: 45 },
  { name: "Halloween Costume Party", price: 20 },
  { name: "Jazz & Blues Night", price: 35 },
  { name: "New Year Gala Night", price: 75 },
  { name: "Music Festival", price: 60 },
  { name: "Summer Beach Party", price: 40 },
  { name: "Tech Conference 2025", price: 120 },
  { name: "Winter Sports Festival", price: 50 },
];

function Book() {
  const location = useLocation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    eventName: "",
    tickets: 1,
    price: 0
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (location && location.state) {
      const s = location.state;

      if (s.name || s.title) {
        const name = s.name || s.title;
        const ev = eventOptions.find(e => e.name === name);

        setForm(f => ({
          ...f,
          eventName: name,
          price: s.price ?? (ev ? ev.price : 0)
        }));
      }
    }
  }, [location]);

  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Full name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!form.eventName) newErrors.eventName = "Please select an event";

    if (!form.tickets || form.tickets <= 0) {
      newErrors.tickets = "Tickets must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ FIXED SUBMIT (POST TO BACKEND)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const bookingData = {
      full_name: form.name,
      email: form.email,
      event_id: eventOptions.findIndex(e => e.name === form.eventName) + 1,
      tickets: form.tickets,
      total_price: form.price * form.tickets
    };

    try {
      const res = await fetch("http://localhost:5000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });

      await res.json();

      if (!res.ok) {
        alert("Booking failed ❌");
        return;
      }

      alert("Booking successful ✅");

      setForm({
        name: "",
        email: "",
        eventName: "",
        tickets: 1,
        price: 0
      });

    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "eventName") {
      const ev = eventOptions.find(x => x.name === value);
      setForm({ ...form, eventName: value, price: ev ? ev.price : 0 });
    } else if (name === "tickets") {
      setForm({ ...form, tickets: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Book an Event</h1>
      <p className="text-center mb-4">Please fill the details to complete your booking.</p>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body p-4">

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    value={form.name}
                    onChange={handleChange}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Select Event</label>
                  <select
                    name="eventName"
                    className={`form-select ${errors.eventName ? "is-invalid" : ""}`}
                    value={form.eventName}
                    onChange={handleChange}
                  >
                    <option value="">-- Choose an event --</option>
                    {eventOptions.map((event, index) => (
                      <option key={index} value={event.name}>
                        {event.name} — ${event.price}
                      </option>
                    ))}
                  </select>
                  {errors.eventName && (
                    <div className="invalid-feedback">{errors.eventName}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Number of Tickets</label>
                  <input
                    type="number"
                    name="tickets"
                    min={1}
                    className={`form-control ${errors.tickets ? "is-invalid" : ""}`}
                    value={form.tickets}
                    onChange={handleChange}
                  />
                  {errors.tickets && (
                    <div className="invalid-feedback">{errors.tickets}</div>
                  )}
                </div>

                <div className="mb-3">
                  <strong>Total:</strong> ${ (form.price * form.tickets).toFixed(2) }
                </div>

                <button className="btn btn-primary w-100" type="submit">
                  Confirm Booking
                </button>

              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Book;
