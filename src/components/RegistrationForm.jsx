import { useState } from 'react'
import { submitRegistration } from '../api/api'

export default function RegistrationForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    place: '',
    age: '',
    gender: '',
    attendeesCount: '',
    whatsappNumber: '',
    whatsappCommunityConcern: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  function handleChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  function handleClear() {
    if (window.confirm('Clear form? All entered answers will be removed.')) {
      setFormData({ fullName: '', place: '', age: '', gender: '', attendeesCount: '', whatsappNumber: '', whatsappCommunityConcern: '' })
      setErrors({})
      setServerError('')
    }
  }

  function validate() {
    const errs = {}
    if (!formData.fullName.trim()) errs.fullName = 'This is a required question'
    if (!formData.place.trim()) errs.place = 'This is a required question'
    if (!formData.age || isNaN(formData.age) || Number(formData.age) < 1 || Number(formData.age) > 120) errs.age = 'Enter a valid age'
    if (!formData.gender) errs.gender = 'This is a required question'
    if (!formData.attendeesCount || isNaN(formData.attendeesCount) || Number(formData.attendeesCount) < 1) errs.attendeesCount = 'Minimum 1 attendee required'
    if (!formData.whatsappNumber.trim()) errs.whatsappNumber = 'WhatsApp number is required'
    else if (!/^\+?[0-9\s()-]{10,20}$/.test(formData.whatsappNumber.trim())) errs.whatsappNumber = 'Enter a valid WhatsApp number'
    if (!formData.whatsappCommunityConcern) errs.whatsappCommunityConcern = 'Please select Yes or No'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        place: formData.place.trim(),
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        attendeesCount: parseInt(formData.attendeesCount, 10),
        whatsappNumber: formData.whatsappNumber.trim(),
        whatsappCommunityConcern: formData.whatsappCommunityConcern.trim(),
      }
      const res = await submitRegistration(payload)
      if (res.data?.success && res.data?.data) {
        onSuccess(res.data.data)
      } else {
        setServerError('Submission failed. Please try again.')
      }
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Server error. Please try again.'
      setServerError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* ── 1. Full Name ── */}
      <div className={`form-q-card ${errors.fullName ? 'has-error' : ''}`}>
        <label className="q-label">
          Full Name / പേര്
          <span className="req-star"> *</span>
        </label>
        <input
          type="text"
          className="q-input"
          placeholder="Your answer"
          value={formData.fullName}
          onChange={e => handleChange('fullName', e.target.value)}
        />
        {errors.fullName && (
          <div className="q-error">
            <i className="fa-solid fa-circle-exclamation" />
            <span>{errors.fullName}</span>
          </div>
        )}
      </div>

      {/* ── 2. Place ── */}
      <div className={`form-q-card ${errors.place ? 'has-error' : ''}`}>
        <label className="q-label">
          Place / സ്ഥലം
          <span className="req-star"> *</span>
        </label>
        <input
          type="text"
          className="q-input"
          placeholder="Your answer"
          value={formData.place}
          onChange={e => handleChange('place', e.target.value)}
        />
        {errors.place && (
          <div className="q-error">
            <i className="fa-solid fa-circle-exclamation" />
            <span>{errors.place}</span>
          </div>
        )}
      </div>

      {/* ── 3. Age ── */}
      <div className={`form-q-card ${errors.age ? 'has-error' : ''}`}>
        <label className="q-label">
          Age / വയസ്സ്
          <span className="req-star"> *</span>
        </label>
        <input
          type="number"
          min="1"
          max="120"
          className="q-input"
          placeholder="Your answer"
          value={formData.age}
          onChange={e => handleChange('age', e.target.value)}
        />
        {errors.age && (
          <div className="q-error">
            <i className="fa-solid fa-circle-exclamation" />
            <span>{errors.age}</span>
          </div>
        )}
      </div>

      {/* ── 4. Gender ── */}
      <div className={`form-q-card ${errors.gender ? 'has-error' : ''}`}>
        <label className="q-label">
          Gender / ലിംഗഭേദം
          <span className="req-star"> *</span>
        </label>
        <div className="q-radio-group">
          {['Male', 'Female'].map(opt => (
            <label
              key={opt}
              className={`q-radio-label ${formData.gender === opt ? 'is-selected' : ''}`}
            >
              <input
                type="radio"
                name="gender"
                value={opt}
                checked={formData.gender === opt}
                onChange={() => handleChange('gender', opt)}
              />
              <span className="q-radio-text">
                {opt === 'Male' ? 'Male / പുരുഷൻ' : 'Female / സ്ത്രീ'}
              </span>
            </label>
          ))}
        </div>
        {errors.gender && (
          <div className="q-error">
            <i className="fa-solid fa-circle-exclamation" />
            <span>{errors.gender}</span>
          </div>
        )}
      </div>

      {/* ── 5. Number of Attendees ── */}
      <div className={`form-q-card ${errors.attendeesCount ? 'has-error' : ''}`}>
        <label className="q-label">
          Number of Attendees / പങ്കെടുക്കുന്നവരുടെ എണ്ണം
          <span className="req-star"> *</span>
        </label>
        <input
          type="number"
          min="1"
          max="100"
          className="q-input"
          placeholder="Your answer"
          value={formData.attendeesCount}
          onChange={e => handleChange('attendeesCount', e.target.value)}
        />
        {errors.attendeesCount && (
          <div className="q-error">
            <i className="fa-solid fa-circle-exclamation" />
            <span>{errors.attendeesCount}</span>
          </div>
        )}
      </div>

      {/* ── 6. WhatsApp Number ── */}
      <div className={`form-q-card ${errors.whatsappNumber ? 'has-error' : ''}`}>
        <label className="q-label">
          WhatsApp Number / വാട്സ്ആപ്പ് നമ്പർ
          <span className="req-star"> *</span>
        </label>
        <input
          type="tel"
          name="whatsappNumber"
          className="q-input"
          placeholder="Your WhatsApp number"
          value={formData.whatsappNumber}
          onChange={e => handleChange('whatsappNumber', e.target.value)}
        />
        {errors.whatsappNumber && (
          <div className="q-error">
            <i className="fa-solid fa-circle-exclamation" />
            <span>{errors.whatsappNumber}</span>
          </div>
        )}
      </div>

      {/* ── 7. WhatsApp Community Concern ── */}
      <div className={`form-q-card ${errors.whatsappCommunityConcern ? 'has-error' : ''}`}>
        <label className="q-label">
          WhatsApp community issue? / വാട്സ്ആപ്പ് കമ്മ്യൂണിറ്റിയിൽ ചേർക്കുന്നതിൽ പ്രശ്നമുണ്ടോ?
          <span className="req-star"> *</span>
        </label>
        <div className="q-radio-group">
          {['Yes', 'No'].map(opt => (
            <label
              key={opt}
              className={`q-radio-label ${formData.whatsappCommunityConcern === opt ? 'is-selected' : ''}`}
            >
              <input
                type="radio"
                name="whatsappCommunityConcern"
                value={opt}
                checked={formData.whatsappCommunityConcern === opt}
                onChange={() => handleChange('whatsappCommunityConcern', opt)}
              />
              <span className="q-radio-text">{opt === 'Yes' ? 'Yes / അതെ' : 'No / ഇല്ല'}</span>
            </label>
          ))}
        </div>
        {errors.whatsappCommunityConcern && (
          <div className="q-error">
            <i className="fa-solid fa-circle-exclamation" />
            <span>{errors.whatsappCommunityConcern}</span>
          </div>
        )}
      </div>

      {serverError && (
        <div className="server-error-card">
          <i className="fa-solid fa-triangle-exclamation" />
          <span>{serverError}</span>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="form-action-bar">
        <button type="submit" className="btn-submit" disabled={submitting}>
          {submitting ? (
            <><i className="fa-solid fa-spinner fa-spin" /><span>Submitting…</span></>
          ) : (
            <><i className="fa-solid fa-paper-plane" /><span>Submit</span></>
          )}
        </button>
        <button type="button" className="btn-clear" onClick={handleClear} disabled={submitting}>
          Clear form
        </button>
      </div>

      <p className="form-disclaimer">
        This content is created for <strong>ഇശ്ഖ് മജ്‌ലിസ് 2026</strong> — M.I.C. Udyama Padinjaru Campus.<br />
        For inquiries call: <a href="tel:7593839179">7593839179</a>
      </p>
    </form>
  )
}
