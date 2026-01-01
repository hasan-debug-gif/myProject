import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Events from "./pages/Events";
import Book from "./pages/Book";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Login from './pages/login';
import Admin from "./pages/admin";
import Organizer from "./pages/organizer";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />

        <main className="flex-fill">
          <Routes>
            {/* Login route: only for non-logged in users */}
            <Route 
              path="/login" 
              element={
                !JSON.parse(localStorage.getItem("user")) ? <Login /> : <Navigate to="/events" />
              } 
            />

            {/* Admin route */}
            <Route 
              path="/admin" 
              element={
                <PrivateRoute role="admin">
                  <Admin />
                </PrivateRoute>
              } 
            />

            {/* Organizer route */}
            <Route 
              path="/organizer" 
              element={
                <PrivateRoute role="organizer">
                  <Organizer />
                </PrivateRoute>
              } 
            />

            {/* Events route: any logged in user */}
            <Route 
              path="/events" 
              element={
                <PrivateRoute>
                  <Events />
                </PrivateRoute>
              } 
            />

            {/* Book route: any logged in user */}
            <Route 
              path="/book" 
              element={
                <PrivateRoute>
                  <Book />
                </PrivateRoute>
              } 
            />

            {/* About & Contact pages accessible by anyone */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Default route */}
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
