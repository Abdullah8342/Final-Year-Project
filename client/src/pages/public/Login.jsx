import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2, Sparkles, CheckCircle2 } from 'lucide-react'
import { API_ENDPOINTS, buildApiUrl } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const initialFormState = {
  email: '',
  password: '',
}

export const Login = () => {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [formData, setFormData] = useState(initialFormState)
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  const extractErrorMessage = async (response) => {
    try {
      const data = await response.json()

      if (typeof data === 'string') {
        return data
      }

      const message =
        data?.detail ||
        data?.message ||
        data?.error ||
        data?.non_field_errors?.[0] ||
        Object.values(data || {})
          .flat()
          .filter(Boolean)
          .join(' ')

      return message || 'Login failed. Please try again.'
    } catch {
      return 'Login failed. Please try again.'
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.login), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(await extractErrorMessage(response))
      }

      const data = await response.json()
      const { access, refresh } = data

      // Store tokens in localStorage
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)

      addToast('Login successful!', 'success')
      setFormData(initialFormState)

      // Redirect to profile after a short delay
      setTimeout(() => {
        navigate('/profile')
      }, 1200)
    } catch (submitError) {
      addToast(submitError.message || 'Something went wrong. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.16),transparent_38%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_48%,#fdf2f8_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-4xl bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.14)] ring-1 ring-white/70 backdrop-blur xl:grid-cols-[1.1fr_0.9fr]">
        <section className="relative flex flex-col justify-between overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-10 lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.28),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(96,165,250,0.24),transparent_30%)]" />
          <div className="relative z-10 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.32em] text-amber-300">
            <Sparkles className="h-4 w-4" />
            FixNow
          </div>

          <div className="relative z-10 max-w-xl space-y-6">
            <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              Access your account and manage bookings.
            </p>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Welcome back to your service hub.
              </h1>
              <p className="max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
                Sign in to view your profile, manage service requests, and track your bookings effortlessly.
              </p>
            </div>
          </div>

          <div className="relative z-10 grid gap-4 border-t border-white/10 pt-6 text-sm text-slate-300 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-300" />
              Quick login with your email and password.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-300" />
              Secure token-based authentication.
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-lg">
            <div className="mb-8 space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-600">
                Welcome back
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                Sign in to your account
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                Enter your credentials to access your FixNow profile.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Email address</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                  placeholder="you@example.com"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                  placeholder="••••••••"
                />
              </label>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    className="rounded border-slate-200"
                    defaultChecked={false}
                  />
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-slate-950 underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading ? <ArrowRight className="h-4 w-4" /> : null}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-slate-950 underline-offset-4 hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
