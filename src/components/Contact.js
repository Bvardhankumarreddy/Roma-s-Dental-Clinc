import React, { useState, useEffect, useRef } from 'react';
import { socialLinksAPI } from '../utils/api';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [socialLinks, setSocialLinks] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const sectionRef = useRef(null);

  useEffect(() => {
    const currentRef = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    const result = await socialLinksAPI.getAll();
    if (result.success) {
      setSocialLinks(result.socialLinks);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <section id="contact" ref={sectionRef} className="bg-white">
      {/* Full Width Map at Top */}
      <div className={`w-full h-[450px] mb-16 transition-all duration-700 relative ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15133.55298105087!2d73.93603807516955!3d18.512890482567594!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c163ecfd1ecb%3A0x87f24f6e9729d374!2sRoma's%20Dental%20Care!5e0!3m2!1sen!2sin!4v1733734800000!5m2!1sen!2sin&markers=color:red%7C18.512890,73.938228"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Roma's Dental Care - Best Dentist in Kharadi & Wadgaon Sheri, Pune"
        ></iframe>
        
        {/* Clickable Location Pin */}
        <a
          href="https://maps.app.goo.gl/wHDCgs7A7K2kiwAQ9"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-8 right-8 bg-white rounded-full p-4 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 group cursor-pointer"
          title="Open in Google Maps"
        >
          <svg 
            className="w-8 h-8 text-red-500 group-hover:text-red-600 transition-colors" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span className="absolute -top-10 right-0 bg-gray-800 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Open in Google Maps
          </span>
        </a>
      </div>

      {/* Content Below Map */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Left Column - Logo, Address & Timings */}
          <div className={`transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Logo */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                Roma's Dental Care
              </h2>
              <p className="text-gray-600 mt-2">Best Dentist in Kharadi & Wadgaon Sheri</p>
            </div>

            {/* Address */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-cyan-500">Address</h3>
              <p className="text-gray-700 leading-relaxed">
                Shop no. 7, Society Complex, SHUBH SHAGUN,<br />
                Old Mundhwa Rd, opposite Bollywood Multiplex,<br />
                Tukaram Nagar, Kharadi, Pune,<br />
                Maharashtra 411014
              </p>
            </div>

            {/* Timings */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-cyan-500">Timings</h3>
              <div className="text-gray-700 space-y-1">
                <p><span className="font-semibold">Mon, Wed - Sun :</span> 10:00 AM - 8:00 PM</p>
                <p><span className="font-semibold">Tuesday :</span> Closed</p>
              </div>
            </div>
          </div>

          {/* Middle Column - Quick Links */}
          <div className={`transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-cyan-500">Quick Links</h3>
            <div className="space-y-3">
              {['Home', 'About Us', 'Services', 'Gallery', 'Reviews', 'Blog', 'Appointment', 'Contact Us'].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center gap-2 text-gray-700 hover:text-cyan-500 transition-colors group"
                >
                  <svg className="w-4 h-4 text-cyan-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Right Column - Contact Us */}
          <div className={`transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-cyan-500">Contact Us</h3>
            
            {/* Phone */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-700">Call Us: <a href="tel:+917499537267" className="text-cyan-500 hover:text-cyan-600 font-medium">7499537267</a>, <a href="tel:+919284338406" className="text-cyan-500 hover:text-cyan-600 font-medium">9284338406</a></p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <a href="mailto:drromadentalcare@gmail.com" className="text-cyan-500 hover:text-cyan-600 font-medium break-all">
                  drromadentalcare@gmail.com
                </a>
              </div>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-600 mb-3">Follow Us</h4>
                <div className="flex gap-3 flex-wrap">
                  {socialLinks.map((link) => (
                    <a
                      key={link.linkId}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg"
                      style={{ backgroundColor: link.color || '#06b6d4' }}
                      title={link.name}
                    >
                      <i className={`${link.icon} text-white text-lg`}></i>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
