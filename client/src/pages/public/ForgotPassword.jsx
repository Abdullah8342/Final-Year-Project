import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2, Sparkles, CheckCircle2, Mail, Lock, Zap } from 'lucide-react'
import { API_ENDPOINTS, buildApiUrl } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const STEPS = {
  REQUEST_OTP: 'request_otp',
  VERIFY_OTP: 'verify_otp',
  RESET_PASSWORD: 'reset_password',
}

export const ForgotPassword = () => {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [step, setStep] = useState(STEPS.REQUEST_OTP)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

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
      return message || 'An error occurred. Please try again.'
    } catch {
      return 'An error occurred. Please try again.'
    }
  }

  const handleRequestOTP = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.forgotPassword), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error(await extractErrorMessage(response))
      }

      addToast('OTP sent to your email. Check your inbox.', 'success')
      setStep(STEPS.VERIFY_OTP)
    } catch (submitError) {
      addToast(submitError.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.verifyOtp), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      })

      if (!response.ok) {
        throw new Error(await extractErrorMessage(response))
      }

      const data = await response.json()
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)

      addToast('OTP verified. Now reset your password.', 'success')
      setStep(STEPS.RESET_PASSWORD)
    } catch (submitError) {
      addToast(submitError.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (event) => {
    event.preventDefault()

    if (password !== confirmPassword) {
      addToast('Passwords do not match.', 'error')
      return
    }

    setLoading(true)

    try {
      const accessToken = localStorage.getItem('access_token')
      const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.resetPassword), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ password, confirm_password: confirmPassword }),
      })

      if (!response.ok) {
        throw new Error(await extractErrorMessage(response))
      }

      addToast('Password reset successfully. Redirecting to login...', 'success')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (submitError) {
      addToast(submitError.message, 'error')
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
              Recover your account securely.
            </p>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Reset your password with ease.
              </h1>
              <p className="max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
                We'll send you a one-time code via email. Verify it and set a new password to regain access.
              </p>
            </div>
          </div>

          <div className="relative z-10 grid gap-4 border-t border-white/10 pt-6 text-sm text-slate-300 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-300" />
              Multi-step verification for security.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-300" />
              OTP sent directly to your email.
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-lg">
            <div className="mb-8 space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-600">
                Password recovery
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                {step === STEPS.REQUEST_OTP && 'Request a reset code'}
                {step === STEPS.VERIFY_OTP && 'Verify your code'}
                {step === STEPS.RESET_PASSWORD && 'Set new password'}
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                {step === STEPS.REQUEST_OTP && 'Enter your email to receive a one-time code.'}
                {step === STEPS.VERIFY_OTP && 'Check your email and enter the code we sent.'}
                {step === STEPS.RESET_PASSWORD && 'Create a strong new password for your account.'}
              </p>
            </div>

            {/* Step 1: Request OTP */}
            {step === STEPS.REQUEST_OTP && (
              <form className="space-y-5" onSubmit={handleRequestOTP}>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email address
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 my-2 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    placeholder="you@example.com"
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                  {loading ? 'Sending...' : 'Send code'}
                </button>
              </form>
            )}

            {/* Step 2: Verify OTP */}
            {step === STEPS.VERIFY_OTP && (
              <form className="space-y-5" onSubmit={handleVerifyOTP}>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>One-time code</span>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    placeholder="e.g., 123456"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  {loading ? 'Verifying...' : 'Verify code'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(STEPS.REQUEST_OTP)}
                  className="w-full text-sm text-slate-600 hover:underline"
                >
                  Didn't receive code? Request again
                </button>
              </form>
            )}

            {/* Step 3: Reset Password */}
            {step === STEPS.RESET_PASSWORD && (
              <form className="space-y-5" onSubmit={handleResetPassword}>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    New password
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    placeholder="••••••••"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Confirm password
                  </span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    placeholder="••••••••"
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  {loading ? 'Resetting...' : 'Reset password'}
                </button>
              </form>
            )}

            <p className="mt-6 text-center text-sm text-slate-600">
              Remember your password?{' '}
              <Link to="/login" className="font-semibold text-slate-950 underline-offset-4 hover:underline">
                Back to login
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
