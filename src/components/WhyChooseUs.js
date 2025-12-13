import React, { useState, useEffect, useRef } from 'react';
import { statsAPI } from '../utils/api';

const WhyChooseUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [stats, setStats] = useState({
    happyPatients: 1000,
    specialists: 10
  });
  const sectionRef = useRef(null);

  // Calculate years of experience based on founding date (July 26, 2012)
  useEffect(() => {
    const foundingDate = new Date('2012-07-26');
    const today = new Date();
    
    let years = today.getFullYear() - foundingDate.getFullYear();
    
    // If current date hasn't passed July 26 this year, subtract 1
    const currentYearAnniversary = new Date(today.getFullYear(), 6, 26); // Month is 0-indexed, so 6 = July
    if (today < currentYearAnniversary) {
      years--;
    }
    
    setYearsOfExperience(years);
  }, []);

  // Fetch dynamic stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await statsAPI.get();
        if (result.success && result.stats) {
          setStats({
            happyPatients: result.stats.happyPatients || 1000,
            specialists: result.stats.specialists || 10
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

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

  return (
    <section id="why-choose-us" ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className={`text-cyan-500 text-sm font-semibold uppercase tracking-wider mb-3 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            WHY CHOOSE US
          </p>
          <h2 className={`text-4xl lg:text-5xl font-bold text-gray-900 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            The Roma's Dental Care <span className="text-cyan-500">Advantage</span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Stat 1 - Years of Experience */}
          <div className={`text-center group transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition-all duration-300 group-hover:scale-110">
                <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <StatCounter end={yearsOfExperience} suffix="+" label="Years Of Experience" isVisible={isVisible} />
            <p className="text-gray-600 mt-4 leading-relaxed">
              Over a decade of excellence in dental care and patient satisfaction
            </p>
          </div>

          {/* Stat 2 - Happy Patients */}
          <div className={`text-center group transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition-all duration-300 group-hover:scale-110">
                <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
            </div>
            <StatCounter end={stats.happyPatients} suffix="+" label="Happy Patients" isVisible={isVisible} />
            <p className="text-gray-600 mt-4 leading-relaxed">
              Trusted by thousands of families for their complete dental needs
            </p>
          </div>

          {/* Stat 3 - Specialists */}
          <div className={`text-center group transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition-all duration-300 group-hover:scale-110">
                <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
              </div>
            </div>
            <StatCounter end={stats.specialists} suffix="+" label="Specialists & Superspecialists" isVisible={isVisible} />
            <p className="text-gray-600 mt-4 leading-relaxed">
              Expert team covering all aspects of modern dental care
            </p>
          </div>
        </div>

        {/* Additional Benefits */}
        <div className={`mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Advanced Technology</h3>
            <p className="text-gray-600 text-sm">State-of-the-art equipment for precise diagnosis and treatment</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Flexible Hours</h3>
            <p className="text-gray-600 text-sm">Open Mon, Wed-Sun, 10 AM - 8 PM • Closed on Tuesday</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Affordable Care</h3>
            <p className="text-gray-600 text-sm">Quality dental services at competitive prices with flexible payment options</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Comfortable Experience</h3>
            <p className="text-gray-600 text-sm">Patient-friendly environment with painless procedures</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Animated Counter Component
const StatCounter = ({ end, suffix, label, isVisible }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / 2000;

      if (progress < 1) {
        const displayValue = Math.floor(end * progress);
        setCount(displayValue);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, isVisible]);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return num.toLocaleString();
    }
    return num;
  };

  return (
    <div>
      <h3 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-2">
        {formatNumber(count)}{suffix}
      </h3>
      <p className="text-lg font-semibold text-gray-700">{label}</p>
    </div>
  );
};

export default WhyChooseUs;
