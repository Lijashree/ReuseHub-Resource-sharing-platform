// Sample data loader - runs once on first app load
// This creates demo users and items for immediate testing

export const loadSampleData = () => {
  // Check if sample data already loaded
  const dataLoaded = localStorage.getItem('sample_data_loaded');
  if (dataLoaded === 'true') {
    return; // Already loaded
  }

  // Sample Users
  const sampleUsers = [
    {
      id: 'admin_1',
      email: 'lijashree@college.edu',
      password: 'admin123',
      name: 'Lijashree',
      role: 'admin',
    },
    {
      id: 'user_1',
      email: 'krishnapriya@college.edu',
      password: 'user123',
      name: 'Krishnapriya',
      role: 'user',
    },
    {
      id: 'user_2',
      email: 'mithuna@college.edu',
      password: 'user123',
      name: 'Mithuna',
      role: 'user',
    },
  ];

  // Sample Items (all pre-approved for demo)
  const sampleItems = [
    {
      id: 'item_1',
      title: 'ASUS Laptop',
      description: 'ASUS laptop in excellent condition, perfect for programming and daily tasks. Includes charger and original box.',
      category: 'Laptops',
      quantity: 1,
      type: 'share',
      status: 'approved',
      imageUrl: '/src/imports/asus.jpeg',
      ownerName: 'Krishnapriya',
      ownerPhone: '9876543210',
      location: 'CS Department, Room 301',
      timeSlot: '2:00 PM - 5:00 PM',
      ownerId: 'user_1',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    },
    {
      id: 'item_2',
      title: 'HP Laptop Charger',
      description: 'Original HP charger, 65W, compatible with most HP laptop models. In perfect working condition.',
      category: 'Laptops',
      quantity: 2,
      type: 'share',
      status: 'approved',
      imageUrl: '/src/imports/hp.jpeg',
      ownerName: 'Mithuna',
      ownerPhone: '9876543211',
      location: 'Library, Ground Floor',
      timeSlot: '10:00 AM - 1:00 PM',
      ownerId: 'user_2',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    },
    {
      id: 'item_3',
      title: 'Ultrasonic Sensor HC-SR04',
      description: 'Ultrasonic distance sensor for Arduino/Raspberry Pi projects. Never used, brand new.',
      category: 'Project Components',
      subcategory: 'Sensors',
      quantity: 3,
      type: 'share',
      status: 'approved',
      imageUrl: '/src/imports/sensor.jpeg',
      ownerName: 'Lijashree',
      ownerPhone: '9876543212',
      location: 'Electronics Lab, 2nd Floor',
      timeSlot: '3:00 PM - 6:00 PM',
      ownerId: 'admin_1',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    },
    {
      id: 'item_4',
      title: 'Raspberry Pi 4 Model B',
      description: 'Raspberry Pi 4 with 4GB RAM. Includes SD card with Raspbian OS pre-installed. Great for IoT projects.',
      category: 'Project Components',
      subcategory: 'Arduino',
      quantity: 1,
      type: 'share',
      status: 'approved',
      imageUrl: '/src/imports/ras.jpeg',
      ownerName: 'Krishnapriya',
      ownerPhone: '9876543210',
      location: 'Makers Lab, Building B',
      timeSlot: '11:00 AM - 2:00 PM',
      ownerId: 'user_1',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
    },
    {
      id: 'item_5',
      title: 'HTML & CSS Book',
      description: 'Complete guide to HTML5 and CSS3. Perfect condition with no markings. Ideal for web development beginners.',
      category: 'Books',
      quantity: 2,
      type: 'donate',
      status: 'approved',
      imageUrl: '/src/imports/book.jpeg',
      ownerName: 'Mithuna',
      ownerPhone: '9876543211',
      location: 'Main Library, Reference Section',
      timeSlot: '9:00 AM - 5:00 PM',
      ownerId: 'user_2',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    },
  ];

  // Sample Requests
  const sampleRequests = [
    {
      id: 'req_1',
      itemId: 'item_1',
      itemTitle: 'ASUS Laptop',
      requesterId: 'user_2',
      requesterName: 'Mithuna',
      requestedQuantity: 1,
      message: "I need this for my final year project. Would be really helpful!",
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
    },
    {
      id: 'req_2',
      itemId: 'item_3',
      itemTitle: 'Ultrasonic Sensor HC-SR04',
      requesterId: 'user_1',
      requesterName: 'Krishnapriya',
      requestedQuantity: 2,
      message: "Need for robotics project. Will return after semester.",
      status: 'approved',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    },
  ];

  // Save to localStorage
  localStorage.setItem('mock_users', JSON.stringify(sampleUsers));
  localStorage.setItem('mock_items', JSON.stringify(sampleItems));
  localStorage.setItem('mock_requests', JSON.stringify(sampleRequests));
  localStorage.setItem('sample_data_loaded', 'true');

  console.log('✅ Sample data loaded successfully!');
  console.log('📧 Demo Accounts:');
  console.log('   Admin: lijashree@college.edu / admin123');
  console.log('   User 1: krishnapriya@college.edu / user123');
  console.log('   User 2: mithuna@college.edu / user123');
};
