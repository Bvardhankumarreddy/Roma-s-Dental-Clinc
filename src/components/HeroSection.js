import React, { useState, useEffect, useRef } from 'react';
import { homeContentAPI } from '../utils/api';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [content, setContent] = useState({
    tagline: 'Your Smile, Our Priority',
    heading: 'Experience',
    highlightedText: 'World-Class Dental Care',
    description: 'Complete dental solutions with 10+ specialties and 1000+ satisfied patients. From routine checkups to advanced procedures, we\'re here for your whole family.',
    heroImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80',
    openingHours: {
      days: '6 Days',
      time: '10 AM - 8 PM',
      closedDay: 'Tuesday'
    },
    phoneNumber: '+917499537267',
    whatsappNumber: '917499537267'
  });
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const result = await homeContentAPI.get();
        if (result.success && result.content) {
          setContent(result.content);
        }
      } catch (error) {
        console.error('Error fetching home content:', error);
      }
    };

    fetchContent();
  }, []);

  return (
    <section id="home" ref={sectionRef} className="bg-gradient-to-br from-gray-50 to-cyan-50 py-20 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Tagline */}
        <p className={`text-cyan-600 text-lg mb-6 font-medium flex items-center gap-2 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <span className="inline-block animate-pulse">✨</span>
          {content.tagline}
        </p>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className={`text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
              {content.heading} <span className="text-cyan-500 relative inline-block">
                {content.highlightedText}
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                  <path d="M2 7C43 2, 93 2, 198 7" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round" className="animate-pulse"/>
                </svg>
              </span>
            </h1>
            
            <p className={`text-gray-600 text-lg mb-8 leading-relaxed transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
              {content.description}
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-wrap gap-4 mb-12 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <button 
                onClick={() => {
                  const element = document.getElementById('appointment');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="group bg-cyan-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-cyan-600 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <svg className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="relative z-10">Book Appointment</span>
                <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              
              <a href={`tel:${content.phoneNumber}`} className="group bg-white text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-gray-300 hover:border-cyan-500 flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-500 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>Call Now</span>
              </a>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className={`relative transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-3xl overflow-hidden transform hover:scale-105 transition-transform duration-500 shadow-2xl">
              <img 
                src={content.heroImage} 
                alt="Dentist" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </div>
            
            {/* Floating Card - Opening Hours */}
            <div className="absolute bottom-8 left-8 bg-white rounded-2xl shadow-2xl p-6 flex items-center gap-4 transform hover:scale-110 hover:shadow-3xl transition-all duration-300 cursor-pointer group animate-bounce-slow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <svg className="w-6 h-6 text-green-600 group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-lg group-hover:text-cyan-600 transition-colors">Open {content.openingHours.days}</h4>
                <p className="text-gray-600 text-sm">{content.openingHours.time}</p>
                <p className="text-red-500 text-xs font-medium">Closed on {content.openingHours.closedDay}</p>
              </div>
            </div>
            
            {/* Decorative floating elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-200 rounded-full opacity-50 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyan-300 rounded-full opacity-30 animate-pulse delay-300"></div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <div className="relative">
        <a
          href={`https://wa.me/${content.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="fixed bottom-8 right-8 bg-green-500 rounded-full px-6 py-4 flex items-center gap-3 shadow-2xl hover:bg-green-600 hover:scale-110 transform transition-all duration-300 z-50 animate-bounce-slow group"
        >
          <svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <div className="text-white">
            <p className="text-xs font-medium leading-tight">Queries/Booking?</p>
            <p className="text-sm font-bold">Chat Now!</p>
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></span>
        </a>
        
        {/* Tooltip */}
        {showTooltip && (
          <div className="fixed bottom-24 right-8 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-xl z-50 animate-fade-in">
            <p className="text-sm font-medium">Chat with us on WhatsApp!</p>
            <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>
    </section>
  );
};

// Animated Counter Component
const StatCounter = ({ end, duration, suffix, label, isVisible }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        const displayValue = end > 100 ? Math.floor(end * progress / 1000) * 1000 : Math.floor(end * progress);
        setCount(displayValue);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible]);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return num.toLocaleString();
    }
    return num;
  };

  return (
    <div className="group cursor-pointer transform hover:scale-110 transition-transform duration-300">
      <h3 className="text-4xl font-bold text-cyan-500 mb-1 group-hover:text-cyan-600 transition-colors">
        {formatNumber(count)}{suffix}
      </h3>
      <p className="text-gray-600 group-hover:text-gray-800 transition-colors">{label}</p>
    </div>
  );
};

export default HeroSection;
