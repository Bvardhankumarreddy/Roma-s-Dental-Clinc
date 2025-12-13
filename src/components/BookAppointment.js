import React, { useState, useEffect } from 'react';
import { bookingsAPI, servicesAPI } from '../utils/api';

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    date: '',
    time: '',
    service: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingNumber, setBookingNumber] = useState(null);
  const [focusedField, setFocusedField] = useState('');
  const [services, setServices] = useState([]);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const result = await servicesAPI.getAll();
      if (result.success && result.services) {
        const serviceTitles = result.services.map(s => s.title);
        setServices(serviceTitles);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const timeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile.replace(/[\s-]/g, ''))) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    } else {
      const selectedDate = new Date(formData.date);
      const dayOfWeek = selectedDate.getDay();
      if (dayOfWeek === 2) { // Tuesday is 2 (0=Sunday, 1=Monday, 2=Tuesday...)
        newErrors.date = 'We are closed on Tuesdays. Please select another day';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Please select a time slot';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Save booking to DynamoDB
        const bookingData = {
          name: formData.name,
          mobile: formData.mobile,
          service: formData.service,
          date: formData.date,
          time: formData.time
        };

        const result = await bookingsAPI.create(bookingData);

        if (result.success) {
          const bookingNum = result.booking.bookingNumber;
          setBookingNumber(bookingNum);
          
          // Prepare WhatsApp message
          const whatsappMessage = `New Appointment Booking!
Booking ID: #${bookingNum}
Name: ${formData.name}
Mobile: ${formData.mobile}
Service: ${formData.service}
Date: ${formData.date}
Time: ${formData.time}

- Roma's Dental Care`;

          // Send WhatsApp message to clinic team
          const clinicNumbers = ['7499537267', '9284338406'];
          
          // Send to both clinic numbers via WhatsApp
          clinicNumbers.forEach(number => {
            const whatsappUrl = `https://wa.me/91${number}?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
          });

          setIsSubmitting(false);
          setShowSuccess(true);
          
          // Reset form
          setFormData({
            name: '',
            mobile: '',
            date: '',
            time: '',
            service: ''
          });

          // Hide success message after 5 seconds
          setTimeout(() => {
            setShowSuccess(false);
          }, 5000);
        } else {
          throw new Error('Failed to save booking');
        }
      } catch (error) {
        console.error('Error saving booking:', error);
        setIsSubmitting(false);
        alert('Sorry, there was an error booking your appointment. Please try again or call us directly.');
      }
    }
  };

  return (
    <section id="appointment" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Info */}
          <div className="space-y-6">
            <div className="inline-block">
              <span className="bg-cyan-100 text-cyan-600 px-4 py-2 rounded-full text-sm font-semibold">
                📅 Easy Booking
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Book Your <span className="text-cyan-500">Appointment</span> Today
            </h2>
            
            <p className="text-gray-600 text-lg leading-relaxed">
              Schedule your visit in just a few clicks. Our team will confirm your appointment and ensure you receive the best dental care experience.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 group cursor-pointer hover:translate-x-2 transition-transform">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500 transition-colors">
                  <svg className="w-6 h-6 text-cyan-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Flexible Timing</h3>
                  <p className="text-gray-600">Choose from available slots that fit your schedule</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group cursor-pointer hover:translate-x-2 transition-transform">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500 transition-colors">
                  <svg className="w-6 h-6 text-cyan-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Instant Confirmation</h3>
                  <p className="text-gray-600">Get immediate confirmation via SMS and email</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group cursor-pointer hover:translate-x-2 transition-transform">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500 transition-colors">
                  <svg className="w-6 h-6 text-cyan-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Expert Care</h3>
                  <p className="text-gray-600">Meet with our experienced dental professionals</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <p className="text-gray-500 text-sm flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Open Mon, Wed - Sun • 10 AM - 8 PM • Closed on Tuesday
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100 rounded-full -ml-12 -mb-12 opacity-50"></div>

              <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Schedule Your Visit</h3>
                  <p className="text-gray-600">Fill in your details below</p>
                </div>

                {/* Name Field */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                        errors.name 
                          ? 'border-red-500 focus:border-red-600' 
                          : focusedField === 'name'
                            ? 'border-cyan-500 shadow-lg'
                            : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1 animate-fade-in">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Mobile Field */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('mobile')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                        errors.mobile 
                          ? 'border-red-500 focus:border-red-600' 
                          : focusedField === 'mobile'
                            ? 'border-cyan-500 shadow-lg'
                            : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter 10-digit mobile number"
                    />
                  </div>
                  {errors.mobile && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1 animate-fade-in">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.mobile}
                    </p>
                  )}
                </div>

                {/* Service Selection */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Service <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('service')}
                      onBlur={() => setFocusedField('')}
                      style={{ color: '#111827' }}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all appearance-none cursor-pointer text-gray-900 bg-white ${
                        errors.service 
                          ? 'border-red-500 focus:border-red-600' 
                          : focusedField === 'service'
                            ? 'border-cyan-500 shadow-lg'
                            : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <option value="" style={{ color: '#6B7280' }}>Choose a service</option>
                      {services.map((service) => (
                        <option key={service} value={service} style={{ color: '#111827', backgroundColor: '#FFFFFF' }}>{service}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.service && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1 animate-fade-in">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.service}
                    </p>
                  )}
                </div>

                {/* Date and Time */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Date Field */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('date')}
                      onBlur={() => setFocusedField('')}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all cursor-pointer ${
                        errors.date 
                          ? 'border-red-500 focus:border-red-600' 
                          : focusedField === 'date'
                            ? 'border-cyan-500 shadow-lg'
                            : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1 animate-fade-in">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.date}
                      </p>
                    )}
                  </div>

                  {/* Time Field */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('time')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all appearance-none cursor-pointer ${
                        errors.time 
                          ? 'border-red-500 focus:border-red-600' 
                          : focusedField === 'time'
                            ? 'border-cyan-500 shadow-lg'
                            : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                    {errors.time && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1 animate-fade-in">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.time}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transform hover:scale-105 hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span>Book Appointment</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-500">
                  By booking, you agree to our terms and privacy policy
                </p>
              </form>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl flex items-center justify-center p-8 animate-fade-in">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked!</h3>
                  {bookingNumber && (
                    <div className="bg-cyan-50 border-2 border-cyan-500 rounded-lg px-6 py-3 mb-4 inline-block">
                      <p className="text-sm text-cyan-600 font-semibold mb-1">Your Booking ID</p>
                      <p className="text-3xl font-bold text-cyan-600">#{bookingNumber}</p>
                    </div>
                  )}
                  <p className="text-gray-600 mb-4">
                    We'll send you a confirmation message shortly.
                  </p>
                  <p className="text-sm text-gray-500">
                    Check your mobile for details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookAppointment;
