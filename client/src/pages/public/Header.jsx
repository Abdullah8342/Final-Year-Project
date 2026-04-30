// import { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
// import { CalendarDays, Home, Mail, Users, Wrench } from 'lucide-react'
// import { API_ENDPOINTS, buildApiUrl, getAuthHeaders, resolveMediaUrl } from '../../services/api'

// const navLinks = [
//   { to: '/', label: 'Home', icon: Home },
//   { to: '/services', label: 'Services', icon: Wrench },
//   { to: '/aboutus', label: 'About Us', icon: Users },
//   { to: '/contactus', label: 'Contact Us', icon: Mail },
// ]

// export const Header = () => {
//   const token = localStorage.getItem('access_token')
//   const [profilePicture, setProfilePicture] = useState('')

//   useEffect(() => {
//     if (!token) return

//     let active = true

//     const loadProfile = async () => {
//       try {
//         const response = await fetch(buildApiUrl(API_ENDPOINTS.profile.root), {
//           headers: getAuthHeaders(token),
//         })

//         if (!response.ok) return

//         const data = await response.json()
//         if (active) setProfilePicture(resolveMediaUrl(data.profile_picture))
//       } catch {
//         if (active) setProfilePicture('')
//       }
//     }

//     loadProfile()

//     return () => {
//       active = false
//     }
//   }, [token])

//   return (
//     <header className="border-b border-slate-200/70 bg-white/90 backdrop-blur">
//       <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6 lg:px-8">
//         <Link to="/" className="text-xl font-bold tracking-tight text-slate-950">
//           FixNow
//         </Link>

//         <nav className="mx-auto hidden items-center gap-2 text-sm font-medium text-slate-600 md:flex">
//           {navLinks.map((link) => (
//             <Link
//               key={link.to}
//               to={link.to}
//               className="inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-950"
//             >
//               <link.icon className="h-4 w-4" />
//               <span>{link.label}</span>
//             </Link>
//           ))}
//         </nav>

//         <div className="ml-auto flex items-center gap-3">
//           {token ? (
//             <>
//               <button
//                 type="button"
//                 className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
//                 aria-label="Bookings"
//                 title="Bookings"
//               >
//                 <CalendarDays className="h-4 w-4" />
//                 <span>Bookings</span>
//               </button>

//               <Link
//                 to="/profile"
//                 className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-700"
//                 aria-label="Profile"
//                 title="Profile"
//               >
//                 {profilePicture ? (
//                   <img src={profilePicture} alt="Profile" className="h-full w-full object-cover" />
//                 ) : (
//                   'Me'
//                 )}
//               </Link>
//             </>

//           ) : (
//             <>
//               <Link
//                 to="/login"
//                 className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/register"
//                 className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
//               >
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </header>
//   )
// }

import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CalendarDays, Home, Mail, Menu, Users, Wrench, X } from 'lucide-react'
import { API_ENDPOINTS, buildApiUrl, getAuthHeaders, resolveMediaUrl } from '../../services/api'

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/services', label: 'Services', icon: Wrench },
  { to: '/aboutus', label: 'About Us', icon: Users },
  { to: '/contactus', label: 'Contact Us', icon: Mail },
]

export const Header = () => {
  const token = localStorage.getItem('access_token')
  const [profilePicture, setProfilePicture] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

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

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location])

  const isActiveLink = (path) => location.pathname === path

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link 
            to="/" 
            className="group flex items-center gap-2 text-xl font-bold tracking-tight transition-all duration-300 hover:scale-105"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transition-all duration-300 group-hover:shadow-lg">
              <Wrench className="h-4 w-4" />
            </div>
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              FixNow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = isActiveLink(link.to)
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    relative inline-flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-200
                    ${isActive 
                      ? 'text-slate-900 bg-slate-100 font-semibold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-3">
            {token ? (
              <>
                <button
                  type="button"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:scale-105 active:scale-95"
                  aria-label="Bookings"
                  title="Bookings"
                >
                  <CalendarDays className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
                  <span className="hidden sm:inline">Bookings</span>
                </button>

                <Link
                  to="/profile"
                  className="group relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 text-sm font-semibold text-slate-700 transition-all duration-200 hover:scale-105 hover:border-slate-300 hover:shadow-md active:scale-95"
                  aria-label="Profile"
                  title="Profile"
                >
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt="Profile" 
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110" 
                    />
                  ) : (
                    <span className="transition-transform duration-200 group-hover:scale-110">
                      Me
                    </span>
                  )}
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 hover:scale-105 active:scale-95"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-slate-800 hover:to-slate-700 hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div
        className={`
          fixed inset-x-0 top-16 z-40 transform bg-white/95 backdrop-blur-md shadow-lg transition-all duration-300 md:hidden
          ${mobileMenuOpen 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-full opacity-0 pointer-events-none'
          }
        `}
      >
        <nav className="flex flex-col p-4 gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = isActiveLink(link.to)
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-slate-900 border-l-4 border-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : ''}`} />
                <span>{link.label}</span>
              </Link>
            )
          })}
          
          {!token && (
            <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-slate-200">
              <Link
                to="/login"
                className="rounded-lg px-4 py-3 text-center text-base font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 text-center text-base font-semibold text-white shadow-md transition-all duration-200 hover:from-slate-800 hover:to-slate-700"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}