import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function About() {
  const aboutCards = [
    {
      emoji: "🎉",
      title: "Our Mission",
      text: "To connect people with amazing experiences and make event discovery and booking effortless and fun."
    },
    {
      emoji: "💡",
      title: "Our Vision",
      text: "To be the go-to platform for events, inspiring organizers to create unforgettable moments and reach more audiences."
    },
    {
      emoji: "🤝",
      title: "Our Team",
      text: "Led by Hasan Hellani, the admin and creator of Eventify, our team is passionate about events, technology, and seamless user experiences."
    },
    {
      emoji: "🚀",
      title: "Why Eventify?",
      text: "Because finding and booking events should be exciting, simple, and memorable. Eventify gives you full control and inspiration for your next adventure."
    },
    {
      emoji: "🎨",
      title: "Creative Experiences",
      text: "From art to music, tech to food, Eventify ensures every event feels special. Our platform celebrates creativity and community."
    },
    {
      emoji: "✨",
      title: "Future Plans",
      text: "We're constantly improving, adding new features, and expanding to make Eventify the ultimate destination for event lovers everywhere."
    }
  ];

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">About Eventify</h1>
      <p className="text-center mb-5">
        Eventify is your ultimate platform to discover, book, and enjoy unforgettable events. From music festivals and tech conferences to themed parties and art exhibitions, Eventify brings people together for experiences that last a lifetime.
      </p>

      <div className="row g-4">
        {aboutCards.map((card, index) => (
          <div className="col-md-6 col-lg-4" key={index}>
            <div className="team-card p-4 shadow-sm text-center about-card">
              <div className="avatar mb-3 animated-emoji">{card.emoji}</div>
              <h5>{card.title}</h5>
              <p className="text-muted">{card.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
