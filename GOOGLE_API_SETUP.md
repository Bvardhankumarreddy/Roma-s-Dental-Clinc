# Google Places API Setup Guide

## Overview
The Reviews component is now configured to fetch real Google reviews using the Google Places API. It will automatically fall back to sample reviews if the API is not configured.

## Setup Steps

### 1. Get Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Places API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Places API"
   - Click "Enable"
4. Create API credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key
5. (Recommended) Restrict the API key:
   - Click on the API key to edit
   - Under "API restrictions", select "Restrict key"
   - Choose "Places API"
   - Under "Website restrictions", add your domain

### 2. Find Your Place ID

**Option A: Using Google's Place ID Finder**
1. Visit: https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
2. Search for "Roma's Dental Care" in your location
3. Click on the map marker
4. Copy the Place ID shown

**Option B: Using Google Maps**
1. Find your business on Google Maps
2. Copy the URL
3. The Place ID is in the URL after `!1s`
4. Or use this format: https://www.google.com/maps/search/?api=1&query=Roma's%20Dental%20Care&query_place_id=YOUR_PLACE_ID

**Option C: Using Places API**
```bash
curl "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Roma's%20Dental%20Care&inputtype=textquery&fields=place_id,name&key=YOUR_API_KEY"
```

### 3. Configure Environment Variables

1. Open `.env` file in your project root
2. Replace the placeholder values:

```env
REACT_APP_GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_GOOGLE_PLACE_ID=ChIJXXXXXXXXXXXXXXXXXXXXXXXXX
```

3. Save the file
4. Restart your development server:
```bash
npm start
```

### 4. Verify Setup

1. Open your website in the browser
2. Navigate to the Reviews section
3. Check the browser console:
   - If configured correctly: Reviews will load from Google
   - If not configured: You'll see "Google API not configured. Using fallback reviews."

## Important Notes

### CORS Issue
The Google Places API doesn't support direct client-side requests due to CORS restrictions. The component uses a CORS proxy (`allorigins.win`) for development. 

**For Production**, you should:

1. **Backend Proxy (Recommended)**: Create a backend endpoint that fetches reviews server-side
2. **Serverless Function**: Use Vercel/Netlify functions
3. **Google Maps JavaScript API**: Use the official JS SDK instead of REST API

### Example Backend Implementation (Node.js/Express)

```javascript
// server.js
const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/reviews', async (req, res) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json`,
      {
        params: {
          place_id: process.env.GOOGLE_PLACE_ID,
          fields: 'name,rating,user_ratings_total,reviews',
          key: process.env.GOOGLE_API_KEY
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));
```

Then update the fetch call in `Reviews.js`:
```javascript
const response = await fetch('http://localhost:3001/api/reviews');
```

### API Usage Limits
- Free tier: $200 credit per month
- Place Details API: $17 per 1,000 requests
- Consider caching reviews to reduce API calls

### Security
- Never commit `.env` file to version control
- The `.gitignore` file is already configured to exclude it
- Use `.env.example` as a template for other developers

## Troubleshooting

**Reviews not loading?**
- Check browser console for errors
- Verify API key is valid
- Ensure Places API is enabled
- Check Place ID is correct

**CORS errors?**
- Use backend proxy (see above)
- Or switch to Google Maps JavaScript API

**Rate limiting?**
- Implement caching
- Store reviews in your database
- Refresh periodically (e.g., daily)

## Alternative: Manual Reviews

If you prefer not to use the API, you can manually update reviews in `Reviews.js`:

```javascript
const fallbackReviews = [
  {
    id: 1,
    author_name: "Customer Name",
    rating: 5,
    relative_time_description: "1 week ago",
    text: "Review text here...",
    profile_photo_url: null
  },
  // Add more reviews...
];
```

The component will work perfectly with these fallback reviews.
