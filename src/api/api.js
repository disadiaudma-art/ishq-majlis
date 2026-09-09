import axios from 'axios'

// Use the local Mongo-backed API during development; deployed builds use Render.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || (
  import.meta.env.DEV
    ? 'http://localhost:5001/api'
    : 'https://ishq-majlis-server.onrender.com/api'
)

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const submitRegistration = (data) => api.post('/registrations', data)
export const fetchRegistrations = (params) => api.get('/registrations', { params })
export const fetchStats = () => api.get('/registrations/stats')
export const deleteRegistration = (id) => api.delete(`/registrations/${id}`)

export default api