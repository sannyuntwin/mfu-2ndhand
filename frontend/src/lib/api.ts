const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export const api = {
  get: (url: string) => {
    const token = localStorage.getItem('token')
    return fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }).then(res => res.json())
  },

  post: (url: string, data: any) => {
    const token = localStorage.getItem('token')
    return fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    }).then(res => res.json())
  },

  put: (url: string, data: any) => {
    const token = localStorage.getItem('token')
    return fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    }).then(res => res.json())
  },

  delete: (url: string) => {
    const token = localStorage.getItem('token')
    return fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }).then(res => res.json())
  },

  postForm: (url: string, formData: FormData) => {
    const token = localStorage.getItem('token')
    return fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    }).then(res => res.json())
  },
}