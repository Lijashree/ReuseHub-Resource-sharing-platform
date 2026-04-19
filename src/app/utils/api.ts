// MOCK BACKEND FOR DEMO - WORKS COMPLETELY WITHOUT NETWORK!
// This is a fully functional in-memory backend for your presentation

// In-memory storage
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
}

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  quantity: number;
  type: string;
  status: string;
  imageUrl: string;
  ownerName: string;
  ownerPhone: string;
  location: string;
  timeSlot: string;
  ownerId: string;
  createdAt: string;
}

interface Request {
  id: string;
  itemId: string;
  itemTitle: string;
  requesterId: string;
  requesterName: string;
  requestedQuantity: number;
  message: string;
  status: string;
  createdAt: string;
  item?: Item;
}

// Get storage from localStorage to persist across page refreshes
const getStorage = (key: string, defaultValue: any) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

let users: User[] = getStorage('mock_users', []);
let items: Item[] = getStorage('mock_items', []);
let requests: Request[] = getStorage('mock_requests', []);

// Save to localStorage whenever data changes
const saveData = () => {
  setStorage('mock_users', users);
  setStorage('mock_items', items);
  setStorage('mock_requests', requests);
};

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Helper to simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Auth token management
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const setCurrentUser = (user: any) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const removeCurrentUser = () => {
  localStorage.removeItem('currentUser');
};

// Mock API
export const api = {
  auth: {
    signup: async (email: string, password: string, name: string, role: string = 'user') => {
      await delay();

      // Reload users from localStorage to ensure we have latest data
      users = getStorage('mock_users', []);

      // Check if user exists
      if (users.find(u => u.email === email)) {
        throw new Error('User already exists');
      }

      const newUser: User = {
        id: generateId(),
        email,
        password, // In real app, would be hashed
        name,
        role: role || 'user',
      };

      users.push(newUser);
      saveData();

      return { message: 'Account created successfully' };
    },

    signin: async (email: string, password: string) => {
      await delay();

      // Reload users from localStorage to ensure we have latest data
      users = getStorage('mock_users', []);

      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        throw new Error('Invalid email or password');
      }

      const { password: _, ...userWithoutPassword } = user;
      const accessToken = 'mock_token_' + user.id;

      setAuthToken(accessToken);
      setCurrentUser(userWithoutPassword);

      return { accessToken, user: userWithoutPassword };
    },

    getMe: async () => {
      await delay();
      return getCurrentUser();
    },

    signout: () => {
      removeAuthToken();
      removeCurrentUser();
    },
  },

  items: {
    create: async (itemData: any) => {
      await delay();

      // Reload items from localStorage to ensure we have latest data
      items = getStorage('mock_items', []);

      const currentUser = getCurrentUser();
      if (!currentUser) throw new Error('Not authenticated');

      const newItem: Item = {
        id: generateId(),
        title: itemData.title,
        description: itemData.description,
        category: itemData.category,
        subcategory: itemData.subcategory,
        quantity: itemData.quantity,
        type: itemData.type,
        status: 'pending', // Always starts as pending
        imageUrl: itemData.imageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        ownerName: currentUser.name,
        ownerPhone: itemData.ownerPhone,
        location: itemData.location,
        timeSlot: itemData.timeSlot,
        ownerId: currentUser.id,
        createdAt: new Date().toISOString(),
      };

      items.push(newItem);
      saveData();

      return { item: newItem };
    },

    getAll: async (filters?: { status?: string; type?: string; category?: string; q?: string }) => {
      await delay(200);

      // Reload items from localStorage to ensure we have latest data
      items = getStorage('mock_items', []);

      let filtered = [...items];
      
      if (filters?.status) {
        filtered = filtered.filter(item => item.status === filters.status);
      }
      
      if (filters?.type) {
        filtered = filtered.filter(item => item.type === filters.type);
      }
      
      if (filters?.category && filters.category !== 'All') {
        filtered = filtered.filter(item => item.category === filters.category);
      }
      
      if (filters?.q) {
        filtered = filtered.filter(item => 
          item.title.toLowerCase().includes(filters.q!.toLowerCase())
        );
      }
      
      return { items: filtered };
    },

    getById: async (id: string) => {
      await delay();
      
      const item = items.find(item => item.id === id);
      if (!item) throw new Error('Item not found');
      
      return { item };
    },
  },

  admin: {
    approveItem: async (itemId: string) => {
      await delay();

      // Reload items from localStorage to ensure we have latest data
      items = getStorage('mock_items', []);

      const currentUser = getCurrentUser();
      if (!currentUser || currentUser.role !== 'admin') {
        throw new Error('Unauthorized - Admin only');
      }

      const item = items.find(item => item.id === itemId);
      if (!item) throw new Error('Item not found');

      item.status = 'approved';
      saveData();

      return { item };
    },

    rejectItem: async (itemId: string) => {
      await delay();

      // Reload items from localStorage to ensure we have latest data
      items = getStorage('mock_items', []);

      const currentUser = getCurrentUser();
      if (!currentUser || currentUser.role !== 'admin') {
        throw new Error('Unauthorized - Admin only');
      }

      const item = items.find(item => item.id === itemId);
      if (!item) throw new Error('Item not found');

      item.status = 'rejected';
      saveData();

      return { item };
    },
  },

  requests: {
    create: async (itemId: string, requestedQuantity: number, message?: string) => {
      await delay();

      // Reload data from localStorage
      items = getStorage('mock_items', []);
      requests = getStorage('mock_requests', []);

      const currentUser = getCurrentUser();
      if (!currentUser) throw new Error('Not authenticated');

      const item = items.find(i => i.id === itemId);
      if (!item) throw new Error('Item not found');
      
      const newRequest: Request = {
        id: generateId(),
        itemId,
        itemTitle: item.title,
        requesterId: currentUser.id,
        requesterName: currentUser.name,
        requestedQuantity,
        message: message || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      requests.push(newRequest);
      saveData();
      
      return { request: newRequest };
    },

    getOwnerRequests: async () => {
      await delay();

      // Reload data from localStorage
      items = getStorage('mock_items', []);
      requests = getStorage('mock_requests', []);

      const currentUser = getCurrentUser();
      if (!currentUser) throw new Error('Not authenticated');

      // Get requests for items owned by current user
      const myItems = items.filter(item => item.ownerId === currentUser.id);
      const myItemIds = myItems.map(item => item.id);
      
      const ownerRequests = requests.filter(req => myItemIds.includes(req.itemId));
      
      // Add item details to each request
      const requestsWithItems = ownerRequests.map(req => {
        const item = items.find(i => i.id === req.itemId);
        return { ...req, item };
      });
      
      return { requests: requestsWithItems };
    },

    getUserRequests: async () => {
      await delay();

      // Reload data from localStorage
      items = getStorage('mock_items', []);
      requests = getStorage('mock_requests', []);

      const currentUser = getCurrentUser();
      if (!currentUser) throw new Error('Not authenticated');

      // Get requests made by current user
      const userRequests = requests.filter(req => req.requesterId === currentUser.id);
      
      // Add item details to each request
      const requestsWithItems = userRequests.map(req => {
        const item = items.find(i => i.id === req.itemId);
        return { ...req, item };
      });
      
      return { requests: requestsWithItems };
    },

    approve: async (requestId: string) => {
      await delay();

      // Reload data from localStorage
      requests = getStorage('mock_requests', []);

      const request = requests.find(r => r.id === requestId);
      if (!request) throw new Error('Request not found');
      
      request.status = 'approved';
      saveData();
      
      return { request };
    },

    reject: async (requestId: string) => {
      await delay();

      // Reload data from localStorage
      requests = getStorage('mock_requests', []);

      const request = requests.find(r => r.id === requestId);
      if (!request) throw new Error('Request not found');
      
      request.status = 'rejected';
      saveData();
      
      return { request };
    },
  },

  donations: {
    getAll: async () => {
      await delay();
      
      const currentUser = getCurrentUser();
      if (!currentUser) throw new Error('Not authenticated');
      
      // Get donation items owned by current user
      const donationItems = items.filter(
        item => item.ownerId === currentUser.id && item.type === 'donate'
      );
      
      return { items: donationItems };
    },

    requestPickup: async (itemIds: string[], ngoName: string, ngoContact: string, pickupDate: string) => {
      await delay();
      
      // In a real app, this would create pickup requests
      // For demo, we'll just return success
      return { message: 'Pickup request submitted successfully' };
    },
  },

  impact: {
    getStats: async () => {
      await delay();
      
      // Calculate real stats from our data
      const approvedItems = items.filter(i => i.status === 'approved');
      const totalItems = approvedItems.length;
      const completedRequests = requests.filter(r => r.status === 'approved');
      
      return {
        totalItems,
        studentsHelped: completedRequests.length * 2, // Estimate
        wasteReduced: totalItems * 5, // kg estimate
        co2Saved: totalItems * 10, // kg estimate
      };
    },
  },
};
