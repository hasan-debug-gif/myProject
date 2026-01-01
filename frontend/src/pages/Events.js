import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  fetch("http://localhost:5000/events")
    .then(res => res.json())
    .then(data => setEvents(data))
    .catch(err => console.error(err));
}, []);

  const handleBook = (event) => {
    navigate("/book", { state: event });
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-5">Upcoming Events</h1>
      <div className="row g-4">
        {events.map((ev) => (
          <div className="col-md-6 col-lg-4" key={ev.id}>
            <div className="card h-100 shadow-sm event-card">

              {/* Event Image */}
              <div className="position-relative event-image-wrap">
                <img
                  src={process.env.PUBLIC_URL + '/images/' + ev.image}
                  className="card-img-top event-img"
                  alt={ev.name}
                  loading="lazy"
                />

                {/* Price Badge */}
                <div className="badge-price">${ev.price}</div>

                {/* Capacity Badge */}
                <div className="badge-capacity">👥 {ev.capacity}</div>

                {/* Overlay: Date, Time, Venue, Description */}
                <div className="image-overlay p-2">
                  <div className="overlay-row">
                    📅 {new Date(ev.event_date).toLocaleDateString()} ⏰ {ev.event_time}
                  </div>
                  <div className="overlay-row">📍 {ev.venue}</div>
                  <div className="overlay-row small-desc">{ev.description}</div>
                </div>
              </div>

              {/* Card Body */}
              <div className="card-body d-flex flex-column">
                <h3 className="event-title">{ev.name}</h3>

                {/* Tags */}
                <div className="hashtags mb-2">
                  {ev.tags?.split(",").map((t, i) => (
                    <span key={i} className="hash me-1">#{t}</span>
                  ))}
                </div>

                {/* Book Button */}
                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => handleBook(ev)}
                >
                  Book Now
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}