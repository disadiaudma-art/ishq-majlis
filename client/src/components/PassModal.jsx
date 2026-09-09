import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import PassCard from './PassCard'

export default function PassModal({ data, onClose, onRegisterAnother }) {
  useEffect(() => {
    if (data) {
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0d5c3a', '#dfb15b', '#5c35a8', '#ffffff'],
        })
      } catch (e) {
        // ignore
      }
    }
  }, [data])

  if (!data) return null

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-header-title">
            <i className="fa-solid fa-circle-check"></i>
            <span>രജിസ്ട്രേഷൻ പൂർത്തിയായി! (Registration Success)</span>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="modal-body">
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <p style={{ fontFamily: 'var(--font-ml)', fontSize: '0.95rem', color: '#1b5e20', fontWeight: 600 }}>
              നിങ്ങളുടെ വിവരങ്ങൾ വിജയകരമായി രജിസ്റ്റർ ചെയ്തിരിക്കുന്നു.
            </p>
            <p style={{ fontSize: '0.8rem', color: '#5f6368', marginTop: 2 }}>
              താഴെയുള്ള കൺഫർമേഷൻ പാസ്സ് ഡൗൺലോഡ് ചെയ്ത് സൂക്ഷിക്കുക.
            </p>
          </div>

          <PassCard
            data={data}
            showActions={true}
            onRegisterAnother={() => {
              onClose()
              if (onRegisterAnother) onRegisterAnother()
            }}
          />
        </div>
      </div>
    </div>
  )
}
