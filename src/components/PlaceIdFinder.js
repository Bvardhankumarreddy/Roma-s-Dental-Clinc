import React, { useEffect, useRef, useState } from 'react';

const PlaceIdFinder = () => {
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const [placeInfo, setPlaceInfo] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    // Load Google Maps API
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    
    if (!apiKey || apiKey === 'your_google_api_key_here') {
      setError('Google API Key not configured. Please add it to .env file.');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsLoaded(true);
      initMap();
    };
    script.onerror = () => {
      setError('Failed to load Google Maps API');
    };
    
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current || !inputRef.current) return;

    // Initialize map centered on India
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 20.5937, lng: 78.9629 }, // Center of India
      zoom: 5,
    });

    // Create autocomplete
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ['place_id', 'geometry', 'formatted_address', 'name', 'rating', 'user_ratings_total', 'types'],
    });

    autocomplete.bindTo('bounds', map);

    // Create info window
    const infowindow = new window.google.maps.InfoWindow();
    const marker = new window.google.maps.Marker({ 
      map: map,
      anchorPoint: new window.google.maps.Point(0, -29)
    });

    marker.addListener('click', () => {
      infowindow.open(map, marker);
    });

    // Handle place selection
    autocomplete.addListener('place_changed', () => {
      infowindow.close();
      marker.setVisible(false);

      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        setError('No details available for input: ' + place.name);
        return;
      }

      // Update place info state
      setPlaceInfo({
        name: place.name,
        placeId: place.place_id,
        address: place.formatted_address,
        rating: place.rating,
        totalRatings: place.user_ratings_total,
        types: place.types
      });

      // Update map
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      // Update marker
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      // Create info window content
      const content = `
        <div style="padding: 10px;">
          <h3 style="margin: 0 0 8px 0; color: #0891b2; font-size: 16px;">${place.name}</h3>
          <p style="margin: 4px 0; font-size: 12px;"><strong>Place ID:</strong> ${place.place_id}</p>
          <p style="margin: 4px 0; font-size: 12px;"><strong>Address:</strong> ${place.formatted_address}</p>
          ${place.rating ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Rating:</strong> ${place.rating} ⭐ (${place.user_ratings_total} reviews)</p>` : ''}
        </div>
      `;

      infowindow.setContent(content);
      infowindow.open(map, marker);
    });
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${label} copied to clipboard!`);
    });
  };

  const updateEnvFile = () => {
    if (!placeInfo) return;
    
    const envContent = `REACT_APP_GOOGLE_API_KEY=${process.env.REACT_APP_GOOGLE_API_KEY || 'your_google_api_key_here'}
REACT_APP_GOOGLE_PLACE_ID=${placeInfo.placeId}`;
    
    alert(`Add this to your .env file:\n\n${envContent}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-cyan-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Google Place ID Finder
          </h1>
          <p className="text-gray-600 text-lg">
            Search for your clinic to find the Place ID needed for Google Reviews integration
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Search Input */}
          <div className="p-6 bg-gradient-to-r from-cyan-500 to-blue-500">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for Roma's Dental Care or your clinic name..."
              className="w-full px-6 py-4 rounded-lg text-lg border-2 border-transparent focus:border-cyan-300 focus:outline-none shadow-lg"
            />
          </div>

          {/* Map */}
          <div 
            ref={mapRef}
            className="w-full h-96 bg-gray-200"
          />

          {/* Place Information */}
          {placeInfo && (
            <div className="p-6 bg-gray-50 border-t">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Place Details</h3>
              
              <div className="space-y-4">
                {/* Place Name */}
                <div className="flex items-start justify-between bg-white p-4 rounded-lg shadow">
                  <div className="flex-1">
                    <label className="text-sm font-semibold text-gray-600 uppercase">Place Name</label>
                    <p className="text-lg text-gray-800 mt-1">{placeInfo.name}</p>
                  </div>
                </div>

                {/* Place ID - Most Important */}
                <div className="flex items-start justify-between bg-cyan-50 p-4 rounded-lg shadow border-2 border-cyan-500">
                  <div className="flex-1">
                    <label className="text-sm font-semibold text-cyan-700 uppercase">
                      Place ID (Copy this!)
                    </label>
                    <p className="text-lg text-gray-800 mt-1 font-mono break-all">
                      {placeInfo.placeId}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(placeInfo.placeId, 'Place ID')}
                    className="ml-4 bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </button>
                </div>

                {/* Address */}
                <div className="flex items-start justify-between bg-white p-4 rounded-lg shadow">
                  <div className="flex-1">
                    <label className="text-sm font-semibold text-gray-600 uppercase">Address</label>
                    <p className="text-lg text-gray-800 mt-1">{placeInfo.address}</p>
                  </div>
                </div>

                {/* Rating */}
                {placeInfo.rating && (
                  <div className="flex items-start justify-between bg-white p-4 rounded-lg shadow">
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-gray-600 uppercase">Google Rating</label>
                      <p className="text-lg text-gray-800 mt-1">
                        ⭐ {placeInfo.rating} ({placeInfo.totalRatings?.toLocaleString()} reviews)
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-4">
                  <button
                    onClick={updateEnvFile}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-4 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Show .env Configuration
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Next Steps:</h4>
                <ol className="list-decimal list-inside space-y-1 text-blue-700 text-sm">
                  <li>Copy the Place ID above</li>
                  <li>Open the <code className="bg-blue-100 px-2 py-1 rounded">.env</code> file in your project</li>
                  <li>Replace <code className="bg-blue-100 px-2 py-1 rounded">your_place_id_here</code> with the copied Place ID</li>
                  <li>Save the file and restart your development server</li>
                  <li>The Reviews section will now fetch real Google reviews!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Need help? Check the{' '}
            <a href="/GOOGLE_API_SETUP.md" className="text-cyan-500 hover:text-cyan-600 font-semibold">
              GOOGLE_API_SETUP.md
            </a>
            {' '}file for detailed instructions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaceIdFinder;
