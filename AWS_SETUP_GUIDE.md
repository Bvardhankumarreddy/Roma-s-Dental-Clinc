# Complete AWS Setup Guide - DynamoDB & IAM

This guide will help you set up all AWS resources needed for your Roma's Dental Care admin panel.

## 📋 Overview

You need to create:
- ✅ 1 IAM User with permissions
- ✅ 8 DynamoDB Tables
- ✅ 1 S3 Bucket for images

---

## Part 1: Create IAM User & Get Credentials

### Step 1.1: Create IAM User

1. **Login to AWS Console**: https://console.aws.amazon.com
2. Go to **IAM** service (search "IAM" in top search bar)
3. Click **Users** in left sidebar
4. Click **Create user** button

### Step 1.2: User Details

1. **User name**: `romas-dental-app`
2. Click **Next**

### Step 1.3: Set Permissions

1. Select **Attach policies directly**
2. Search and select these policies:
   - ✅ `AmazonDynamoDBFullAccess`
   - ✅ `AmazonS3FullAccess`
3. Click **Next**
4. Click **Create user**

### Step 1.4: Create Access Keys

1. Click on the user **romas-dental-app** you just created
2. Go to **Security credentials** tab
3. Scroll down to **Access keys** section
4. Click **Create access key**
5. Select **Application running outside AWS**
6. Click **Next**
7. (Optional) Add description: "Roma's Dental React App"
8. Click **Create access key**

### Step 1.5: Save Your Credentials

**⚠️ IMPORTANT: Save these NOW - you won't see the secret key again!**

You'll see:
- **Access Key ID**: `AKIAIOSFODNN7EXAMPLE` (example)
- **Secret Access Key**: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` (example)

**Copy both and paste them into your `.env.local` file:**

```env
REACT_APP_AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID_HERE
REACT_APP_AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY_HERE
```

---

## Part 2: Create DynamoDB Tables

You need to create 8 tables. Follow these steps for each table:

### Step 2.1: Navigate to DynamoDB

1. Go to **DynamoDB** service (search "DynamoDB" in top search bar)
2. Click **Tables** in left sidebar
3. Click **Create table** button

---

### Table 1: Bookings Table

**Table Details:**
- **Table name**: `RomasDental_Bookings`
- **Partition key**: `bookingId` (String)
- Leave **Sort key** empty
- **Table settings**: Default settings
- Click **Create table**

**Wait for Status**: "Active" (takes ~30 seconds)

---

### Table 2: Gallery Table

**Table Details:**
- **Table name**: `RomasDental_Gallery`
- **Partition key**: `imageId` (String)
- Leave **Sort key** empty
- **Table settings**: Default settings
- Click **Create table**

**Wait for Status**: "Active"

---

### Table 3: Blogs Table

**Table Details:**
- **Table name**: `RomasDental_Blogs`
- **Partition key**: `blogId` (String)
- Leave **Sort key** empty
- **Table settings**: Default settings
- Click **Create table**

**Wait for Status**: "Active"

---

### Table 4: Services Table

**Table Details:**
- **Table name**: `RomasDental_Services`
- **Partition key**: `serviceId` (String)
- Leave **Sort key** empty
- **Table settings**: Default settings
- Click **Create table**

**Wait for Status**: "Active"

---

### Table 5: Home Content Table

**Table Details:**
- **Table name**: `RomasDental_HomeContent`
- **Partition key**: `contentId` (String)
- Leave **Sort key** empty
- **Table settings**: Default settings
- Click **Create table**

**Wait for Status**: "Active"

---

### Table 6: About Content Table

**Table Details:**
- **Table name**: `RomasDental_AboutContent`
- **Partition key**: `contentId` (String)
- Leave **Sort key** empty
- **Table settings**: Default settings
- Click **Create table**

**Wait for Status**: "Active"

---

### Table 7: Stats Table

**Table Details:**
- **Table name**: `RomasDental_Stats`
- **Partition key**: `statsId` (String)
- Leave **Sort key** empty
- **Table settings**: Default settings
- Click **Create table**

**Wait for Status**: "Active"

**📌 Important**: This table stores the statistics shown in "Why Choose Us" section (Happy Patients count, Specialists count). After creating the table, you can manage these values from the admin panel's Statistics tab.

---

### Table 8: Social Links Table

**Table Details:**
- **Table name**: `RomasDental_SocialLinks`
- **Partition key**: `linkId` (String)
- Leave **Sort key** empty
- **Table settings**: Default settings
- Click **Create table**

**Wait for Status**: "Active"

**📌 Important**: This table stores social media links displayed in the Contact section. You can add Facebook, Instagram, Twitter, YouTube, LinkedIn, WhatsApp, and other social platforms from the admin panel's Social Links tab.

---

## Part 3: Create S3 Bucket for Images

### Step 3.1: Navigate to S3

1. Go to **S3** service (search "S3" in top search bar)
2. Click **Create bucket** button

### Step 3.2: Bucket Settings

**General Configuration:**
- **Bucket name**: `romas-dental-images` (must be globally unique)
  - If taken, try: `romas-dental-images-2025` or `romas-dental-yourname`
- **AWS Region**: `Asia Pacific (Mumbai) ap-south-1`

**Object Ownership:**
- Select **ACLs enabled**
- Select **Object writer**

**Block Public Access settings:**
- ✅ **UNCHECK** "Block all public access"
- ✅ Check the warning acknowledgment: "I acknowledge that the current settings..."

**Bucket Versioning:**
- Leave as **Disable**

**Default encryption:**
- Leave as **Server-side encryption with Amazon S3 managed keys (SSE-S3)**

Click **Create bucket**

### Step 3.3: Enable CORS for Bucket

1. Click on your bucket name `romas-dental-images`
2. Go to **Permissions** tab
3. Scroll down to **Cross-origin resource sharing (CORS)**
4. Click **Edit**
5. Paste this configuration:

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "PUT",
            "POST",
            "DELETE"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": [
            "ETag"
        ]
    }
]
```

6. Click **Save changes**

### Step 3.4: Set Bucket Policy for Public Read

1. Still in **Permissions** tab
2. Scroll to **Bucket policy**
3. Click **Edit**
4. Paste this policy (replace `romas-dental-images` with your bucket name if different):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::romas-dental-images/*"
        }
    ]
}
```

5. Click **Save changes**

---

## Part 4: Update Your .env.local File

Now update your `.env.local` with all the AWS credentials and resource names:

```env
# AWS Configuration
REACT_APP_AWS_REGION=ap-south-1
REACT_APP_AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
REACT_APP_AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# Admin Credentials
REACT_APP_ADMIN_EMAIL=admin@romasdentalcare.com
REACT_APP_ADMIN_PASSWORD=Admin@123

# DynamoDB Table Names
REACT_APP_DYNAMODB_BOOKINGS_TABLE=RomasDental_Bookings
REACT_APP_DYNAMODB_GALLERY_TABLE=RomasDental_Gallery
REACT_APP_DYNAMODB_BLOGS_TABLE=RomasDental_Blogs
REACT_APP_DYNAMODB_SERVICES_TABLE=RomasDental_Services
REACT_APP_DYNAMODB_HOME_CONTENT_TABLE=RomasDental_HomeContent
REACT_APP_DYNAMODB_ABOUT_CONTENT_TABLE=RomasDental_AboutContent
REACT_APP_DYNAMODB_STATS_TABLE=RomasDental_Stats
REACT_APP_DYNAMODB_SOCIAL_LINKS_TABLE=RomasDental_SocialLinks

# S3 Bucket
REACT_APP_S3_BUCKET_NAME=romas-dental-images
```

**Important:**
- Replace `AKIAIOSFODNN7EXAMPLE` with your actual Access Key ID
- Replace `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` with your actual Secret Access Key
- If you used a different S3 bucket name, update `REACT_APP_S3_BUCKET_NAME`

---

## Part 5: Verify Setup

### ✅ Checklist

- [ ] IAM user `romas-dental-app` created
- [ ] Access Key ID and Secret Access Key saved
- [ ] 4 DynamoDB tables created and Active:
  - [ ] RomasDental_Bookings
  - [ ] RomasDental_Gallery
  - [ ] RomasDental_Blogs
  - [ ] RomasDental_Services
- [ ] S3 bucket created
- [ ] S3 CORS configured
- [ ] S3 bucket policy set for public read
- [ ] `.env.local` file updated with all credentials

### Test Your Setup

```powershell
# Start the development server
npm start
```

1. Navigate to `http://localhost:3000/admin`
2. Login with credentials from `.env.local`
3. Try creating a booking
4. Try uploading an image to gallery

---

## 🔒 Security Best Practices

### Current Setup (Development)
Your AWS credentials are in `.env.local` → **NOT for production use!**

### For Production Deployment

**Option 1: AWS Cognito (Recommended)**
- Use Cognito Identity Pool for temporary credentials
- Credentials auto-rotate and are limited in scope
- See `SERVERLESS_GUIDE.md` for Cognito setup

**Option 2: Environment Variables in S3**
- Don't commit `.env.local` to git
- Set environment variables in build process
- Use CloudFront with origin access identity

**Security Tip:**
Never commit your `.env.local` file to GitHub or any public repository!

Add to `.gitignore`:
```
.env.local
.env.production.local
```

---

## 💰 Cost Estimate

With AWS Free Tier:

**DynamoDB:**
- 25 GB storage: FREE
- 25 Read/Write capacity units: FREE
- First 25 GB of storage per month: FREE

**S3:**
- 5 GB storage: FREE
- 20,000 GET requests: FREE
- 2,000 PUT requests: FREE

**After Free Tier (~1000 users/month):**
- DynamoDB: $1-3/month
- S3 storage: $0.50-2/month
- S3 requests: $0.50/month
- **Total: $2-6/month**

---

## 🆘 Troubleshooting

### Issue: "Access Denied" when uploading images

**Solution:**
- Check S3 bucket policy is set correctly
- Verify CORS configuration
- Check IAM user has `AmazonS3FullAccess` policy

### Issue: "ResourceNotFoundException" for DynamoDB

**Solution:**
- Verify table names in `.env.local` match exactly
- Check tables are in `ap-south-1` region
- Ensure tables status is "Active"

### Issue: "Invalid credentials" in browser console

**Solution:**
- Verify Access Key ID and Secret Key in `.env.local`
- Check IAM user has `AmazonDynamoDBFullAccess` policy
- Restart dev server after changing `.env.local`

### Issue: CORS error when uploading to S3

**Solution:**
- Add CORS configuration to S3 bucket (Step 3.3)
- Clear browser cache
- Try different browser

### Issue: Can't see uploaded images

**Solution:**
- Check bucket policy allows public read (Step 3.4)
- Verify ACL is set to "Object writer" in bucket settings
- Check "Block all public access" is UNCHECKED

---

## 📚 Additional Resources

- **AWS DynamoDB Documentation**: https://docs.aws.amazon.com/dynamodb/
- **AWS S3 Documentation**: https://docs.aws.amazon.com/s3/
- **AWS IAM Best Practices**: https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html

---

## ✅ You're All Set!

Your AWS infrastructure is now ready. Run `npm start` and test your admin panel!

**Next Steps:**
1. Test all admin features locally
2. Add some initial data (services, gallery images)
3. Build for production: `npm run build`
4. Deploy to S3: See `DEPLOYMENT_GUIDE.md`

**Need Help?** Check `SERVERLESS_GUIDE.md` for detailed explanations of the serverless architecture.
