import React, { useState, useEffect, useRef } from 'react';
import { aboutContentAPI } from '../utils/api';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState({
    subtitle: 'About Us',
    title: 'Welcome to',
    highlightedTitle: 'Roma\'s Dental Care',
    description: 'Your trusted partner for comprehensive dental care in Kharadi & Wadgaon Sheri',
    mainImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80',
    heading: 'Advanced, Gentle Treatments by 13+ Years Experienced Doctor',
    content: 'At Roma\'s Dental Care, we aim to increase awareness about the importance of oral hygiene and dental health. We strongly believe that good oral health contributes to overall wellness.\n\nDr. Roma has worked across various cities and in mobile dental setups, gaining diverse experience and exposure. Her approach is gentle, kind, and compassionate, ensuring a comfortable experience for every patient.\n\nSince awareness about the link between oral health and general health is still limited, we are dedicated to educating our community and providing reliable, patient-focused care.\n\nChoose Roma\'s Dental Care for healthier teeth, healthier gums, and a healthier you.',
    mission: 'To promote oral health awareness and provide compassionate, high-quality dental care to every patient.',
    vision: 'To build a community that understands the deep connection between oral health and overall well-being, and to make quality dental care accessible, comforting, and effective for all.',
    whoWeAre: 'Roma\'s Dental Care is a modern, family-friendly dental clinic in Kharadi, Pune, offering advanced treatments with a compassionate, patient-first approach. Our mission is simple—deliver painless, ethical, and truly caring dentistry backed by the latest technology.',
    technologies: 'Digital X-rays & RVG\nIntraoral scanning\nLaser-assisted dentistry\nRotary endodontics\nSingle-sitting RCT technology\nHigh-standard sterilization\nPremium Zirconia & E-max crowns\nFlexible denture systems',
    features: [
      {
        title: 'State-of-the-Art Equipment',
        description: 'Latest dental technology for precise diagnosis and treatment'
      },
      {
        title: 'Experienced Team',
        description: 'Highly qualified dentists with 10+ specializations'
      },
      {
        title: 'Patient-Centered Care',
        description: 'Comfortable environment with personalized treatment plans'
      }
    ],
    values: [
      {
        title: 'Trust & Safety',
        description: 'Sterilized equipment and strict hygiene protocols for your safety'
      },
      {
        title: 'Affordable Pricing',
        description: 'Quality dental care at competitive prices with flexible payment options'
      },
      {
        title: 'Flexible Hours',
        description: 'Open 6 days a week from 10 AM - 8 PM to fit your schedule'
      }
    ]
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
    const fetchContent = async () => {
      try {
        const result = await aboutContentAPI.get();
        if (result.success && result.content) {
          setContent(result.content);
        }
      } catch (error) {
        console.error('Error fetching about content:', error);
      }
    };

    fetchContent();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className={`text-cyan-500 text-sm font-semibold uppercase tracking-wider mb-3 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            {content.subtitle}
          </p>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {content.title} <span className="text-cyan-500">{content.highlightedTitle}</span>
          </h2>
          <p className={`text-gray-600 text-lg max-w-3xl mx-auto transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {content.description}
          </p>
        </div>

        {/* Mission & Vision */}
        <div className={`grid md:grid-cols-2 gap-8 mb-20 transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">Our Mission</h3>
                <div className="w-12 h-1 bg-cyan-500 rounded-full"></div>
              </div>
            </div>
            <p className="text-gray-600 text-base leading-relaxed">{content.mission}</p>
          </div>
          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">Our Vision</h3>
                <div className="w-12 h-1 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <p className="text-gray-600 text-base leading-relaxed">{content.vision}</p>
          </div>
        </div>

        {/* Who We Are */}
        <div className={`relative bg-gradient-to-br from-cyan-50 via-blue-50 to-white rounded-3xl p-10 md:p-14 mb-20 overflow-hidden transition-all duration-700 delay-300 border border-gray-100 shadow-xl ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
          <div className="relative">
            <div className="inline-block px-4 py-2 bg-white rounded-full shadow-sm mb-4">
              <span className="text-cyan-600 font-semibold text-sm">About Our Clinic</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Who We Are</h3>
            <div className="text-gray-700 text-lg leading-relaxed max-w-4xl whitespace-pre-line">{content.whoWeAre}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left - Image */}
          <div className={`transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={content.mainImage} 
                  alt="Roma's Dental Care Clinic" 
                  className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-cyan-100 rounded-2xl -z-10"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-100 rounded-full -z-10"></div>
            </div>
          </div>

          {/* Right - Content */}
          <div className={`transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              {content.heading}
            </h3>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-6 whitespace-pre-line">
              {content.content}
            </p>

            <div className="space-y-4">
              {content.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500 transition-colors">
                    <svg className="w-6 h-6 text-cyan-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">{feature.title}</h4>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className={`grid md:grid-cols-3 gap-8 transition-all duration-700 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all transform hover:-translate-y-2 group">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">{content.values[0].title}</h3>
            <p className="text-gray-600">
              {content.values[0].description}
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all transform hover:-translate-y-2 group">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">{content.values[1].title}</h3>
            <p className="text-gray-600">
              {content.values[1].description}
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all transform hover:-translate-y-2 group">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">{content.values[2].title}</h3>
            <p className="text-gray-600">
              {content.values[2].description}
            </p>
          </div>
        </div>

        {/* Technologies */}
        <div className={`transition-all duration-700 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-cyan-50 rounded-full mb-4">
              <span className="text-cyan-600 font-semibold text-sm">Our Equipment</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Modern Clinic, Advanced Technology</h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">A smoother, faster, and almost painless dental experience—every time.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.technologies && content.technologies.split('\n').map((tech, index) => (
              <div key={index} className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-800 font-semibold text-base leading-relaxed">{tech}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
