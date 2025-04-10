import { BrowserRouter, Route, Routes } from "react-router-dom";

import Benefits from './components/Benefits';
import Button from './components/Button';
import ButtonGradient from './assets/svg/ButtonGradient';
import Chart from './components/Chart';
import Features from './components/Features';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import Login from './components/Login';
import Model from './components/Model';
import React from "react";
import Roadmap from './components/Roadmap';
import Signup from './components/Signup';
import Weather from './components/Weather';

function App() {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Routes>
          <Route path="/" element={<>
                <Hero />
                <Roadmap />
              </>} />
          <Route path="/benefits" element={<Benefits />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/login" element={<Login />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chart" element={<Chart />} />
          <Route path="/model" element={<Model />} />
          <Route path="/features" element={<Features />} />
        </Routes>
        <Footer />
      </div>
      <ButtonGradient />
    </>

  );
}

export default App;