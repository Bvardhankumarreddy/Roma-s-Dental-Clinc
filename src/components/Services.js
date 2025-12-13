import React, { useState, useEffect, useRef } from 'react';
import { servicesAPI } from '../utils/api';

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedServices, setExpandedServices] = useState({});
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
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const result = await servicesAPI.getAll();
      if (result.success && result.services) {
        const servicesWithIcons = result.services.map((service, index) => ({
          ...service,
          icon: getServiceIcon(index),
          gradient: getServiceGradient(index)
        }));
        setServices(servicesWithIcons);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading services:', error);
      setLoading(false);
    }
  };

  const getServiceIcon = (index) => {
    const icons = [
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>,
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>,
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>,
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>,
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>,
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>,
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>,
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
      </svg>,
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>,
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>,
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>,
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ];
    return icons[index % icons.length];
  };

  const getServiceGradient = (index) => {
    const gradients = [
      'from-cyan-400 to-blue-500',
      'from-blue-400 to-indigo-500',
      'from-purple-400 to-pink-500',
      'from-red-400 to-pink-500',
      'from-yellow-400 to-orange-500',
      'from-gray-400 to-gray-600',
      'from-green-400 to-emerald-500',
      'from-cyan-400 to-teal-500',
      'from-pink-400 to-rose-500',
      'from-indigo-400 to-purple-500',
      'from-orange-400 to-red-500',
      'from-teal-400 to-cyan-500'
    ];
    return gradients[index % gradients.length];
  };

  const isLongDescription = (text) => {
    if (!text) return false;
    const lines = text.split('\n').length;
    return lines > 3 || text.length > 150;
  };

  const getTruncatedText = (text) => {
    if (!text) return '';
    const firstThreeLines = text.split('\n').slice(0, 3).join('\n');
    return firstThreeLines.length > 150 ? firstThreeLines.substring(0, 150) + '...' : firstThreeLines;
  };

  const toggleExpanded = (serviceId) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const maxIndex = services.length > 0 ? Math.ceil(services.length / itemsPerView) - 1 : 0;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section id="services" ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className={`text-cyan-500 text-sm font-semibold uppercase tracking-wider mb-3 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            Our Services
          </p>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Comprehensive Dental Care
          </h2>
          <p className={`text-gray-600 text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            From routine checkups to advanced treatments, we offer complete dental solutions for your entire family
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No services available. Please add services from the admin panel.
          </div>
        ) : (
          <>
            {/* Services Slider */}
            <div className="relative">
              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl hover:bg-cyan-50 transition-all transform hover:scale-110"
                aria-label="Previous services"
              >
                <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl hover:bg-cyan-50 transition-all transform hover:scale-110"
                aria-label="Next services"
              >
                <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Slider Container */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`
                  }}
                >
                  {Array.from({ length: Math.ceil(services.length / itemsPerView) }).map((_, slideIndex) => (
                    <div
                      key={slideIndex}
                      className="w-full flex-shrink-0"
                    >
                      <div className={`grid gap-8 ${itemsPerView === 1 ? 'grid-cols-1' : itemsPerView === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                        {services
                          .slice(slideIndex * itemsPerView, (slideIndex + 1) * itemsPerView)
                          .map((service) => {
                            const isExpanded = expandedServices[service.serviceId];
                            const hasLongDescription = isLongDescription(service.description);
                            const displayText = hasLongDescription && !isExpanded 
                              ? getTruncatedText(service.description) 
                              : service.description;

                            return (
                              <div
                                key={service.serviceId}
                                className={`group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                              >
                                {/* Icon */}
                                <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                  {service.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-cyan-600 transition-colors">
                                  {service.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-4 whitespace-pre-line">
                                  {displayText}
                                </p>

                                {/* Read More/Less Button */}
                                {hasLongDescription && (
                                  <button 
                                    onClick={() => toggleExpanded(service.serviceId)}
                                    className="text-cyan-500 font-semibold flex items-center gap-2 hover:text-cyan-600 transition-all"
                                  >
                                    {isExpanded ? 'Read Less' : 'Read More'}
                                    <svg 
                                      className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                                      fill="none" 
                                      stroke="currentColor" 
                                      viewBox="0 0 24 24"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: Math.ceil(services.length / itemsPerView) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'bg-cyan-500 w-8' : 'bg-gray-300 w-2 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* CTA Section */}
        <div className={`mt-16 text-center transition-all duration-700 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Not Sure Which Service You Need?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Our expert dentists will guide you to the best treatment for your needs
            </p>
            <button
              onClick={() => {
                const appointmentSection = document.getElementById('appointment');
                if (appointmentSection) {
                  appointmentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="bg-white text-cyan-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Book a Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
