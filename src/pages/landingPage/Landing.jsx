{/*import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderLanding from "./HeaderLanding";
import './landing.css';
//import landingImg from "../assets/landing-preview.png"; // hình minh hoạ web

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <Header />
      <div className="landing-content">
        <div className="text-section">
          <h1>Learn Smarter, Not Harder.</h1>
          <p>
            Chào mừng bạn đến với MyWeb — nền tảng học tập thông minh giúp bạn
            quản lý thời gian, duy trì streak, và đạt được mục tiêu mỗi ngày.
          </p>
          <button onClick={() => navigate("/candidate/home")} className="btn-primary">
            Get Started
          </button>
        </div>

        <div className="image-section">
        </div>
      </div>
    </div>
  );
}*/}
import React from 'react'
import { useNavigate } from "react-router-dom";
import HeaderLanding from './HeaderLanding';
import './landing.css';
function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <HeaderLanding/>
      <div className="landing-content">
        <div className="text-section">
          <h1>Learn Smarter, Not Harder.</h1>
          <p>
            Chào mừng bạn đến với MyWeb — nền tảng học tập thông minh giúp bạn
            quản lý thời gian, duy trì streak, và đạt được mục tiêu mỗi ngày.
          </p>
          <button onClick={() => navigate("/homepage")} className="btn-primary">
            Get Started
          </button>
        </div>

        <div className="image-section">
          <img src="https://res.cloudinary.com/upwork-cloud-acquisition-prod/image/upload/arges/baseline-hero/hero-desktop.webp" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Landing
