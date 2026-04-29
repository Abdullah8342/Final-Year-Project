import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINTS, buildApiUrl, getAuthHeaders, resolveMediaUrl } from '../../services/api'

const Profile = () => {
  const nav = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filePreview, setFilePreview] = useState(null)
  const [file, setFile] = useState(null)
  const [phone, setPhone] = useState('')

  const access = () => localStorage.getItem('access_token')

  useEffect(() => {
    const token = access()
    if (!token) return nav('/login')
    fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    setError('')
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
      setError(e.message)
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
    setError('')
    setSuccess('')

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

      setSuccess('Profile updated')
      await fetchProfile()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8">Loading profile…</div>

  return (
    <main className="p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 text-2xl font-semibold">Your Profile</h1>
        {error && <div className="mb-4 rounded border border-rose-200 bg-rose-50 px-4 py-2 text-rose-700">{error}</div>}
        {success && <div className="mb-4 rounded border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-700">{success}</div>}

        {!profile ? (
          <div>No profile data</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-28 w-28 overflow-hidden rounded-full bg-slate-100">
                {filePreview ? (
                  <img src={resolveMediaUrl(filePreview)} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">No image</div>
                )}
              </div>

              <label className="flex cursor-pointer items-center gap-2 rounded bg-slate-100 px-3 py-2 text-sm">
                Change image
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </label>
            </div>

            <div>
              <label className="block text-sm text-slate-700">Full name</label>
              <input value={profile.full_name || ''} readOnly className="mt-1 w-full rounded border px-3 py-2 bg-slate-50" />
            </div>

            <div>
              <label className="block text-sm text-slate-700">Email</label>
              <input value={profile.email || ''} readOnly className="mt-1 w-full rounded border px-3 py-2 bg-slate-50" />
            </div>

            <div>
              <label className="block text-sm text-slate-700">Account type</label>
              <input value={profile.roll || ''} readOnly className="mt-1 w-full rounded border px-3 py-2 bg-slate-50" />
            </div>

            <div>
              <label className="block text-sm text-slate-700">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} required className="mt-1 w-full rounded border px-3 py-2" />
            </div>

            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-60">{saving ? 'Saving…' : 'Save changes'}</button>
              <button type="button" onClick={fetchProfile} className="rounded border px-4 py-2">Reload</button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}

export default Profile
