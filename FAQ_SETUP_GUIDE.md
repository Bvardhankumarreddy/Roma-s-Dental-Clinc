# FAQ Section Setup Guide

## Overview
The FAQ (Frequently Asked Questions) section has been added to improve SEO and Google indexing with structured data support.

## Features
✅ **SEO Optimized**: Includes JSON-LD structured data for Google rich snippets  
✅ **Accordion UI**: Clean, expandable FAQ items  
✅ **Admin Management**: Full CRUD operations from admin panel  
✅ **Display Order**: Control the order of FAQ items  
✅ **Mobile Responsive**: Works perfectly on all devices  
✅ **Accessible**: Proper ARIA attributes for screen readers

## DynamoDB Table Setup

### Table Details
- **Table Name**: `RomasDental_FAQ`
- **Primary Key**: `faqId` (String)
- **Region**: ap-south-1 (Asia Pacific - Mumbai)

### Create Table via AWS Console

1. Go to AWS Console → DynamoDB → Tables
2. Click **Create table**
3. Enter:
   - **Table name**: `RomasDental_FAQ`
   - **Partition key**: `faqId` (String)
4. Use default settings
5. Click **Create table**

### Create Table via AWS CLI

```bash
aws dynamodb create-table \
    --table-name RomasDental_FAQ \
    --attribute-definitions AttributeName=faqId,AttributeType=S \
    --key-schema AttributeName=faqId,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --region ap-south-1
```

## Environment Variable

Add to your `.env.local` file:

```env
REACT_APP_DYNAMODB_FAQ_TABLE=RomasDental_FAQ
```

## Sample FAQ Data

Here are some dental FAQ items you can add through the admin panel:

### FAQ 1
**Question**: What are your clinic hours?  
**Answer**: We are open Monday, Wednesday through Sunday from 10:00 AM to 8:00 PM. We are closed on Tuesdays. You can book appointments during these hours or call us anytime for emergencies.  
**Display Order**: 1

### FAQ 2
**Question**: Do you accept insurance?  
**Answer**: Yes, we accept most major dental insurance plans. We also offer flexible payment options and affordable pricing for those without insurance. Please contact us to verify your specific insurance coverage.  
**Display Order**: 2

### FAQ 3
**Question**: Is the first consultation free?  
**Answer**: Yes! Your first consultation and dental examination are completely free. This includes a comprehensive oral health assessment and treatment plan discussion with our experienced dentist.  
**Display Order**: 3

### FAQ 4
**Question**: Are dental procedures painful?  
**Answer**: We prioritize patient comfort and use advanced techniques to ensure painless procedures. Most treatments are performed with local anesthesia, and we offer sedation options for anxious patients. Our gentle approach makes dental care comfortable for everyone.  
**Display Order**: 4

### FAQ 5
**Question**: How often should I visit the dentist?  
**Answer**: We recommend visiting the dentist every 6 months for routine checkups and professional cleaning. However, some patients may need more frequent visits based on their oral health condition. Regular visits help prevent dental problems and maintain optimal oral health.  
**Display Order**: 5

### FAQ 6
**Question**: Do you treat children?  
**Answer**: Yes! We welcome patients of all ages, including children. Dr. Roma has extensive experience in pediatric dentistry and creates a friendly, comfortable environment that helps children feel at ease during dental visits.  
**Display Order**: 6

### FAQ 7
**Question**: What payment methods do you accept?  
**Answer**: We accept cash, credit cards, debit cards, UPI payments, and bank transfers. We also offer EMI options for expensive treatments to make dental care more affordable for our patients.  
**Display Order**: 7

### FAQ 8
**Question**: Do you provide emergency dental services?  
**Answer**: Yes, we handle dental emergencies during our clinic hours. If you have a dental emergency like severe toothache, broken tooth, or dental trauma, please call us immediately at +91 7499537267 or +91 9284338406.  
**Display Order**: 8

### FAQ 9
**Question**: How long does a root canal treatment take?  
**Answer**: We offer single-sitting root canal treatment using advanced rotary endodontics, which can be completed in one visit of approximately 60-90 minutes. Complex cases may require a second visit. Most patients experience minimal discomfort during and after the procedure.  
**Display Order**: 9

### FAQ 10
**Question**: What is the cost of teeth whitening?  
**Answer**: Teeth whitening costs vary based on the method chosen. We offer both in-office professional whitening and take-home whitening kits. Prices start from ₹5,000. Please contact us or visit our clinic for detailed pricing and personalized recommendations.  
**Display Order**: 10

## Using the Admin Panel

### Adding a New FAQ

1. Login to admin panel at `/admin`
2. Click on the **FAQ** tab
3. Click **Add New FAQ** button
4. Fill in:
   - **Question**: The FAQ question (required)
   - **Answer**: The detailed answer (required, supports line breaks)
   - **Display Order**: Number for ordering (lower = shows first)
5. Click **Create FAQ**

### Editing an FAQ

1. Find the FAQ you want to edit
2. Click the **Edit** (pencil) icon
3. Modify the fields
4. Click **Update FAQ**

### Deleting an FAQ

1. Find the FAQ you want to delete
2. Click the **Delete** (trash) icon
3. Confirm the deletion

### Reordering FAQs

- Set the **Display Order** field when creating/editing
- Lower numbers appear first (e.g., 1, 2, 3...)
- FAQs with the same order are sorted alphabetically

## SEO Benefits

### Structured Data (JSON-LD)
The FAQ section automatically generates JSON-LD structured data that helps Google:
- Display rich snippets in search results
- Feature your FAQs in the "People also ask" section
- Improve click-through rates
- Enhance overall SEO rankings

### Schema.org FAQPage
Implements the official FAQPage schema from schema.org, which is recognized by all major search engines (Google, Bing, Yahoo).

### Best Practices Included
✅ Semantic HTML with proper headings  
✅ Accessible accordion with ARIA attributes  
✅ Mobile-friendly responsive design  
✅ Fast loading with optimized rendering  
✅ Clear, concise answers to common questions

## Testing

### 1. Test Locally
```bash
npm start
```
Visit http://localhost:3000 and scroll to the FAQ section

### 2. Test Structured Data
After deployment, use Google's Rich Results Test:
https://search.google.com/test/rich-results

Enter your website URL and verify the FAQPage schema is detected.

### 3. Search Console
After deployment, submit your sitemap to Google Search Console:
https://search.google.com/search-console

Monitor how your FAQ rich snippets appear in search results.

## FAQ Section Location

The FAQ section is positioned strategically:
- After Reviews section
- Before Contact section
- Visible in navigation menu (desktop & mobile)
- Accessible via scroll or direct link: `#faq`

## Troubleshooting

### FAQs not loading
1. Check DynamoDB table exists: `RomasDental_FAQ`
2. Verify AWS credentials in `.env.local`
3. Check browser console for errors
4. Ensure IAM user has DynamoDB permissions

### FAQs not appearing in search
1. FAQs need to be indexed by Google (takes 1-2 weeks)
2. Verify structured data with Rich Results Test
3. Submit sitemap to Google Search Console
4. Ensure FAQ content is valuable and original

### Display order not working
1. FAQs are sorted by `displayOrder` field (ascending)
2. Check that each FAQ has a displayOrder value
3. Lower numbers appear first (1 before 2 before 3...)

## Tips for Writing Good FAQs

1. **Use Natural Language**: Write questions as your patients would ask them
2. **Be Specific**: Answer the exact question being asked
3. **Keep Answers Concise**: 2-3 sentences is ideal for most FAQs
4. **Include Keywords**: Use relevant dental terms naturally
5. **Address Common Concerns**: Focus on frequently asked patient questions
6. **Update Regularly**: Add new FAQs based on patient inquiries
7. **Avoid Jargon**: Use simple language that everyone can understand
8. **Add Contact Info**: Include phone numbers or booking links where relevant

## Cost Impact

**Free Tier**: No additional cost (covered by existing DynamoDB free tier)  
**After Free Tier**: ~$0.10-0.50/month (minimal impact)

The FAQ table uses very minimal read/write capacity, so costs are negligible.

## Support

For questions or issues:
- Email: drromadentalcare@gmail.com
- Phone: +91 7499537267, +91 9284338406
- Admin Panel: Built-in FAQ manager with intuitive interface
