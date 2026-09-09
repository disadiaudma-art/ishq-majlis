import axios from 'axios'

// Set full Render URL as fallback to avoid relative path 404s on Vercel
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ishq-majlis-server.onrender.com/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const submitRegistration = (data) => api.post('/registrations', data)
export const fetchRegistrations = (params) => api.get('/registrations', { params })
export const fetchStats = () => api.get('/registrations/stats')
export const deleteRegistration = (id) => api.delete(`/registrations/${id}`)

export default api