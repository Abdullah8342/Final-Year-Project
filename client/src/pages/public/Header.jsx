import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_ENDPOINTS, buildApiUrl, getAuthHeaders, resolveMediaUrl } from '../../services/api'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/aboutus', label: 'About Us' },
  { to: '/contactus', label: 'Contact Us' },
]

export const Header = () => {
  const token = localStorage.getItem('access_token')
  const [profilePicture, setProfilePicture] = useState('')

  useEffect(() => {
    if (!token) return

    let active = true

    const loadProfile = async () => {
      try {
        const response = await fetch(buildApiUrl(API_ENDPOINTS.profile.root), {
          headers: getAuthHeaders(token),
        })

        if (!response.ok) return

        const data = await response.json()
        if (active) setProfilePicture(resolveMediaUrl(data.profile_picture))
      } catch {
        if (active) setProfilePicture('')
      }
    }

    loadProfile()

    return () => {
      active = false
    }
  }, [token])

  return (
    <header className="border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold tracking-tight text-slate-950">
          FixNow
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="transition hover:text-slate-950">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {token ? (
            <Link
              to="/profile"
              className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-700"
              aria-label="Profile"
            >
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                'Me'
              )}
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
