import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export const interviewAPI = {
  generate:  (role, count = 5) => api.post('/interview/generate', { role, count }),
  analyze:   (payload)         => api.post('/interview/analyze', payload),
  getHistory:()                => api.get('/interview/history'),
  getOne:    (id)              => api.get(`/interview/${id}`),
  complete:  (id, overallScore)=> api.patch(`/interview/${id}/complete`, { overallScore }),
}

export const authAPI = {
  signup: (name, email, password) => api.post('/auth/signup', { name, email, password }),
  login:  (email, password)       => api.post('/auth/login',  { email, password }),
  me:     ()                      => api.get('/auth/me'),
}

export default api
