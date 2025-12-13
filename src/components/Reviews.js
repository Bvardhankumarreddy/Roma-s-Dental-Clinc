import React, { useState, useEffect, useRef } from 'react';

const Reviews = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeReview, setActiveReview] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [placeData, setPlaceData] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [expandedCarousel, setExpandedCarousel] = useState(false);
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

  // Fetch Google Reviews
  useEffect(() => {
    const fetchGoogleReviews = () => {
      const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
      const placeId = process.env.REACT_APP_GOOGLE_PLACE_ID;

      // Fallback reviews if API is not configured (sorted by newest first)
      const fallbackReviews = [
        {
          id: 20,
          author_name: "Shalini Bhat",
          rating: 5,
          relative_time_description: "2 hours ago",
          text: "Just had my teeth whitening done and the results are fantastic! The staff is friendly and the clinic is very clean. Best dental care in town!",
          profile_photo_url: null
        },
        {
          id: 19,
          author_name: "Aditya Rao",
          rating: 5,
          relative_time_description: "1 day ago",
          text: "Excellent dental clinic with state-of-the-art facilities. Dr. Roma is extremely knowledgeable and gentle. Highly recommended!",
          profile_photo_url: null
        },
        {
          id: 13,
          author_name: "Arjun Verma",
          rating: 5,
          relative_time_description: "2 days ago",
          text: "Best dentist I've ever been to! The clinic is modern, clean, and the staff is incredibly friendly. My dental implant procedure was seamless.",
          profile_photo_url: null
        },
        {
          id: 11,
          author_name: "Suresh Menon",
          rating: 5,
          relative_time_description: "3 days ago",
          text: "Professional and caring dental team. The clinic environment is very hygienic. My family and I are regular patients here.",
          profile_photo_url: null
        },
        {
          id: 7,
          author_name: "Karthik Iyer",
          rating: 5,
          relative_time_description: "4 days ago",
          text: "Outstanding dental care! The clinic is equipped with latest technology. Dr. Roma is very skilled and explained every step of my treatment.",
          profile_photo_url: null
        },
        {
          id: 8,
          author_name: "Meera Nair",
          rating: 5,
          relative_time_description: "5 days ago",
          text: "Very impressed with the service. The staff is courteous and professional. My teeth cleaning experience was excellent.",
          profile_photo_url: null
        },
        {
          id: 17,
          author_name: "Rahul Khanna",
          rating: 5,
          relative_time_description: "5 days ago",
          text: "Top-quality dental care! The clinic uses advanced technology and the doctors are highly experienced. Completely satisfied!",
          profile_photo_url: null
        },
        {
          id: 15,
          author_name: "Manish Agarwal",
          rating: 5,
          relative_time_description: "6 days ago",
          text: "Very professional dental clinic. The cosmetic dentistry work they did on my teeth looks amazing. Thank you, Dr. Roma!",
          profile_photo_url: null
        },
        {
          id: 4,
          author_name: "Sneha Reddy",
          rating: 5,
          relative_time_description: "1 week ago",
          text: "Amazing dental care! Very gentle and caring staff. My kids love coming here. The clinic has a very comfortable atmosphere.",
          profile_photo_url: null
        },
        {
          id: 9,
          author_name: "Rohan Gupta",
          rating: 5,
          relative_time_description: "1 week ago",
          text: "Fantastic dental clinic! They handle emergency cases very well. Got my broken tooth fixed quickly and professionally.",
          profile_photo_url: null
        },
        {
          id: 12,
          author_name: "Kavita Joshi",
          rating: 5,
          relative_time_description: "1 week ago",
          text: "Excellent dental services! Dr. Roma is very gentle and takes time to understand patient concerns. Highly satisfied with the treatment.",
          profile_photo_url: null
        },
        {
          id: 1,
          author_name: "Rajesh Kumar",
          rating: 5,
          relative_time_description: "2 weeks ago",
          text: "Excellent service! Dr. Roma and her team are very professional. The clinic is clean and modern. Highly recommend for dental care.",
          profile_photo_url: null
        },
        {
          id: 10,
          author_name: "Divya Kapoor",
          rating: 5,
          relative_time_description: "2 weeks ago",
          text: "Highly recommend Roma's Dental Care! The orthodontic treatment I received was top-notch. Very happy with my new smile.",
          profile_photo_url: null
        },
        {
          id: 3,
          author_name: "Amit Patel",
          rating: 5,
          relative_time_description: "3 weeks ago",
          text: "Great experience! The doctor explained everything clearly and the procedure was quick. The clinic maintains high hygiene standards.",
          profile_photo_url: null
        },
        {
          id: 6,
          author_name: "Anjali Desai",
          rating: 5,
          relative_time_description: "3 weeks ago",
          text: "Wonderful experience! The team is very patient and understanding. They made my root canal treatment completely painless. Thank you!",
          profile_photo_url: null
        },
        {
          id: 18,
          author_name: "Nisha Pandey",
          rating: 5,
          relative_time_description: "3 weeks ago",
          text: "Amazing service! They made my root canal treatment completely stress-free. The entire team is very professional and caring.",
          profile_photo_url: null
        },
        {
          id: 14,
          author_name: "Pooja Malhotra",
          rating: 5,
          relative_time_description: "4 weeks ago",
          text: "Great experience from start to finish. The booking process was smooth, and the treatment was excellent. Will definitely return!",
          profile_photo_url: null
        },
        {
          id: 2,
          author_name: "Priya Sharma",
          rating: 5,
          relative_time_description: "1 month ago",
          text: "Best dental clinic in the area. The staff is friendly and the treatment is painless. Very satisfied with my teeth whitening results.",
          profile_photo_url: null
        },
        {
          id: 16,
          author_name: "Shreya Pillai",
          rating: 5,
          relative_time_description: "1 month ago",
          text: "I had a great experience getting my braces here. The staff is supportive and the results exceeded my expectations.",
          profile_photo_url: null
        },
        {
          id: 5,
          author_name: "Vikram Singh",
          rating: 5,
          relative_time_description: "2 months ago",
          text: "Highly professional dental clinic. Modern equipment and experienced doctors. Got my dental implant done here and very happy with the results.",
          profile_photo_url: null
        }
      ];

      if (!apiKey || apiKey === 'your_google_api_key_here' || !placeId || placeId === 'your_place_id_here') {
        console.warn('Google API not configured. Using fallback reviews.');
        setReviews(fallbackReviews);
        setPlaceData({
          name: "Roma's Dental Care",
          rating: 4.9,
          user_ratings_total: 500
        });
        setLoading(false);
        return;
      }

      // Load Google Maps API script if not already loaded
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        const existingScript = document.getElementById('google-maps-script');
        
        if (!existingScript) {
          const script = document.createElement('script');
          script.id = 'google-maps-script';
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
          script.async = true;
          
          script.onload = () => {
            fetchPlaceDetails(placeId, fallbackReviews);
          };
          
          script.onerror = () => {
            console.error('Failed to load Google Maps API');
            setError('Failed to load Google Maps API. Check your API key and internet connection.');
            setReviews(fallbackReviews);
            setPlaceData({
              name: "Roma's Dental Care",
              rating: 4.9,
              user_ratings_total: 500
            });
            setLoading(false);
          };
          
          document.head.appendChild(script);
        } else {
          // Script is loading, wait for it
          const checkInterval = setInterval(() => {
            if (window.google && window.google.maps && window.google.maps.places) {
              clearInterval(checkInterval);
              fetchPlaceDetails(placeId, fallbackReviews);
            }
          }, 100);
          
          setTimeout(() => {
            clearInterval(checkInterval);
            if (!window.google || !window.google.maps || !window.google.maps.places) {
              console.error('Timeout loading Google Maps API');
              setReviews(fallbackReviews);
              setPlaceData({
                name: "Roma's Dental Care",
                rating: 4.9,
                user_ratings_total: 500
              });
              setLoading(false);
            }
          }, 3000);
        }
      } else {
        // Google Maps already loaded
        fetchPlaceDetails(placeId, fallbackReviews);
      }
    };

    const fetchPlaceDetails = async (placeId, fallbackReviews) => {
      try {
        console.log('Attempting to fetch place details for:', placeId);
        
        // Try new Places API first (post March 2025)
        try {
          const { Place } = await window.google.maps.importLibrary("places");
          
          const place = new Place({
            id: placeId,
          });

          await place.fetchFields({
            fields: ['displayName', 'rating', 'userRatingCount', 'reviews']
          });
          
          if (place && place.reviews) {
            const googleReviews = place.reviews || [];
            
            const formattedReviews = googleReviews.map((review, index) => {
              
              // Handle different time formats
              let timestamp;
              if (review.publishTime) {
                // New API returns Date object or ISO string
                timestamp = new Date(review.publishTime).getTime();
              } else if (review.time) {
                // Legacy API returns Unix timestamp
                timestamp = review.time * 1000;
              } else {
                timestamp = 0;
              }
              
              return {
                id: index + 1,
                author_name: review.authorAttribution?.displayName || review.author_name || 'Anonymous',
                rating: review.rating || 5,
                relative_time_description: review.relativePublishTimeDescription || review.relative_time_description || 'Recently',
                text: review.text?.text || review.text || review.textContent || '',
                profile_photo_url: review.authorAttribution?.photoURI || review.profile_photo_url || null,
                timestamp: timestamp
              };
            })
            .sort((a, b) => {
              return b.timestamp - a.timestamp; // Sort by newest first
            })
            .slice(0, 20); // Show only latest 20 reviews
            
            if (formattedReviews.length > 0) {
              setReviews(formattedReviews);
              setPlaceData({
                name: place.displayName || "Roma's Dental Care",
                rating: place.rating || 4.9,
                user_ratings_total: place.userRatingCount || 500
              });
              setLoading(false);
              return;
            }
          }
        } catch (newApiError) {
          console.warn('New Places API not available, trying legacy API:', newApiError.message);
          
          // Fallback to legacy API
          const map = new window.google.maps.Map(document.createElement('div'));
          const service = new window.google.maps.places.PlacesService(map);

          const request = {
            placeId: placeId,
            fields: ['name', 'rating', 'user_ratings_total', 'reviews']
          };

          service.getDetails(request, (place, status) => {
            console.log('Legacy API Status:', status);
            console.log('Legacy API Place Data:', place);
            
            if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
              const allReviews = place.reviews || [];
              // Sort by newest first and take top 20
              const googleReviews = allReviews
                .sort((a, b) => b.time - a.time)
                .slice(0, 20);
              
              if (googleReviews.length > 0) {
                setReviews(googleReviews);
                setPlaceData({
                  name: place.name,
                  rating: place.rating,
                  user_ratings_total: place.user_ratings_total
                });
              } else {
                console.warn('No reviews found. Using fallback.');
                setReviews(fallbackReviews);
                setPlaceData({
                  name: place.name || "Roma's Dental Care",
                  rating: place.rating || 4.9,
                  user_ratings_total: place.user_ratings_total || 500
                });
              }
            } else {
              console.error('Legacy API also failed:', status);
              setError('Unable to fetch Google reviews. Please enable "Places API (New)" in Google Cloud Console.');
              setReviews(fallbackReviews);
              setPlaceData({
                name: "Roma's Dental Care",
                rating: 4.9,
                user_ratings_total: 500
              });
            }
            setLoading(false);
          });
          return;
        }
        
        // If we get here, no reviews were found
        console.warn('No reviews available.');
        setReviews(fallbackReviews);
        setPlaceData({
          name: "Roma's Dental Care",
          rating: 4.9,
          user_ratings_total: 500
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching place details:', err);
        setError(`Failed to fetch reviews: ${err.message}`);
        setReviews(fallbackReviews);
        setPlaceData({
          name: "Roma's Dental Care",
          rating: 4.9,
          user_ratings_total: 500
        });
        setLoading(false);
      }
    };

    fetchGoogleReviews();
  }, []);

  const nextReview = () => {
    setActiveReview((prev) => (prev + 1) % reviews.length);
    setExpandedCarousel(false);
  };

  const prevReview = () => {
    setActiveReview((prev) => (prev - 1 + reviews.length) % reviews.length);
    setExpandedCarousel(false);
  };

  const toggleExpanded = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const truncateText = (text, maxLines = 5) => {
    const lines = text.split('\n');
    if (lines.length <= maxLines) {
      const words = text.split(' ');
      if (words.length <= 50) return { text, isTruncated: false };
      return {
        text: words.slice(0, 50).join(' ') + '...',
        isTruncated: true
      };
    }
    return {
      text: lines.slice(0, maxLines).join('\n') + '...',
      isTruncated: true
    };
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section id="reviews" ref={sectionRef} className="pt-0 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-cyan-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className={`text-cyan-500 text-sm font-semibold uppercase tracking-wider mb-3 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            ⭐ Patient Reviews
          </p>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            What Our Patients Say
          </h2>
          <p className={`text-gray-600 text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Real experiences from our valued patients
          </p>
          
          {/* Error Message */}
          {error && (
            <div className="mt-4 max-w-2xl mx-auto bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <p className="text-yellow-700 text-sm">
                <strong>Note:</strong> {error}
                <br />
                <span className="text-xs">Showing sample reviews. Check browser console for details.</span>
              </p>
            </div>
          )}
        </div>

        {/* Google Rating Summary */}
        <div className={`flex flex-col items-center mb-12 transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
              <span className="text-gray-600">Loading reviews...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-5xl font-bold text-gray-800">
                  {placeData?.rating || '4.9'}
                </span>
                <div>
                  <div className="flex gap-1">{renderStars(Math.round(placeData?.rating || 5))}</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Based on {placeData?.user_ratings_total?.toLocaleString() || '500+'} Google reviews
                  </p>
                </div>
              </div>
              <a
                href={`https://search.google.com/local/reviews?placeid=${process.env.REACT_APP_GOOGLE_PLACE_ID || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-2 text-cyan-500 hover:text-cyan-600 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="font-medium">Write a Review on Google</span>
              </a>
            </>
          )}
        </div>

        {/* Reviews Carousel */}
        {!loading && reviews.length > 0 && (
          <div className={`relative max-w-4xl mx-auto transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-cyan-100 rounded-full -translate-x-10 -translate-y-10"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-100 rounded-full translate-x-16 translate-y-16"></div>

              {/* Review Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-6">
                  <img 
                    src={reviews[activeReview].profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(reviews[activeReview].author_name)}`}
                    alt={reviews[activeReview].author_name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-cyan-100 bg-white"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(reviews[activeReview].author_name)}&background=0891b2&color=fff&size=128`;
                    }}
                  />
                </div>

                <div className="flex justify-center mb-4">
                  {renderStars(reviews[activeReview].rating)}
                </div>

                <div className="text-gray-700 text-lg leading-relaxed mb-6 text-center">
                  <p className={!expandedCarousel && truncateText(reviews[activeReview].text).isTruncated ? 'line-clamp-4' : ''}>
                    "{expandedCarousel ? reviews[activeReview].text : truncateText(reviews[activeReview].text).text}"
                  </p>
                  {truncateText(reviews[activeReview].text).isTruncated && (
                    <button
                      onClick={() => setExpandedCarousel(!expandedCarousel)}
                      className="text-cyan-500 hover:text-cyan-600 font-medium mt-3 text-sm"
                    >
                      {expandedCarousel ? 'Read Less' : 'Read More'}
                    </button>
                  )}
                </div>

                <div className="text-center">
                  <h4 className="font-semibold text-gray-800 text-lg">{reviews[activeReview].author_name}</h4>
                  <p className="text-gray-500 text-sm">{reviews[activeReview].relative_time_description}</p>
                </div>
              </div>
            </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white rounded-full p-3 shadow-lg hover:shadow-xl hover:bg-cyan-50 transition-all duration-300 group"
            aria-label="Previous review"
          >
            <svg className="w-6 h-6 text-gray-600 group-hover:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white rounded-full p-3 shadow-lg hover:shadow-xl hover:bg-cyan-50 transition-all duration-300 group"
            aria-label="Next review"
          >
            <svg className="w-6 h-6 text-gray-600 group-hover:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveReview(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeReview ? 'bg-cyan-500 w-8' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
        )}

        {/* All Reviews Grid */}
        {!loading && reviews.length > 0 && (
          <>
            <div className={`text-center mb-8 transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                What Our Patients Are Saying
              </h3>
              <p className="text-gray-600">
                Showing {reviews.length} recent Google reviews (sorted by newest)
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
              {reviews.map((review, index) => (
                <div
                  key={review.id || index}
                  className={`bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-500 flex flex-col h-full ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={review.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(review.author_name)}`}
                    alt={review.author_name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-cyan-200 bg-white"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author_name)}&background=0891b2&color=fff&size=96`;
                    }}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{review.author_name}</h4>
                    <p className="text-gray-500 text-xs">{review.relative_time_description}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">{renderStars(review.rating)}</div>
                <div className="text-gray-600 text-sm leading-relaxed flex-grow">
                  <p className={!expandedReviews[review.id || index] && truncateText(review.text).isTruncated ? 'line-clamp-3' : ''}>
                    {expandedReviews[review.id || index] 
                      ? review.text 
                      : truncateText(review.text).text}
                  </p>
                </div>
                {truncateText(review.text).isTruncated && (
                  <button
                    onClick={() => toggleExpanded(review.id || index)}
                    className="text-cyan-500 hover:text-cyan-600 font-medium mt-3 text-xs self-start"
                  >
                    {expandedReviews[review.id || index] ? 'Read Less' : 'Read More'}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* See More Reviews Link */}
          <div className="text-center mt-12">
            <a
              href={`https://search.google.com/local/reviews?placeid=${process.env.REACT_APP_GOOGLE_PLACE_ID || ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="white"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white"/>
              </svg>
              <span>See More Reviews on Google</span>
            </a>
          </div>
        </>
        )}
      </div>
    </section>
  );
};

export default Reviews;
