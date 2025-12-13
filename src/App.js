import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import About from './components/About';
import WhyChooseUs from './components/WhyChooseUs';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Blog from './components/Blog';
import BookAppointment from './components/BookAppointment';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/admin/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Panel Route */}
        <Route path="/admin" element={<AdminPanel />} />
        
        {/* Main Website Route */}
        <Route path="/" element={
          <div className="App">
            <Navbar />
            <HeroSection />
            <About />
            <WhyChooseUs />
            <Services />
            <Gallery />
            <Blog />
            <BookAppointment />
            <Reviews />
            <Contact />
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
