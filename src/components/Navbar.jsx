import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  const isAdmin = location.pathname.includes('/admin')

  return (
    <nav className="top-nav">
      <Link to="/" className="nav-brand">
        <i className="fa-solid fa-star-and-crescent" />
        <span>ഇശ്ഖ് മജ്‌ലിസ് 2026</span>
      </Link>
      {isAdmin && (
        <div className="nav-actions">
          <Link to="/" className="nav-btn">
            <i className="fa-solid fa-arrow-left" />
            <span>Form</span>
          </Link>
        </div>
      )}
    </nav>
  )
}
