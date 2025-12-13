# Setting Up DynamoDB Tables for Home and About Content

## Overview
This guide will help you set up the DynamoDB tables needed for the Home and About content management features.

## Tables to Create

### 1. RomasDental_HomeContent

**Table Name:** `RomasDental_HomeContent`
**Primary Key:** `contentId` (String)

**Sample Item to Create:**
```json
{
  "contentId": "home-hero",
  "tagline": "Your Smile, Our Priority",
  "heading": "Experience",
  "highlightedText": "World-Class Dental Care",
  "description": "Complete dental solutions with 10+ specialties and 1000+ satisfied patients. From routine checkups to advanced procedures, we're here for your whole family.",
  "heroImage": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80",
  "openingHours": {
    "days": "6 Days",
    "time": "10 AM - 8 PM",
    "closedDay": "Tuesday"
  },
  "phoneNumber": "+917499537267",
  "whatsappNumber": "917499537267",
  "updatedAt": "2025-12-13T00:00:00.000Z"
}
```

### 2. RomasDental_AboutContent

**Table Name:** `RomasDental_AboutContent`
**Primary Key:** `contentId` (String)

**Sample Item to Create:**
```json
{
  "contentId": "about-section",
  "subtitle": "About Us",
  "title": "Welcome to",
  "highlightedTitle": "Roma's Dental Care",
  "description": "Your trusted partner for comprehensive dental care in Kharadi & Wadgaon Sheri",
  "mainImage": "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80",
  "heading": "Advanced, Gentle Treatments by 13+ Years Experienced Doctor",
  "content": "At Roma's Dental Care, we aim to increase awareness about the importance of oral hygiene and dental health. We strongly believe that good oral health contributes to overall wellness.\n\nDr. Roma has worked across various cities and in mobile dental setups, gaining diverse experience and exposure. Her approach is gentle, kind, and compassionate, ensuring a comfortable experience for every patient.\n\nSince awareness about the link between oral health and general health is still limited, we are dedicated to educating our community and providing reliable, patient-focused care.\n\nChoose Roma's Dental Care for healthier teeth, healthier gums, and a healthier you.",
  "features": [
    {
      "title": "State-of-the-Art Equipment",
      "description": "Latest dental technology for precise diagnosis and treatment"
    },
    {
      "title": "Experienced Team",
      "description": "Highly qualified dentists with 10+ specializations"
    },
    {
      "title": "Patient-Centered Care",
      "description": "Comfortable environment with personalized treatment plans"
    }
  ],
  "values": [
    {
      "title": "Trust & Safety",
      "description": "Sterilized equipment and strict hygiene protocols for your safety"
    },
    {
      "title": "Affordable Pricing",
      "description": "Quality dental care at competitive prices with flexible payment options"
    },
    {
      "title": "Flexible Hours",
      "description": "Open 6 days a week from 10 AM - 8 PM to fit your schedule"
    }
  ],
  "updatedAt": "2025-12-13T00:00:00.000Z"
}
```

## Steps to Create Tables

### Using AWS Console:

1. **Navigate to DynamoDB:**
   - Go to AWS Console → Services → DynamoDB

2. **Create RomasDental_HomeContent Table:**
   - Click "Create table"
   - Table name: `RomasDental_HomeContent`
   - Partition key: `contentId` (String)
   - Use default settings for the rest
   - Click "Create table"

3. **Create RomasDental_AboutContent Table:**
   - Click "Create table"
   - Table name: `RomasDental_AboutContent`
   - Partition key: `contentId` (String)
   - Use default settings for the rest
   - Click "Create table"

4. **Add Initial Data:**
   - Select the table
   - Click "Explore table items"
   - Click "Create item"
   - Paste the JSON data from above
   - Click "Create item"

### Using AWS CLI:

```bash
# Create Home Content Table
aws dynamodb create-table \
    --table-name RomasDental_HomeContent \
    --attribute-definitions AttributeName=contentId,AttributeType=S \
    --key-schema AttributeName=contentId,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --region ap-south-1

# Create About Content Table
aws dynamodb create-table \
    --table-name RomasDental_AboutContent \
    --attribute-definitions AttributeName=contentId,AttributeType=S \
    --key-schema AttributeName=contentId,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --region ap-south-1

# Wait for tables to be active
aws dynamodb wait table-exists --table-name RomasDental_HomeContent
aws dynamodb wait table-exists --table-name RomasDental_AboutContent
```

## Environment Variables

Add these to your `.env` file:

```env
REACT_APP_DYNAMODB_HOME_CONTENT_TABLE=RomasDental_HomeContent
REACT_APP_DYNAMODB_ABOUT_CONTENT_TABLE=RomasDental_AboutContent
```

## Testing

1. **Start your React app:**
   ```bash
   cd my-react-app
   npm start
   ```

2. **Login to Admin Panel:**
   - Navigate to `/admin`
   - Login with your admin credentials

3. **Test Home Content Manager:**
   - Click on the "Home" tab
   - You should see the form populated with default values
   - Make changes and click "Save Changes"
   - Refresh the home page to see the changes

4. **Test About Content Manager:**
   - Click on the "About" tab
   - You should see the form populated with default values
   - Make changes and click "Save Changes"
   - Refresh the home page and scroll to About section to see the changes

## Features

### Home Content Manager
- Edit tagline
- Edit main heading and highlighted text
- Edit description
- **Upload hero image** (direct upload to S3, max 5MB)
- Update opening hours
- Update contact numbers (phone and WhatsApp)

### About Content Manager
- Edit section header (subtitle, title, highlighted title)
- Edit description
- **Upload main image** (direct upload to S3, max 5MB)
- Update content heading
- Edit content text in a single text box (use line breaks to separate paragraphs)
- Manage 3 features with titles and descriptions
- Manage 3 values with titles and descriptions

## Image Upload Features

Both managers now support direct image uploads instead of URL inputs:

- **File Selection**: Choose images from your computer (JPG, PNG, WebP supported)
- **Size Limit**: Maximum 5MB per image
- **Preview**: See live preview before saving
- **Auto-Upload**: Images automatically uploaded to S3 when you click "Save Changes"
- **Auto-Delete**: Old images are automatically removed from S3 when replaced
- **Organized Storage**: 
  - Home hero images: `home-content/` folder in S3 bucket
  - About main images: `about-content/` folder in S3 bucket

## Troubleshooting

### Error: ResourceNotFoundException
- Make sure the DynamoDB tables exist in your AWS account
- Verify the table names in your `.env` file match the actual table names
- Check that your AWS credentials have permissions to access DynamoDB

### Error: AccessDeniedException
- Verify your AWS credentials are correct
- Check IAM permissions include `dynamodb:PutItem`, `dynamodb:GetItem`, `dynamodb:UpdateItem`

### Changes Not Reflecting
- Clear browser cache and hard refresh (Ctrl+Shift+R)
- Check browser console for errors
- Verify the API call completed successfully in the Network tab
- Check that data was saved in DynamoDB console

## API Reference

### Home Content API

**Get Content:**
```javascript
const result = await homeContentAPI.get();
// Returns: { success: true, content: {...} }
```

**Update Content:**
```javascript
const result = await homeContentAPI.update(contentData);
// Returns: { success: true, message: "...", content: {...} }
```

### About Content API

**Get Content:**
```javascript
const result = await aboutContentAPI.get();
// Returns: { success: true, content: {...} }
```

**Update Content:**
```javascript
const result = await aboutContentAPI.update(contentData);
// Returns: { success: true, message: "...", content: {...} }
```

## Next Steps

1. Set up the DynamoDB tables as described above
2. Add the environment variables to your `.env` file
3. Test the functionality in the admin panel
4. Customize the default content as needed
5. Consider adding image upload functionality for hero/main images (currently using URLs)
