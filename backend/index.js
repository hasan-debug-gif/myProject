// ===============================
// 1. IMPORT REQUIRED PACKAGES
// ===============================
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

// ===============================
// 2. CREATE EXPRESS APP
// ===============================
const app = express();

// ===============================
// 3. MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.json());

// Serve static images from frontend public folder
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ===============================
// 4. DATABASE CONNECTION
// ===============================
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // XAMPP default
  database: 'eventify'
});

db.connect((err) => {
  if (err) console.log('Database connection failed ❌');
  else console.log('Connected to MySQL database ✅');
});

// ===============================
// 5. ROUTES
// ===============================

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// Get all events
app.get('/events', (req, res) => {
  const sql = 'SELECT * FROM events';
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch events' });
    res.json(result);
  });
});
// ===============================
// Organizer CRUD for Events
// ===============================

// CREATE Event
app.post('/events', (req, res) => {
  const { name, image, price, event_date, event_time, venue, capacity, tags, description } = req.body;
  const sql = `INSERT INTO events 
      (name, image, price, event_date, event_time, venue, capacity, tags, description) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [name, image, price, event_date, event_time, venue, capacity, tags, description], (err, result) => {
    if (err) return res.status(500).json({ error: 'Add event failed' });
    res.json({ message: 'Event added successfully' });
  });
});

// READ ALL EVENTS (already exists)
app.get('/events', (req, res) => {
  const sql = 'SELECT * FROM events';
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch events' });
    res.json(result);
  });
});

// UPDATE Event
app.put('/events/:id', (req, res) => {
  const { id } = req.params;
  const { name, image, price, event_date, event_time, venue, capacity, tags, description } = req.body;
  const sql = `UPDATE events SET name=?, image=?, price=?, event_date=?, event_time=?, venue=?, capacity=?, tags=?, description=? WHERE id=?`;
  db.query(sql, [name, image, price, event_date, event_time, venue, capacity, tags, description, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Update failed' });
    res.json({ message: 'Event updated successfully' });
  });
});

// DELETE Event
app.delete('/events/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM events WHERE id=?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.json({ message: 'Event deleted successfully' });
  });
});
// Add a booking
app.post('/bookings', (req, res) => {
  const { full_name, email, event_id, tickets, total_price } = req.body;

  const sql = `
    INSERT INTO bookings (full_name, email, event_id, tickets, total_price)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [full_name, email, event_id, tickets, total_price], (err, result) => {
    if (err) return res.status(500).json({ error: 'Booking failed' });
    res.json({ message: 'Booking successful ✅' });
  });
});

// ===============================
// POST A MESSAGE
// ===============================
app.post('/messages', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if this email exists in bookings
  const findBookingSql = `SELECT id FROM bookings WHERE email = ? LIMIT 1`;

  db.query(findBookingSql, [email], (err, bookingResult) => {
    if (err) return res.status(500).json({ error: 'Database error while checking bookings' });

    let bookingId = null;
    if (bookingResult.length > 0) {
      bookingId = bookingResult[0].id;
    }

    // Insert message into messages table
    const insertMessageSql = `
      INSERT INTO messages (name, email, message, booking_id)
      VALUES (?, ?, ?, ?)
    `;
    db.query(insertMessageSql, [name, email, message, bookingId], (err2, result) => {
      if (err2) return res.status(500).json({ error: 'Failed to save message' });

      res.json({ message: 'Message sent successfully ✅', messageId: result.insertId });
    });
  });
});
// LOGIN ROUTE
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const sql = 'SELECT * FROM users WHERE email = ? LIMIT 1';

  db.query(sql, [email], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    // User exists
    if (result.length > 0) {
      const user = result[0];
      // Check password
      if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid password' });
      }
      return res.json({
        message: 'Login successful ✅',
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role
        }
      });
    }

    // User does not exist → create new normal user
    const insertSql = `INSERT INTO users (full_name, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())`;
    const fullName = email.split('@')[0]; // generate simple name
    db.query(insertSql, [fullName, email, password, 'user'], (err2, result2) => {
      if (err2) return res.status(500).json({ error: 'Failed to create user' });

      return res.json({
        message: 'User created and logged in ✅',
        user: {
          id: result2.insertId,
          full_name: fullName,
          email: email,
          role: 'user'
        }
      });
    });
  });
});
// GET all bookings (for admin)
app.get('/bookings', (req, res) => {
  const sql = 'SELECT * FROM bookings';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch bookings' });
    res.json(results);
  });
});

// GET all messages (for admin)
app.get('/messages', (req, res) => {
  const sql = 'SELECT * FROM messages';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch messages' });
    res.json(results);
  });
});
// ===============================
// GET ALL EVENTS FOR ADMIN
// ===============================
app.get('/admin/events', (req, res) => {
  const sql = 'SELECT * FROM events';
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch events for admin' });
    }
    res.json(result);
  });
});

// Delete booking
app.delete('/bookings/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM bookings WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.json({ message: 'Booking deleted successfully' });
  });
});

// Delete message
app.delete('/messages/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM messages WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.json({ message: 'Message deleted successfully' });
  });
});


// ===============================
// 6. START SERVER
// ===============================
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
