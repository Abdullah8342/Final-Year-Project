// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { API_ENDPOINTS, buildApiUrl, getAuthHeaders, resolveMediaUrl } from '../../services/api'
// import { useToast } from '../../context/ToastContext'

// const Profile = () => {
//   const nav = useNavigate()
//   const { addToast } = useToast()
//   const [profile, setProfile] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [saving, setSaving] = useState(false)
//   const [filePreview, setFilePreview] = useState(null)
//   const [file, setFile] = useState(null)
//   const [phone, setPhone] = useState('')

//   const access = () => localStorage.getItem('access_token')
//   const refresh = () => localStorage.getItem('refresh_token')

//   useEffect(() => {
//     const token = access()
//     if (!token) return nav('/login')
//     fetchProfile()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   const fetchProfile = async () => {
//     setLoading(true)
//     try {
//       const res = await fetch(buildApiUrl(API_ENDPOINTS.profile.root), {
//         headers: getAuthHeaders(access()),
//       })
//       if (!res.ok) throw new Error('Failed to load profile')
//       const data = await res.json()
//       setProfile(data)
//       setPhone(data.phone || '')
//       setFilePreview(data.profile_picture || null)
//     } catch (e) {
//       addToast(e.message, 'error')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleFile = (e) => {
//     const f = e.target.files?.[0]
//     if (!f) return
//     setFile(f)
//     setFilePreview(URL.createObjectURL(f))
//   }

//   const handleSave = async (e) => {
//     e.preventDefault()
//     setSaving(true)

//     try {
//       const form = new FormData()
//       form.append('phone', phone)
//       if (file) form.append('profile_picture', file)

//       const res = await fetch(buildApiUrl(API_ENDPOINTS.profile.root), {
//         method: 'PATCH',
//         headers: getAuthHeaders(access()),
//         body: form,
//       })

//       if (!res.ok) {
//         const body = await res.json().catch(() => null)
//         throw new Error(body?.detail || body?.message || 'Failed to update profile')
//       }

//       addToast('Profile updated', 'success')
//       await fetchProfile()
//     } catch (e) {
//       addToast(e.message, 'error')
//     } finally {
//       setSaving(false)
//     }
//   }

//   const handleLogout = async () => {
//     try {
//       const refreshToken = refresh()
//       if (refreshToken) {
//         await fetch(buildApiUrl(API_ENDPOINTS.auth.logout), {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ refresh: refreshToken }),
//         })
//       }
//     } finally {
//       localStorage.removeItem('access_token')
//       localStorage.removeItem('refresh_token')
//       addToast('Logged out successfully', 'success')
//       nav('/login')
//     }
//   }

//   if (loading) return <div className="p-8">Loading profile…</div>

//   return (
//     <main className="p-8">
//       <div className="mx-auto max-w-2xl">
//         <h1 className="mb-4 text-2xl font-semibold">Your Profile</h1>

//         {!profile ? (
//           <div>No profile data</div>
//         ) : (
//           <form onSubmit={handleSave} className="space-y-4">
//             <div className="flex items-center gap-4">
//               <div className="h-28 w-28 overflow-hidden rounded-full bg-slate-100">
//                 {filePreview ? (
//                   <img src={resolveMediaUrl(filePreview)} alt="avatar" className="h-full w-full object-cover" />
//                 ) : (
//                   <div className="flex h-full w-full items-center justify-center text-slate-400">No image</div>
//                 )}
//               </div>

//               <label className="flex cursor-pointer items-center gap-2 rounded bg-slate-100 px-3 py-2 text-sm">
//                 Change image
//                 <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
//               </label>
//             </div>

//             <div>
//               <label className="block text-sm text-slate-700">Full name</label>
//               <input value={profile.full_name || ''} readOnly className="mt-1 w-full rounded border px-3 py-2 bg-slate-50" />
//             </div>

//             <div>
//               <label className="block text-sm text-slate-700">Email</label>
//               <input value={profile.email || ''} readOnly className="mt-1 w-full rounded border px-3 py-2 bg-slate-50" />
//             </div>

//             <div>
//               <label className="block text-sm text-slate-700">Account type</label>
//               <input value={profile.roll || ''} readOnly className="mt-1 w-full rounded border px-3 py-2 bg-slate-50" />
//             </div>

//             <div>
//               <label className="block text-sm text-slate-700">Phone</label>
//               <input value={phone} onChange={(e) => setPhone(e.target.value)} required className="mt-1 w-full rounded border px-3 py-2" />
//             </div>

//             <div className="flex gap-2">
//               <button type="submit" disabled={saving} className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-60">{saving ? 'Saving…' : 'Save changes'}</button>
//               <button type="button" onClick={fetchProfile} className="rounded border px-4 py-2">Reload</button>
//               <button type="button" onClick={handleLogout} className="rounded bg-rose-600 px-4 py-2 text-white hover:bg-rose-500">
//                 Logout
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </main>
//   )
// }

// export default Profile








import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2, Sparkles, CheckCircle2, LogOut, RefreshCw, Save, Upload } from 'lucide-react'
import { API_ENDPOINTS, buildApiUrl, getAuthHeaders, resolveMediaUrl } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const Profile = () => {
  const nav = useNavigate()
  const { addToast } = useToast()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [filePreview, setFilePreview] = useState(null)
  const [file, setFile] = useState(null)
  const [phone, setPhone] = useState('')

  const access = () => localStorage.getItem('access_token')
  const refresh = () => localStorage.getItem('refresh_token')

  useEffect(() => {
    const token = access()
    if (!token) return nav('/login')
    fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const res = await fetch(buildApiUrl(API_ENDPOINTS.profile.root), {
        headers: getAuthHeaders(access()),
      })
      if (!res.ok) throw new Error('Failed to load profile')
      const data = await res.json()
      setProfile(data)
      setPhone(data.phone || '')
      setFilePreview(data.profile_picture || null)
    } catch (e) {
      addToast(e.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setFilePreview(URL.createObjectURL(f))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const form = new FormData()
      form.append('phone', phone)
      if (file) form.append('profile_picture', file)

      const res = await fetch(buildApiUrl(API_ENDPOINTS.profile.root), {
        method: 'PATCH',
        headers: getAuthHeaders(access()),
        body: form,
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.detail || body?.message || 'Failed to update profile')
      }

      addToast('Profile updated', 'success')
      await fetchProfile()
    } catch (e) {
      addToast(e.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      const refreshToken = refresh()
      if (refreshToken) {
        await fetch(buildApiUrl(API_ENDPOINTS.auth.logout), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: refreshToken }),
        })
      }
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      addToast('Logged out successfully', 'success')
      nav('/login')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.16),transparent_38%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_48%,#fdf2f8_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.16),transparent_38%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_48%,#fdf2f8_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-4xl bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.14)] ring-1 ring-white/70 backdrop-blur xl:grid-cols-[1.1fr_0.9fr]">
        {/* Left Section - Hero */}
        <section className="relative flex flex-col justify-between overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-10 lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.28),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(96,165,250,0.24),transparent_30%)]" />
          <div className="relative z-10 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.32em] text-amber-300">
            <Sparkles className="h-4 w-4" />
            FixNow
          </div>

          <div className="relative z-10 max-w-xl space-y-6">
            <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              {profile?.roll || 'Customer'} Dashboard
            </p>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!
              </h1>
              <p className="max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
                Manage your profile information, update your contact details, and keep your account secure.
              </p>
            </div>
          </div>

          <div className="relative z-10 grid gap-4 border-t border-white/10 pt-6 text-sm text-slate-300 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-300" />
              Update your personal information anytime.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-300" />
              Your data is securely stored.
            </div>
          </div>
        </section>

        {/* Right Section - Profile Form */}
        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-lg">
            <div className="mb-8 space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-600">
                Your Profile
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                Account Settings
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                View and manage your profile information.
              </p>
            </div>

            {!profile ? (
              <div className="text-center text-slate-600">No profile data available</div>
            ) : (
              <form className="space-y-5" onSubmit={handleSave}>
                {/* Profile Picture */}
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 overflow-hidden rounded-full bg-gradient-to-br from-amber-100 to-slate-100 ring-4 ring-white shadow-md">
                    {filePreview ? (
                      <img 
                        src={resolveMediaUrl(filePreview)} 
                        alt="avatar" 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
                        <Sparkles className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    <Upload className="h-4 w-4" />
                    Change image
                    <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                  </label>
                </div>

                {/* Full Name - Read Only */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Full name</label>
                  <input 
                    value={profile.full_name || ''} 
                    readOnly 
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
                  />
                </div>

                {/* Email - Read Only */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Email address</label>
                  <input 
                    value={profile.email || ''} 
                    readOnly 
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
                  />
                </div>

                {/* Account Type - Read Only */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Account type</label>
                  <input 
                    value={profile.roll || ''} 
                    readOnly 
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
                  />
                </div>

                {/* Phone - Editable */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Phone number
                  </label>
                  <input 
                    type="tel"
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    placeholder="Your phone number"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? 'Saving...' : 'Save changes'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={fetchProfile}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reload
                  </button>
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 px-5 py-3.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 hover:text-rose-800"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Profile