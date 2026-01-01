import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Organizer() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    image: "",
    price: 0,
    event_date: "",
    event_time: "",
    venue: "",
    capacity: 0,
    tags: "",
    description: ""
  });

  const [editing, setEditing] = useState(false);

  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/events");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  // Handle input change
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Add or Update Event
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`http://localhost:5000/events/${form.id}`, form);
        setEditing(false);
      } else {
        await axios.post("http://localhost:5000/events", form);
      }
      setForm({ id:null, name:"", image:"", price:0, event_date:"", event_time:"", venue:"", capacity:0, tags:"", description:"" });
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit Event
  const handleEdit = ev => {
    setForm(ev);
    setEditing(true);
  };

  // Delete Event
  const handleDelete = async id => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`http://localhost:5000/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Organizer Panel</h1>

      <form onSubmit={handleSubmit} className="mb-4 border p-3 rounded">
        <h5>{editing ? "Edit Event" : "Add Event"}</h5>
        {["name","image","price","event_date","event_time","venue","capacity","tags","description"].map(field => (
          <div className="mb-2" key={field}>
            <label className="form-label">{field.replace("_"," ")}</label>
            <input
              type={field==="price" || field==="capacity" ? "number" : "text"}
              className="form-control"
              name={field}
              value={form[field]}
              onChange={handleChange}
            />
          </div>
        ))}
        <button className="btn btn-primary" type="submit">{editing ? "Update" : "Add"} Event</button>
      </form>

      <h5>All Events</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            {["ID","Name","Price","Date","Time","Venue","Capacity","Tags","Description","Actions"].map(h => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {events.map(ev => (
            <tr key={ev.id}>
              <td>{ev.id}</td>
              <td>{ev.name}</td>
              <td>{ev.price}</td>
              <td>{ev.event_date}</td>
              <td>{ev.event_time}</td>
              <td>{ev.venue}</td>
              <td>{ev.capacity}</td>
              <td>{ev.tags}</td>
              <td>{ev.description}</td>
              <td>
                <button className="btn btn-sm btn-warning me-1" onClick={()=>handleEdit(ev)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(ev.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
