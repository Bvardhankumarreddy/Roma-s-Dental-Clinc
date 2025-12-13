import React, { useState, useEffect } from 'react';
import romaLogo from '../assets/roma-logo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    setActiveLink(sectionId);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group flex-shrink-0" onClick={(e) => scrollToSection(e, 'home')}>
            <img 
              src={romaLogo}
              alt="Roma's Dental Care" 
              className="h-10 sm:h-14 w-auto object-contain rounded-lg transform transition-all duration-300 group-hover:scale-105"
            />
            <h1 className="text-sm sm:text-xl lg:text-2xl font-bold text-gray-800 group-hover:text-cyan-500 transition-colors">
              Roma's Dental Care
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {['home', 'about', 'services', 'gallery', 'blog', 'reviews', 'contact'].map((item) => (
              <a 
                key={item}
                href={`#${item}`} 
                onClick={(e) => scrollToSection(e, item)}
                className={`relative font-medium transition-colors duration-300 ${
                  activeLink === item ? 'text-cyan-500' : 'text-gray-700 hover:text-cyan-500'
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-cyan-500 transition-all duration-300 ${
                  activeLink === item ? 'w-full' : 'w-0 hover:w-full'
                }`}></span>
              </a>
            ))}
          </div>

          {/* Right Side - Phone and Book Button */}
          <div className="flex items-center gap-3">
            <a href="tel:+917499537267" className="hidden md:flex items-center text-cyan-500 hover:text-cyan-600 transition-colors">
              <span className="font-semibold">+91 7499537267</span>
            </a>
            <button 
              onClick={(e) => scrollToSection(e, 'appointment')}
              className="bg-cyan-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-cyan-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm"
            >
              Book Appointment
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-cyan-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-4 py-4 space-y-3 bg-gray-50">
            {['home', 'about', 'services', 'gallery', 'blog', 'reviews', 'contact'].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={(e) => scrollToSection(e, item)}
                className={`block px-4 py-2 rounded-lg font-medium transition-all ${
                  activeLink === item 
                    ? 'bg-cyan-500 text-white' 
                    : 'text-gray-700 hover:bg-cyan-100 hover:text-cyan-600'
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </a>
            ))}
            <a href="tel:+917499537267" className="flex items-center gap-2 text-cyan-500 px-4 py-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="font-medium">+91 7499537267</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
