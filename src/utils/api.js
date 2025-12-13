import AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION || 'ap-south-1',
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

// Table names
const TABLES = {
  BOOKINGS: process.env.REACT_APP_DYNAMODB_BOOKINGS_TABLE || 'RomasDental_Bookings',
  GALLERY: process.env.REACT_APP_DYNAMODB_GALLERY_TABLE || 'RomasDental_Gallery',
  BLOGS: process.env.REACT_APP_DYNAMODB_BLOGS_TABLE || 'RomasDental_Blogs',
  SERVICES: process.env.REACT_APP_DYNAMODB_SERVICES_TABLE || 'RomasDental_Services',
  HOME_CONTENT: process.env.REACT_APP_DYNAMODB_HOME_CONTENT_TABLE || 'RomasDental_HomeContent',
  ABOUT_CONTENT: process.env.REACT_APP_DYNAMODB_ABOUT_CONTENT_TABLE || 'RomasDental_AboutContent',
  STATS: process.env.REACT_APP_DYNAMODB_STATS_TABLE || 'RomasDental_Stats',
  SOCIAL_LINKS: process.env.REACT_APP_DYNAMODB_SOCIAL_LINKS_TABLE || 'RomasDental_SocialLinks'
};

const S3_BUCKET = process.env.REACT_APP_S3_BUCKET_NAME || 'romas-dental-images';

// Admin credentials from environment
const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL || 'admin@romasdentalcare.com';
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'Admin@123';

// Helper: Generate UUID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    try {
      // Simple credential check from environment variables
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminData = {
          email: email,
          name: 'Admin'
        };
        
        localStorage.setItem('adminToken', 'logged-in');
        localStorage.setItem('adminData', JSON.stringify(adminData));
        
        return {
          success: true,
          admin: adminData
        };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    }
  },
  
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },
  
  getAdmin: () => {
    const data = localStorage.getItem('adminData');
    return data ? JSON.parse(data) : null;
  }
};

// Bookings API
export const bookingsAPI = {
  getAll: async () => {
    try {
      const params = {
        TableName: TABLES.BOOKINGS
      };
      
      const result = await dynamoDB.scan(params).promise();
      
      return {
        success: true,
        count: result.Items.length,
        bookings: result.Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      };
    } catch (error) {
      console.error('Get bookings error:', error);
      return { success: false, message: 'Failed to fetch bookings' };
    }
  },
  
  create: async (bookingData) => {
    try {
      // Get the latest booking number
      let bookingNumber = 1000;
      
      try {
        const scanParams = {
          TableName: TABLES.BOOKINGS,
          ProjectionExpression: 'bookingNumber'
        };
        const scanResult = await dynamoDB.scan(scanParams).promise();
        
        if (scanResult.Items && scanResult.Items.length > 0) {
          const maxNumber = Math.max(...scanResult.Items.map(item => item.bookingNumber || 999));
          bookingNumber = maxNumber + 1;
        }
      } catch (scanError) {
        console.warn('Could not get latest booking number, using default:', scanError);
      }
      
      const params = {
        TableName: TABLES.BOOKINGS,
        Item: {
          bookingId: generateId(),
          bookingNumber: bookingNumber,
          ...bookingData,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      };
      
      await dynamoDB.put(params).promise();
      
      return {
        success: true,
        message: 'Booking created successfully',
        booking: params.Item
      };
    } catch (error) {
      console.error('Create booking error:', error);
      return { success: false, message: 'Failed to create booking' };
    }
  },
  
  updateStatus: async (id, status) => {
    try {
      const params = {
        TableName: TABLES.BOOKINGS,
        Key: { bookingId: id },
        UpdateExpression: 'set #status = :status, updatedAt = :updatedAt',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: {
          ':status': status,
          ':updatedAt': new Date().toISOString()
        },
        ReturnValues: 'ALL_NEW'
      };
      
      const result = await dynamoDB.update(params).promise();
      
      // Send WhatsApp confirmation when status is confirmed
      if (status === 'confirmed' && result.Attributes) {
        const booking = result.Attributes;
        const message = `Hello ${booking.name},\n\nThank you for booking an appointment with Roma's Dental Care!\n\nYour Appointment has been *CONFIRMED* ✅\n\n*Booking ID:* #${booking.bookingNumber}\n*Service:* ${booking.service}\n*Date:* ${new Date(booking.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n*Time:* ${booking.time}\n\n*Clinic Address:*\nShop no. 7, Society Complex, SHUBH SHAGUN,\nOld Mundhwa Rd, opposite Bollywood Multiplex,\nTukaram Nagar, Kharadi, Pune - 411014\n\nWe look forward to serving you!\n\n- Roma's Dental Care Team`;
        
        const whatsappUrl = `https://wa.me/91${booking.mobile}?text=${encodeURIComponent(message)}`;
        
        // Open WhatsApp in new window (admin will need to click send)
        if (typeof window !== 'undefined') {
          window.open(whatsappUrl, '_blank');
        }
      }
      
      return {
        success: true,
        message: 'Booking updated successfully',
        booking: result.Attributes
      };
    } catch (error) {
      console.error('Update booking error:', error);
      return { success: false, message: 'Failed to update booking' };
    }
  },
  
  delete: async (id) => {
    try {
      const params = {
        TableName: TABLES.BOOKINGS,
        Key: { bookingId: id }
      };
      
      await dynamoDB.delete(params).promise();
      
      return {
        success: true,
        message: 'Booking deleted successfully'
      };
    } catch (error) {
      console.error('Delete booking error:', error);
      return { success: false, message: 'Failed to delete booking' };
    }
  }
};

// Services API
export const servicesAPI = {
  getAll: async () => {
    try {
      const params = {
        TableName: TABLES.SERVICES
      };
      
      const result = await dynamoDB.scan(params).promise();
      
      return {
        success: true,
        count: result.Items.length,
        services: result.Items.sort((a, b) => a.displayOrder - b.displayOrder)
      };
    } catch (error) {
      console.error('Get services error:', error);
      return { success: false, message: 'Failed to fetch services' };
    }
  },
  
  create: async (serviceData) => {
    try {
      const params = {
        TableName: TABLES.SERVICES,
        Item: {
          serviceId: generateId(),
          ...serviceData,
          createdAt: new Date().toISOString()
        }
      };
      
      await dynamoDB.put(params).promise();
      
      return {
        success: true,
        message: 'Service created successfully',
        service: params.Item
      };
    } catch (error) {
      console.error('Create service error:', error);
      return { success: false, message: 'Failed to create service' };
    }
  },
  
  update: async (id, serviceData) => {
    try {
      const params = {
        TableName: TABLES.SERVICES,
        Key: { serviceId: id },
        UpdateExpression: 'set title = :title, description = :description, icon = :icon, displayOrder = :displayOrder, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':title': serviceData.title,
          ':description': serviceData.description || '',
          ':icon': serviceData.icon || 'tooth',
          ':displayOrder': serviceData.displayOrder || 999,
          ':updatedAt': new Date().toISOString()
        },
        ReturnValues: 'ALL_NEW'
      };
      
      const result = await dynamoDB.update(params).promise();
      
      return {
        success: true,
        message: 'Service updated successfully',
        service: result.Attributes
      };
    } catch (error) {
      console.error('Update service error:', error);
      return { success: false, message: 'Failed to update service' };
    }
  },
  
  delete: async (id) => {
    try {
      const params = {
        TableName: TABLES.SERVICES,
        Key: { serviceId: id }
      };
      
      await dynamoDB.delete(params).promise();
      
      return {
        success: true,
        message: 'Service deleted successfully'
      };
    } catch (error) {
      console.error('Delete service error:', error);
      return { success: false, message: 'Failed to delete service' };
    }
  }
};

// Gallery API
export const galleryAPI = {
  getAll: async () => {
    try {
      const params = {
        TableName: TABLES.GALLERY
      };
      
      const result = await dynamoDB.scan(params).promise();
      
      return {
        success: true,
        count: result.Items.length,
        images: result.Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      };
    } catch (error) {
      console.error('Get gallery error:', error);
      return { success: false, message: 'Failed to fetch gallery' };
    }
  },
  
  upload: async (file, title, description, category) => {
    try {
      const imageId = generateId();
      const fileName = `gallery/${imageId}-${file.name}`;
      
      // Upload to S3
      const uploadParams = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Body: file,
        ACL: 'public-read',
        ContentType: file.type
      };
      
      const s3Result = await s3.upload(uploadParams).promise();
      
      // Save to DynamoDB
      const dbParams = {
        TableName: TABLES.GALLERY,
        Item: {
          imageId,
          title: title || 'Untitled',
          description: description || '',
          category: category || 'general',
          imageUrl: s3Result.Location,
          s3Key: fileName,
          createdAt: new Date().toISOString()
        }
      };
      
      await dynamoDB.put(dbParams).promise();
      
      return {
        success: true,
        message: 'Image uploaded successfully',
        image: dbParams.Item
      };
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, message: 'Failed to upload image' };
    }
  },
  
  delete: async (id) => {
    try {
      // Get image details first
      const getParams = {
        TableName: TABLES.GALLERY,
        Key: { imageId: id }
      };
      
      const result = await dynamoDB.get(getParams).promise();
      
      if (!result.Item) {
        return { success: false, message: 'Image not found' };
      }
      
      // Delete from S3
      if (result.Item.s3Key) {
        const s3Params = {
          Bucket: S3_BUCKET,
          Key: result.Item.s3Key
        };
        await s3.deleteObject(s3Params).promise();
      }
      
      // Delete from DynamoDB
      const deleteParams = {
        TableName: TABLES.GALLERY,
        Key: { imageId: id }
      };
      
      await dynamoDB.delete(deleteParams).promise();
      
      return {
        success: true,
        message: 'Image deleted successfully'
      };
    } catch (error) {
      console.error('Delete image error:', error);
      return { success: false, message: 'Failed to delete image' };
    }
  },

  update: async (id, updateData) => {
    try {
      const params = {
        TableName: TABLES.GALLERY,
        Key: { imageId: id },
        UpdateExpression: 'set title = :title, description = :description, category = :category, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':title': updateData.title,
          ':description': updateData.description || '',
          ':category': updateData.category || 'treatments',
          ':updatedAt': new Date().toISOString()
        },
        ReturnValues: 'ALL_NEW'
      };
      
      const result = await dynamoDB.update(params).promise();
      
      return {
        success: true,
        message: 'Image updated successfully',
        image: result.Attributes
      };
    } catch (error) {
      console.error('Update image error:', error);
      return { success: false, message: 'Failed to update image' };
    }
  }
};

// Blogs API
export const blogsAPI = {
  getAll: async () => {
    try {
      const params = {
        TableName: TABLES.BLOGS
      };
      
      const result = await dynamoDB.scan(params).promise();
      
      return {
        success: true,
        count: result.Items.length,
        blogs: result.Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      };
    } catch (error) {
      console.error('Get blogs error:', error);
      return { success: false, message: 'Failed to fetch blogs' };
    }
  },
  
  getOne: async (id) => {
    try {
      const params = {
        TableName: TABLES.BLOGS,
        Key: { blogId: id }
      };
      
      const result = await dynamoDB.get(params).promise();
      
      if (!result.Item) {
        return { success: false, message: 'Blog not found' };
      }
      
      return {
        success: true,
        blog: result.Item
      };
    } catch (error) {
      console.error('Get blog error:', error);
      return { success: false, message: 'Failed to fetch blog' };
    }
  },
  
  create: async (blogData, imageFile) => {
    try {
      const blogId = generateId();
      let imageUrl = '';
      let s3Key = '';
      
      // Upload image if provided
      if (imageFile) {
        const fileName = `blogs/${blogId}-${imageFile.name}`;
        const uploadParams = {
          Bucket: S3_BUCKET,
          Key: fileName,
          Body: imageFile,
          ACL: 'public-read',
          ContentType: imageFile.type
        };
        
        const s3Result = await s3.upload(uploadParams).promise();
        imageUrl = s3Result.Location;
        s3Key = fileName;
      }
      
      const params = {
        TableName: TABLES.BLOGS,
        Item: {
          blogId,
          ...blogData,
          imageUrl,
          s3Key,
          createdAt: new Date().toISOString()
        }
      };
      
      await dynamoDB.put(params).promise();
      
      return {
        success: true,
        message: 'Blog created successfully',
        blog: params.Item
      };
    } catch (error) {
      console.error('Create blog error:', error);
      return { success: false, message: 'Failed to create blog' };
    }
  },
  
  update: async (id, blogData, imageFile) => {
    try {
      let updateExpression = 'set title = :title, content = :content, excerpt = :excerpt, category = :category, author = :author, #link = :link, updatedAt = :updatedAt';
      let expressionValues = {
        ':title': blogData.title,
        ':content': blogData.content,
        ':excerpt': blogData.excerpt || '',
        ':category': blogData.category || 'dental-care',
        ':author': blogData.author || 'Dr. Roma',
        ':link': blogData.link || '',
        ':updatedAt': new Date().toISOString()
      };
      
      let expressionAttributeNames = {
        '#link': 'link'
      };
      
      // Upload new image if provided
      if (imageFile) {
        const fileName = `blogs/${id}-${imageFile.name}`;
        const uploadParams = {
          Bucket: S3_BUCKET,
          Key: fileName,
          Body: imageFile,
          ACL: 'public-read',
          ContentType: imageFile.type
        };
        
        const s3Result = await s3.upload(uploadParams).promise();
        updateExpression += ', imageUrl = :imageUrl, s3Key = :s3Key';
        expressionValues[':imageUrl'] = s3Result.Location;
        expressionValues[':s3Key'] = fileName;
      }
      
      const params = {
        TableName: TABLES.BLOGS,
        Key: { blogId: id },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionValues,
        ReturnValues: 'ALL_NEW'
      };
      
      const result = await dynamoDB.update(params).promise();
      
      return {
        success: true,
        message: 'Blog updated successfully',
        blog: result.Attributes
      };
    } catch (error) {
      console.error('Update blog error:', error);
      return { success: false, message: 'Failed to update blog' };
    }
  },
  
  delete: async (id) => {
    try {
      // Get blog details first
      const getParams = {
        TableName: TABLES.BLOGS,
        Key: { blogId: id }
      };
      
      const result = await dynamoDB.get(getParams).promise();
      
      if (!result.Item) {
        return { success: false, message: 'Blog not found' };
      }
      
      // Delete from S3 if image exists
      if (result.Item.s3Key) {
        const s3Params = {
          Bucket: S3_BUCKET,
          Key: result.Item.s3Key
        };
        await s3.deleteObject(s3Params).promise();
      }
      
      // Delete from DynamoDB
      const deleteParams = {
        TableName: TABLES.BLOGS,
        Key: { blogId: id }
      };
      
      await dynamoDB.delete(deleteParams).promise();
      
      return {
        success: true,
        message: 'Blog deleted successfully'
      };
    } catch (error) {
      console.error('Delete blog error:', error);
      return { success: false, message: 'Failed to delete blog' };
    }
  }
};

// Home Content API
export const homeContentAPI = {
  get: async () => {
    try {
      const params = {
        TableName: TABLES.HOME_CONTENT,
        Key: { contentId: 'home-hero' }
      };
      
      const result = await dynamoDB.get(params).promise();
      
      if (!result.Item) {
        // Return default content if not found
        return {
          success: true,
          content: {
            tagline: 'Your Smile, Our Priority',
            heading: 'Experience',
            highlightedText: 'World-Class Dental Care',
            description: 'Complete dental solutions with 10+ specialties and 1000+ satisfied patients. From routine checkups to advanced procedures, we\'re here for your whole family.',
            heroImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80',
            openingHours: {
              days: '6 Days',
              time: '10 AM - 8 PM',
              closedDay: 'Tuesday'
            },
            phoneNumber: '+917499537267',
            whatsappNumber: '917499537267'
          }
        };
      }
      
      return {
        success: true,
        content: result.Item
      };
    } catch (error) {
      console.error('Get home content error:', error);
      return { success: false, message: 'Failed to fetch home content' };
    }
  },
  
  update: async (contentData, imageFile = null) => {
    try {
      let imageUrl = contentData.heroImage;
      let s3Key = contentData.s3Key || '';
      
      // Upload new image if provided
      if (imageFile) {
        const fileName = `home-content/hero-${Date.now()}-${imageFile.name}`;
        const uploadParams = {
          Bucket: S3_BUCKET,
          Key: fileName,
          Body: imageFile,
          ACL: 'public-read',
          ContentType: imageFile.type
        };
        
        const s3Result = await s3.upload(uploadParams).promise();
        imageUrl = s3Result.Location;
        s3Key = fileName;
        
        // Delete old image if it exists and is from our S3 bucket
        if (contentData.s3Key && contentData.s3Key.startsWith('home-content/')) {
          try {
            await s3.deleteObject({
              Bucket: S3_BUCKET,
              Key: contentData.s3Key
            }).promise();
          } catch (deleteError) {
            console.warn('Failed to delete old image:', deleteError);
          }
        }
      }
      
      const params = {
        TableName: TABLES.HOME_CONTENT,
        Item: {
          contentId: 'home-hero',
          ...contentData,
          heroImage: imageUrl,
          s3Key: s3Key,
          updatedAt: new Date().toISOString()
        }
      };
      
      await dynamoDB.put(params).promise();
      
      return {
        success: true,
        message: 'Home content updated successfully',
        content: params.Item
      };
    } catch (error) {
      console.error('Update home content error:', error);
      return { success: false, message: 'Failed to update home content' };
    }
  }
};

// About Content API
export const aboutContentAPI = {
  get: async () => {
    try {
      const params = {
        TableName: TABLES.ABOUT_CONTENT,
        Key: { contentId: 'about-section' }
      };
      
      const result = await dynamoDB.get(params).promise();
      
      if (!result.Item) {
        // Return default content if not found
        return {
          success: true,
          content: {
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
          }
        };
      }
      
      // Handle backward compatibility: convert old paragraphs array to content string
      let contentData = { ...result.Item };
      if (contentData.paragraphs && Array.isArray(contentData.paragraphs) && !contentData.content) {
        contentData.content = contentData.paragraphs.join('\n\n');
        delete contentData.paragraphs;
      }
      
      return {
        success: true,
        content: contentData
      };
    } catch (error) {
      console.error('Get about content error:', error);
      return { success: false, message: 'Failed to fetch about content' };
    }
  },
  
  update: async (contentData, imageFile = null) => {
    try {
      let imageUrl = contentData.mainImage;
      let s3Key = contentData.s3Key || '';
      
      // Upload new image if provided
      if (imageFile) {
        const fileName = `about-content/main-${Date.now()}-${imageFile.name}`;
        const uploadParams = {
          Bucket: S3_BUCKET,
          Key: fileName,
          Body: imageFile,
          ACL: 'public-read',
          ContentType: imageFile.type
        };
        
        const s3Result = await s3.upload(uploadParams).promise();
        imageUrl = s3Result.Location;
        s3Key = fileName;
        
        // Delete old image if it exists and is from our S3 bucket
        if (contentData.s3Key && contentData.s3Key.startsWith('about-content/')) {
          try {
            await s3.deleteObject({
              Bucket: S3_BUCKET,
              Key: contentData.s3Key
            }).promise();
          } catch (deleteError) {
            console.warn('Failed to delete old image:', deleteError);
          }
        }
      }
      
      const params = {
        TableName: TABLES.ABOUT_CONTENT,
        Item: {
          contentId: 'about-section',
          ...contentData,
          mainImage: imageUrl,
          s3Key: s3Key,
          updatedAt: new Date().toISOString()
        }
      };
      
      await dynamoDB.put(params).promise();
      
      return {
        success: true,
        message: 'About content updated successfully',
        content: params.Item
      };
    } catch (error) {
      console.error('Update about content error:', error);
      return { success: false, message: 'Failed to update about content' };
    }
  }
};

// Stats API
export const statsAPI = {
  get: async () => {
    try {
      const params = {
        TableName: TABLES.STATS,
        Key: { statsId: 'main-stats' }
      };
      
      const result = await dynamoDB.get(params).promise();
      
      if (!result.Item) {
        return {
          success: true,
          stats: {
            happyPatients: 1000,
            specialists: 10
          }
        };
      }
      
      return {
        success: true,
        stats: result.Item
      };
    } catch (error) {
      console.error('Get stats error:', error);
      return { success: false, message: 'Failed to fetch stats' };
    }
  },
  
  update: async (statsData) => {
    try {
      const params = {
        TableName: TABLES.STATS,
        Item: {
          statsId: 'main-stats',
          ...statsData,
          updatedAt: new Date().toISOString()
        }
      };
      
      await dynamoDB.put(params).promise();
      
      return {
        success: true,
        message: 'Stats updated successfully',
        stats: params.Item
      };
    } catch (error) {
      console.error('Update stats error:', error);
      return { success: false, message: 'Failed to update stats' };
    }
  }
};

// Social Links API
export const socialLinksAPI = {
  getAll: async () => {
    try {
      const params = {
        TableName: TABLES.SOCIAL_LINKS
      };
      
      const result = await dynamoDB.scan(params).promise();
      
      // Sort by order field
      const sortedLinks = (result.Items || []).sort((a, b) => (a.order || 0) - (b.order || 0));
      
      return {
        success: true,
        socialLinks: sortedLinks
      };
    } catch (error) {
      console.error('Get social links error:', error);
      return { success: false, message: 'Failed to fetch social links', socialLinks: [] };
    }
  },
  
  create: async (linkData) => {
    try {
      const linkId = generateId();
      const params = {
        TableName: TABLES.SOCIAL_LINKS,
        Item: {
          linkId,
          ...linkData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
      
      await dynamoDB.put(params).promise();
      
      return {
        success: true,
        message: 'Social link added successfully',
        socialLink: params.Item
      };
    } catch (error) {
      console.error('Create social link error:', error);
      return { success: false, message: 'Failed to add social link' };
    }
  },
  
  update: async (linkId, linkData) => {
    try {
      const params = {
        TableName: TABLES.SOCIAL_LINKS,
        Item: {
          linkId,
          ...linkData,
          updatedAt: new Date().toISOString()
        }
      };
      
      await dynamoDB.put(params).promise();
      
      return {
        success: true,
        message: 'Social link updated successfully',
        socialLink: params.Item
      };
    } catch (error) {
      console.error('Update social link error:', error);
      return { success: false, message: 'Failed to update social link' };
    }
  },
  
  delete: async (linkId) => {
    try {
      const params = {
        TableName: TABLES.SOCIAL_LINKS,
        Key: { linkId }
      };
      
      await dynamoDB.delete(params).promise();
      
      return {
        success: true,
        message: 'Social link deleted successfully'
      };
    } catch (error) {
      console.error('Delete social link error:', error);
      return { success: false, message: 'Failed to delete social link' };
    }
  }
};
