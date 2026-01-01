import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.message.trim()) newErrors.message = 'Message cannot be empty';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name,
      email: form.email,
      message: form.message,
      created_at: new Date().toISOString()
    };

    try {
      const res = await fetch("http://localhost:5000/messages", {  // Make sure your backend route exists
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to send message");

      alert("Message sent successfully!");
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error(error);
      alert("There was an error sending your message.");
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Contact Us</h1>
      <p className="text-center text-muted mb-4">We'd love to hear from you — questions, partnership inquiries or event submissions.</p>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card shadow">
            <div className="card-body p-4">
              <h5 className="mb-3">Send us a message</h5>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@email.com"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea
                    name="message"
                    rows={6}
                    className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your question or request..."
                  ></textarea>
                  {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-primary" type="submit">Send Message</button>
                  <button className="btn btn-outline-secondary" type="button" onClick={() => setForm({ name: '', email: '', message: '' })}>Clear</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="contact-card p-4 shadow-sm">
            <h5 className="mb-3">Contact & Support</h5>
            <p className="mb-1"><FaEnvelope className="me-2 text-primary" /> support@eventify.local</p>
            <p className="mb-1"><FaPhone className="me-2 text-primary" /> +961 70 000 000</p>
            <p className="mb-1"><FaMapMarkerAlt className="me-2 text-primary" /> Beirut, Lebanon</p>
            <p className="mb-3"><FaClock className="me-2 text-primary" /> Office hours: Mon-Fri, 9:00 — 18:00</p>

            <h6 className="mt-3">Follow us</h6>
            <div className="d-flex gap-3 mt-2">
              <a href="https://www.facebook.com/" className="text-decoration-none text-muted"><FaFacebook size={20} /></a>
              <a href="https://www.instagram.com/" className="text-decoration-none text-muted"><FaInstagram size={20} /></a>
              <a href="https://x.com/" className="text-decoration-none text-muted"><FaTwitter size={20} /></a>
            </div>

            <hr />
            <p className="small text-muted">We aim to reply within 1 business day. For urgent issues please call us.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;