import { useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import FormHeader from './components/FormHeader'
import RegistrationForm from './components/RegistrationForm'
import PassModal from './components/PassModal'
import AdminDashboard from './components/AdminDashboard'

function RegistrationPage() {
  const [successData, setSuccessData] = useState(null)

  function handleSuccess(data) {
    setSuccessData(data)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleRegisterAnother() {
    setSuccessData(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-container">
      <Navbar />
      <FormHeader />
      <RegistrationForm onSuccess={handleSuccess} />

      {successData && (
        <PassModal
          data={successData}
          onClose={() => setSuccessData(null)}
          onRegisterAnother={handleRegisterAnother}
        />
      )}
    </div>
  )
}

function AdminPage() {
  return (
    <div className="app-container admin-app-container">
      <Navbar />
      <AdminDashboard />
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/go-to/admin/access" element={<AdminPage />} />
      </Routes>
    </HashRouter>
  )
}
