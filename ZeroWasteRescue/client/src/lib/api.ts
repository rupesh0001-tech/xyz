// API client for backend communication
const API_BASE = '/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include', // Include cookies for session
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(response.status, error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authApi = {
  register: (data: any) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  login: (email: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),
  
  getMe: () => apiRequest('/auth/me'),
};

// Food listings API
export const foodListingsApi = {
  getAll: (filters?: { location?: string; urgency?: string; foodType?: string; providerId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.location && filters.location !== 'all') params.append('location', filters.location);
    if (filters?.urgency && filters.urgency !== 'all') params.append('urgency', filters.urgency);
    if (filters?.foodType && filters.foodType !== 'all') params.append('foodType', filters.foodType);
    if (filters?.providerId) params.append('providerId', filters.providerId);
    
    return apiRequest(`/food-listings${params.toString() ? `?${params}` : ''}`);
  },
  
  getById: (id: string) => apiRequest(`/food-listings/${id}`),
  
  create: (data: any) =>
    apiRequest('/food-listings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) =>
    apiRequest(`/food-listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    apiRequest(`/food-listings/${id}`, {
      method: 'DELETE',
    }),
};

// Messages API
export const messagesApi = {
  getByListing: (listingId: string, otherUserId: string) => {
    const params = new URLSearchParams({ otherUserId });
    return apiRequest(`/messages/${listingId}?${params}`);
  },
  
  send: (data: { text: string; receiverId: string; listingId: string }) =>
    apiRequest('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getConversations: () => apiRequest('/conversations'),
};

export { ApiError };