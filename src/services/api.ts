import {
  SchoolInfo,
  Notice,
  StaffMember,
  Facility,
  GalleryItem,
  AcademicData,
  ContactMessage,
  AdminUser
} from '../types.ts';

const TOKEN_KEY = 'uhs_madhulata_admin_token';
const ADMIN_USER_KEY = 'uhs_madhulata_admin_user';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string, user: AdminUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

export function getStoredAdminUser(): AdminUser | null {
  const data = localStorage.getItem(ADMIN_USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  const token = getStoredToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ success: boolean; token: string; admin: AdminUser }> {
    const res = await request<{ success: boolean; token: string; admin: AdminUser }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    setStoredToken(res.token, res.admin);
    return res;
  },

  async verifyAuth(): Promise<{ authenticated: boolean; admin?: AdminUser }> {
    const token = getStoredToken();
    if (!token) return { authenticated: false };
    try {
      const res = await request<{ authenticated: boolean; admin?: AdminUser }>('/api/admin/verify');
      return res;
    } catch {
      clearStoredToken();
      return { authenticated: false };
    }
  },

  async logout(): Promise<void> {
    try {
      await request('/api/admin/logout', { method: 'POST' });
    } finally {
      clearStoredToken();
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return request('/api/admin/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  },

  async resetDemo(): Promise<{ success: boolean; message: string }> {
    return request('/api/admin/reset-demo', {
      method: 'POST'
    });
  },

  // School Info
  async getSchoolInfo(): Promise<SchoolInfo> {
    return request<SchoolInfo>('/api/school-info');
  },

  async updateSchoolInfo(info: Partial<SchoolInfo>): Promise<{ success: boolean; schoolInfo: SchoolInfo }> {
    return request<{ success: boolean; schoolInfo: SchoolInfo }>('/api/school-info', {
      method: 'PUT',
      body: JSON.stringify(info)
    });
  },

  // Notices
  async getNotices(params?: { category?: string; search?: string; limit?: number; includeUnpublished?: boolean }): Promise<Notice[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.includeUnpublished) query.set('includeUnpublished', 'true');

    const qs = query.toString();
    return request<Notice[]>(`/api/notices${qs ? `?${qs}` : ''}`);
  },

  async getNotice(id: string): Promise<Notice> {
    return request<Notice>(`/api/notices/${id}`);
  },

  async createNotice(notice: Partial<Notice>): Promise<{ success: boolean; notice: Notice }> {
    return request<{ success: boolean; notice: Notice }>('/api/notices', {
      method: 'POST',
      body: JSON.stringify(notice)
    });
  },

  async updateNotice(id: string, notice: Partial<Notice>): Promise<{ success: boolean; notice: Notice }> {
    return request<{ success: boolean; notice: Notice }>(`/api/notices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(notice)
    });
  },

  async deleteNotice(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/api/notices/${id}`, {
      method: 'DELETE'
    });
  },

  async togglePublishNotice(id: string): Promise<{ success: boolean; isPublished: boolean; notice: Notice }> {
    return request<{ success: boolean; isPublished: boolean; notice: Notice }>(`/api/notices/${id}/toggle-publish`, {
      method: 'POST'
    });
  },

  async toggleImportantNotice(id: string): Promise<{ success: boolean; isImportant: boolean; notice: Notice }> {
    return request<{ success: boolean; isImportant: boolean; notice: Notice }>(`/api/notices/${id}/toggle-important`, {
      method: 'POST'
    });
  },

  // Staff
  async getStaff(): Promise<StaffMember[]> {
    return request<StaffMember[]>('/api/staff');
  },

  async createStaff(member: Partial<StaffMember>): Promise<{ success: boolean; staff: StaffMember }> {
    return request<{ success: boolean; staff: StaffMember }>('/api/staff', {
      method: 'POST',
      body: JSON.stringify(member)
    });
  },

  async updateStaff(id: string, member: Partial<StaffMember>): Promise<{ success: boolean; staff: StaffMember }> {
    return request<{ success: boolean; staff: StaffMember }>(`/api/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(member)
    });
  },

  async deleteStaff(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/api/staff/${id}`, {
      method: 'DELETE'
    });
  },

  // Facilities
  async getFacilities(): Promise<Facility[]> {
    return request<Facility[]>('/api/facilities');
  },

  async createFacility(facility: Partial<Facility>): Promise<{ success: boolean; facility: Facility }> {
    return request<{ success: boolean; facility: Facility }>('/api/facilities', {
      method: 'POST',
      body: JSON.stringify(facility)
    });
  },

  async updateFacility(id: string, facility: Partial<Facility>): Promise<{ success: boolean; facility: Facility }> {
    return request<{ success: boolean; facility: Facility }>(`/api/facilities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(facility)
    });
  },

  async deleteFacility(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/api/facilities/${id}`, {
      method: 'DELETE'
    });
  },

  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    return request<GalleryItem[]>('/api/gallery');
  },

  async createGalleryItem(item: Partial<GalleryItem>): Promise<{ success: boolean; item: GalleryItem }> {
    return request<{ success: boolean; item: GalleryItem }>('/api/gallery', {
      method: 'POST',
      body: JSON.stringify(item)
    });
  },

  async deleteGalleryItem(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/api/gallery/${id}`, {
      method: 'DELETE'
    });
  },

  // Academics
  async getAcademics(): Promise<AcademicData> {
    return request<AcademicData>('/api/academics');
  },

  async updateAcademics(data: Partial<AcademicData>): Promise<{ success: boolean; academics: AcademicData }> {
    return request<{ success: boolean; academics: AcademicData }>('/api/academics', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // Contact Messages
  async sendContact(msg: { name: string; email?: string; phone?: string; subject?: string; message: string }): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(msg)
    });
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    return request<ContactMessage[]>('/api/contact-messages');
  },

  async deleteContactMessage(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/api/contact-messages/${id}`, {
      method: 'DELETE'
    });
  }
};
