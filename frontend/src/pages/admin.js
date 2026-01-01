import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Admin() {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);

  const [showEventModal, setShowEventModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const [currentEvent, setCurrentEvent] = useState({});
  const [currentBooking, setCurrentBooking] = useState({});
  const [currentMessage, setCurrentMessage] = useState({});

  // Fetch data
  useEffect(() => {
    fetchEvents();
    fetchBookings();
    fetchMessages();
  }, []);

  const fetchEvents = () => {
    axios.get("http://localhost:5000/admin/events")
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  };

  const fetchBookings = () => {
    axios.get("http://localhost:5000/bookings")
      .then(res => setBookings(res.data))
      .catch(err => console.error(err));
  };

  const fetchMessages = () => {
    axios.get("http://localhost:5000/messages")
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));
  };

  // DELETE
  const deleteEvent = (id) => {
    if (window.confirm("Delete this event?")) {
      axios.delete(`http://localhost:5000/events/${id}`).then(fetchEvents);
    }
  };

  const deleteBooking = (id) => {
    if (window.confirm("Delete this booking?")) {
      axios.delete(`http://localhost:5000/bookings/${id}`).then(fetchBookings);
    }
  };

  const deleteMessage = (id) => {
    if (window.confirm("Delete this message?")) {
      axios.delete(`http://localhost:5000/messages/${id}`).then(fetchMessages);
    }
  };

  // EDIT (OPEN MODAL)
  const editEvent = (ev) => {
    setCurrentEvent(ev);
    setShowEventModal(true);
  };

  const editBooking = (b) => {
    setCurrentBooking(b);
    setShowBookingModal(true);
  };

  const editMessage = (m) => {
    setCurrentMessage(m);
    setShowMessageModal(true);
  };

  // SAVE EDITS
  const saveEvent = () => {
    const { id, name, price, event_date, event_time, venue, capacity } = currentEvent;
    axios.put(`http://localhost:5000/events/${id}`, { name, price, event_date, event_time, venue, capacity })
      .then(() => {
        fetchEvents();
        setShowEventModal(false);
      });
  };

  const saveBooking = () => {
    const { id, full_name, email, event_id, tickets, total_price } = currentBooking;
    axios.put(`http://localhost:5000/bookings/${id}`, { full_name, email, event_id, tickets, total_price })
      .then(() => {
        fetchBookings();
        setShowBookingModal(false);
      });
  };

  const saveMessage = () => {
    const { id, name, email, message } = currentMessage;
    axios.put(`http://localhost:5000/messages/${id}`, { name, email, message })
      .then(() => {
        fetchMessages();
        setShowMessageModal(false);
      });
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">🎉 Admin Panel</h1>

      {/* Events Table */}
      <h4 className="mt-4">Events</h4>
      <table className="table table-bordered table-hover">
        <thead className="table-primary">
          <tr>
            <th>ID</th><th>Name</th><th>Price</th><th>Date</th><th>Time</th><th>Venue</th><th>Capacity</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(ev => (
            <tr key={ev.id}>
              <td>{ev.id}</td>
              <td>{ev.name}</td>
              <td>${ev.price}</td>
              <td>{ev.event_date}</td>
              <td>{ev.event_time}</td>
              <td>{ev.venue}</td>
              <td>{ev.capacity}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => editEvent(ev)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteEvent(ev.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bookings Table */}
      <h4 className="mt-5">Bookings</h4>
      <table className="table table-bordered table-hover">
        <thead className="table-success">
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Event ID</th><th>Tickets</th><th>Total Price</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.full_name}</td>
              <td>{b.email}</td>
              <td>{b.event_id}</td>
              <td>{b.tickets}</td>
              <td>${b.total_price}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => editBooking(b)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteBooking(b.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Messages Table */}
      <h4 className="mt-5">Messages</h4>
      <table className="table table-bordered table-hover">
        <thead className="table-info">
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Message</th><th>Created At</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.map(m => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>{m.message}</td>
              <td>{m.created_at}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => editMessage(m)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteMessage(m.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modals */}
      <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
        <Modal.Header closeButton><Modal.Title>Edit Event</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control value={currentEvent.name || ''} onChange={e => setCurrentEvent({...currentEvent, name: e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" value={currentEvent.price || ''} onChange={e => setCurrentEvent({...currentEvent, price: e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" value={currentEvent.event_date || ''} onChange={e => setCurrentEvent({...currentEvent, event_date: e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Time</Form.Label>
              <Form.Control type="time" value={currentEvent.event_time || ''} onChange={e => setCurrentEvent({...currentEvent, event_time: e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Venue</Form.Label>
              <Form.Control value={currentEvent.venue || ''} onChange={e => setCurrentEvent({...currentEvent, venue: e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Capacity</Form.Label>
              <Form.Control type="number" value={currentEvent.capacity || ''} onChange={e => setCurrentEvent({...currentEvent, capacity: e.target.value})}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEventModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={saveEvent}>Save</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
        <Modal.Header closeButton><Modal.Title>Edit Booking</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Full Name</Form.Label>
              <Form.Control value={currentBooking.full_name || ''} onChange={e => setCurrentBooking({...currentBooking, full_name: e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control value={currentBooking.email || ''} onChange={e => setCurrentBooking({...currentBooking, email: e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Event ID</Form.Label>
              <Form.Control type="number" value={currentBooking.event_id || ''} onChange={e => setCurrentBooking({...currentBooking, event_id: e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Tickets</Form.Label>
              <Form.Control type="number" value={currentBooking.tickets || ''} onChange={e => setCurrentBooking({...currentBooking, tickets: e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Total Price</Form.Label>
              <Form.Control type="number" value={currentBooking.total_price || ''} onChange={e => setCurrentBooking({...currentBooking, total_price: e.target.value})}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookingModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={saveBooking}>Save</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)}>
        <Modal.Header closeButton><Modal.Title>Edit Message</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control value={currentMessage.name || ''} onChange={e => setCurrentMessage({...currentMessage, name: e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control value={currentMessage.email || ''} onChange={e => setCurrentMessage({...currentMessage, email: e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" rows={3} value={currentMessage.message || ''} onChange={e => setCurrentMessage({...currentMessage, message: e.target.value})}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMessageModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={saveMessage}>Save</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}
