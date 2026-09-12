import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function PassCard({ data, showActions = true, onRegisterAnother }) {
  const [downloading, setDownloading] = useState(false)
  if (!data) return null

  const {
    fullName = 'Attendee',
    place = '',
    age = '',
    gender = 'Male',
    attendeesCount = 1,
    registrationId = 'IM-2026-XXXX',
  } = data

  const qrValue = JSON.stringify({
    event: 'Ishq Majlis 2026',
    regId: registrationId,
    name: fullName,
    place,
    attendees: attendeesCount,
    gender,
    date: '2026-09-14',
    venue: 'M.I.C. Udyama Padinjaru Campus',
  })

  // Download pass — rendered as a light-themed IUML-style image
  function handleDownloadPass() {
    setDownloading(true)
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const W = 820, H = 1060
      canvas.width = W; canvas.height = H

      // ── White background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, W, H)

      // ── Green top banner
      const bannerH = 220
      const bGrad = ctx.createLinearGradient(0, 0, W, bannerH)
      bGrad.addColorStop(0, '#005c37')
      bGrad.addColorStop(1, '#008751')
      ctx.fillStyle = bGrad
      ctx.beginPath()
      ctx.roundRect(0, 0, W, bannerH, [0, 0, 0, 0])
      ctx.fill()

      // Dot pattern on banner
      ctx.fillStyle = 'rgba(255,255,255,0.04)'
      for (let gx = 0; gx < W; gx += 22) {
        for (let gy = 0; gy < bannerH; gy += 22) {
          ctx.beginPath(); ctx.arc(gx, gy, 2, 0, Math.PI*2); ctx.fill()
        }
      }

      // Eyebrow text
      ctx.fillStyle = '#fec300'
      ctx.font = 'bold 13px Outfit, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('✦  OFFICIAL ENTRY & FOOD CONFIRMATION PASS  ✦', W/2, 58)

      // Crescent icon (simplified circle arc)
      ctx.fillStyle = '#fec300'
      ctx.font = '28px "Font Awesome 6 Free"'
      ctx.fillText('☽', W/2, 105)

      // Malayalam title
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 38px "Noto Sans Malayalam", Outfit, sans-serif'
      ctx.fillText('ഇശ്ഖ് മജ്‌ലിസ് – 2026', W/2, 150)

      ctx.fillStyle = 'rgba(255,255,255,0.8)'
      ctx.font = '17px "Noto Sans Malayalam", Outfit, sans-serif'
      ctx.fillText('എം.ഐ.സി. ഉദ്യമ പടിഞ്ഞാറ് ക്യാമ്പസ്  •  2026 സെപ്റ്റംബർ 14', W/2, 182)

      // ── Reg ID pill strip (pale green)
      ctx.fillStyle = '#e6f5ed'
      ctx.fillRect(0, bannerH, W, 58)
      ctx.strokeStyle = '#b2d9c3'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, bannerH+58); ctx.lineTo(W, bannerH+58); ctx.stroke()

      // Green pill badge
      const pW = 340, pH = 38, pX = (W-pW)/2, pY = bannerH + 10
      ctx.fillStyle = '#008751'
      ctx.beginPath(); ctx.roundRect(pX, pY, pW, pH, 999); ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 18px monospace'
      ctx.fillText(`REG ID: ${registrationId}`, W/2, pY + 26)

      // ── Details section (white)
      const detailsY = bannerH + 70
      ctx.fillStyle = '#ffffff'

      const drawField = (label, value, y) => {
        ctx.fillStyle = '#8ea898'
        ctx.font = '700 12px Outfit, sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText(label.toUpperCase(), 60, y)
        ctx.fillStyle = '#111c16'
        ctx.font = 'bold 26px "Noto Sans Malayalam", Outfit, sans-serif'
        ctx.fillText(value, 60, y + 32)
      }

      drawField('Full Name / പേര്', fullName, detailsY)
      drawField('Place / സ്ഥലം', place, detailsY + 80)
      drawField(age ? 'Age & Gender' : 'Gender / ലിംഗഭേദം', `${age ? age + ' Yrs  •  ' : ''}${gender === 'Male' ? 'Male (പുരുഷൻ)' : 'Female (സ്ത്രീ)'}`, detailsY + 160)

      // Attendees — highlighted in green
      ctx.fillStyle = '#8ea898'
      ctx.font = '700 12px Outfit, sans-serif'
      ctx.fillText('ATTENDEES / പങ്കെടുക്കുന്നവർ', 60, detailsY + 250)
      ctx.fillStyle = '#005c37'
      ctx.font = 'bold 32px Outfit, sans-serif'
      ctx.fillText(`${attendeesCount}  Person${attendeesCount > 1 ? 's' : ''}  /  ${attendeesCount} പേർ`, 60, detailsY + 290)

      // Divider
      ctx.strokeStyle = '#dce8e2'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(50, detailsY + 320)
      ctx.lineTo(W - 50, detailsY + 320)
      ctx.stroke()

      // ── Green notice footer
      const noticeY = H - 110
      ctx.fillStyle = '#e6f5ed'
      ctx.beginPath(); ctx.roundRect(40, noticeY, W - 80, 70, 12); ctx.fill()
      ctx.strokeStyle = '#b2d9c3'
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.fillStyle = '#005c37'
      ctx.font = '14px "Noto Sans Malayalam", sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('✓  സ്ത്രീകൾക്ക് പ്രത്യേക സൗകര്യം  •  ഭക്ഷണ കൂപ്പൺ ഉണ്ടായിരിക്കും', W/2, noticeY + 26)
      ctx.fillStyle = '#5a7265'
      ctx.font = '13px "Noto Sans Malayalam", sans-serif'
      ctx.fillText('ഭക്ഷണം & പ്രവേശനത്തിനായി ഈ confirmation pass കാണിക്കേണ്ടതാണ്', W/2, noticeY + 48)
      ctx.fillStyle = '#8ea898'
      ctx.font = '11px Outfit, sans-serif'
      ctx.fillText('M.I.C. Udyama Padinjaru Campus  •  Contact: 7593839179', W/2, H - 22)

      // Download
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `IshqMajlis_Pass_${registrationId.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`
      a.click()
    } catch (err) {
      console.error('Pass download error:', err)
      alert('Could not generate image. Please take a screenshot of the pass.')
    } finally {
      setDownloading(false)
    }
  }

  function handleWhatsApp() {
    const text =
      `*ഇശ്ഖ് മജ്‌ലിസ് 2026 – Confirmation Pass*\n\n` +
      `🆔 *Reg ID:* ${registrationId}\n` +
      `👤 *Name:* ${fullName}\n` +
      `📍 *Place:* ${place}\n` +
      `👥 *Attendees:* ${attendeesCount} Person${attendeesCount > 1 ? 's' : ''} (${attendeesCount} പേർ)\n` +
      `⚧ *Gender:* ${gender === 'Male' ? 'Male / പുരുഷൻ' : 'Female / സ്ത്രീ'}\n\n` +
      `📅 *Date:* 2026 September 14 (Monday)\n` +
      `📍 *Venue:* M.I.C. Udyama Padinjaru Campus\n\n` +
      `_ഭക്ഷണം & പ്രവേശനത്തിനായി ഈ pass കാണിക്കുക._`
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="pass-card-wrapper">
      <div className="pass-card">
        {/* Green banner top */}
        <div className="pass-top">
          <p className="pass-eyebrow">✦ Official Entry &amp; Food Confirmation ✦</p>
          <h2 className="pass-event-title">ഇശ്ഖ് മജ്‌ലിസ് – 2026</h2>
          <p className="pass-venue-line">
            എം.ഐ.സി. ഉദ്യമ പടിഞ്ഞാറ് ക്യാമ്പസ്  •  2026 സെപ്റ്റംബർ 14, തിങ്കൾ
          </p>
        </div>

        {/* Reg ID strip */}
        <div className="pass-reg-strip">
          <div className="pass-reg-badge">
            <i className="fa-solid fa-id-card" />
            <span>{registrationId}</span>
          </div>
        </div>

        {/* Details grid */}
        <div className="pass-body-grid">
          <div className="pass-details">
            <div className="pass-field">
              <span className="pass-field-label">Full Name / പേര്</span>
              <span className="pass-field-value">{fullName}</span>
            </div>
            <div className="pass-field">
              <span className="pass-field-label">Place / സ്ഥലം</span>
              <span className="pass-field-value">{place}</span>
            </div>
            <div className="pass-field">
              <span className="pass-field-label">{age ? 'Age & Gender' : 'Gender / ലിംഗഭേദം'}</span>
              <span className="pass-field-value">
                {age ? `${age} Yrs  •  ` : ''}
                {gender === 'Male' ? 'Male (പുരുഷൻ)' : 'Female (സ്ത്രീ)'}
              </span>
            </div>
            <div className="pass-field">
              <span className="pass-field-label">Number of Attendees / പങ്കെടുക്കുന്നവർ</span>
              <span className="pass-field-value highlight">
                <i className="fa-solid fa-users" style={{ marginRight: 6 }} />
                {attendeesCount} Person{attendeesCount > 1 ? 's' : ''}  ({attendeesCount} പേർ)
              </span>
            </div>
          </div>

          <div className="pass-qr-area">
            <div className="pass-qr-wrap">
              <QRCodeSVG value={qrValue} size={110} level="M" />
            </div>
            <span className="pass-qr-caption">SCAN TO VERIFY</span>
          </div>
        </div>

        {/* Notice footer */}
        <div className="pass-notice">
          <i className="fa-solid fa-circle-check" style={{ marginRight: 6 }} />
          സ്ത്രീകൾക്ക് പ്രത്യേക സൗകര്യം. ഭക്ഷണം & പ്രവേശനത്തിനായി ഈ pass കാണിക്കേണ്ടതാണ്.
        </div>
      </div>

      {showActions && (
        <div className="pass-actions">
          <button
            type="button"
            className="pass-btn pass-btn-download"
            onClick={handleDownloadPass}
            disabled={downloading}
          >
            <i className={`fa-solid ${downloading ? 'fa-spinner fa-spin' : 'fa-download'}`} />
            <span>{downloading ? 'Generating…' : 'Download Pass'}</span>
          </button>
          <button type="button" className="pass-btn pass-btn-whatsapp" onClick={handleWhatsApp}>
            <i className="fa-brands fa-whatsapp" />
            <span>Share via WhatsApp</span>
          </button>
          {onRegisterAnother && (
            <button type="button" className="pass-btn pass-btn-another" onClick={onRegisterAnother}>
              <i className="fa-solid fa-user-plus" />
              <span>Register Another</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
