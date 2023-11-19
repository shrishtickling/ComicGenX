import React from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";

const Homepage: React.FC = () => {
  return (
    <div className="home-container">
      <div className="background-image"></div>
      <div className="side">
      <div className="content">
        <h1>Welcome to ComicGenX!</h1>
        <p>
          Unleash your creativity and generate amazing comic strips with a few clicks.
        </p>
        <Link to="/comic-form" className="get-started-button">
          Get Started
        </Link>
      </div>
      </div>
      </div>
  );
};

export default Homepage;
