import { Link, useLocation } from 'react-router-dom'

export default function FormHeader() {
  return (
    <div className="event-header-card">
      {/* Bold green top banner */}
      <div className="event-header-strip">
        <span className="strip-icon">
          <i className="fa-solid fa-star-and-crescent" />
        </span>
        <h1 className="event-main-title">
          ഇശ്ഖ് മജ്‌ലിസ് – രജിസ്ട്രേഷൻ ഫോം
        </h1>
        <p className="event-subtitle">
          Registration Form — M.I.C. Udma West Campus, 2026
        </p>
      </div>

      <div className="event-header-body">
        {/* Category & contact badges */}
        <div className="event-badges-row">
          <span className="event-type-badge">
            <i className="fa-solid fa-mosque" />
            ഇശ്ഖ് മജ്‌ലിസ് & പ്രാർത്ഥനാ സദസ്സ്സ്
          </span>
          <a href="tel:7593839179" className="event-contact-badge">
            <i className="fa-solid fa-phone" />
            Info: 7593839179
          </a>
        </div>

        {/* Date & venue info pills */}
        <div className="event-info-row">
          <div className="event-info-pill">
            <i className="fa-regular fa-calendar" />
            <span>2026 സെപ്റ്റംബർ 14, തിങ്കൾ</span>
          </div>
          <div className="event-info-pill">
            <i className="fa-solid fa-location-dot" />
            <span>എം.ഐ.സി. ഉദുമ പടിഞ്ഞാറ് ക്യാമ്പസ്</span>
          </div>
        </div>

        {/* Programme schedule — numbered timeline */}
        <div className="schedule-box">
          <div className="schedule-heading">
            <i className="fa-solid fa-calendar-check" />
            പ്രോഗ്രാം വിവരങ്ങൾ
          </div>

          <div className="schedule-item">
            <span className="schedule-bullet">1</span>
            <span>
              <strong>09:30 AM —</strong> ക്ലാസ് റൂം ഉദ്ഘാടനം: പാണക്കാട് സയ്യിദ് അബ്ബാസലി ശിഹാബ് തങ്ങൾ
            </span>
          </div>
          <div className="schedule-item">
            <span className="schedule-bullet">2</span>
            <span>
              <strong>മഗർബ് നിസ്കാരാനന്തരം —</strong> ഇശ്ഖ് മജ്‌ലിസും പ്രാർത്ഥനാ സദസ്സും
            </span>
          </div>
          <div className="schedule-item">
            <span className="schedule-bullet">3</span>
            <span>
              <strong>നേതൃത്വം —</strong> ഉസ്താദ് അബ്ദുല്ലാഹ് വാരിസ് ഹുദവി തിരൂർ, ഉസ്താദ് കബീർ ഹുദവി മഞ്ചേശ്വരം, ഉസ്താദ് അയാസ് റഹ്മാൻ ഹുദവി നമ്പ്യാർകൊച്ചി
            </span>
          </div>
        </div>

        {/* Invitation paragraph – updated with full description */}
        <div className="event-invitation">
          പ്രിയപ്പെട്ടവരെ, കഴിഞ്ഞ 29 വർഷക്കാലമായി ഉദുമ എം.ഐ.സി ക്യാമ്പസിൽ പ്രവർത്തിച്ചുവരുന്ന ഹുദവീ കോളേജിലെയും ഹിഫ്ള് കോളേജിലെയും ഹാഫിളീകളും,
          ഉസ്താദുമാരും, ബഹുജനങ്ങളും പങ്കെടുക്കുന്ന മഹത്തായ ഇഷ്ഖ് മജ്‌ലിസും പ്രാർത്ഥനാ സദസ്സും എം.ഐ.സി ഉദുമ പടിഞ്ഞാർ ക്യാമ്പസിൽ നടത്തപ്പെടുന്നു.
          ഈ വരുന്ന സെപ്റ്റംബർ 14 (തിങ്കൾ) മഗ്‌രിബ് നിസ്കാരശേഷം താങ്കളെയും കുടുംബത്തെയും സ്നേഹപൂർവ്വം ക്ഷണിക്കുന്നു.
        </div>

        {/* Notices */}
        <div className="notices-box">
          <div className="notices-title">
            <i className="fa-solid fa-triangle-exclamation" />
            പ്രത്യേക ശ്രദ്ധയ്ക്ക്
          </div>
          <ol className="notices-list">
            <li>സ്ത്രീകൾക്ക് പ്രത്യേക സൗകര്യം ഉണ്ടായിരിക്കുന്നതാണ്.</li>
            <li>പരിപാടിയിൽ പങ്കെടുക്കാൻ ഉദ്ദേശിക്കുന്നവർ താഴെ നൽകിയിട്ടുള്ള Form വഴി രജിസ്ട്രേഷൻ പൂർത്തീകരിക്കേണ്ടതാണ്. </li>
            
            <li>രജിസ്ട്രേഷൻ പൂർത്തിയാക്കുമ്പോൾ ലഭിക്കുന്ന പാസ്സ് കൌണ്ടറിൽ കാണിക്കണം.</li>
          </ol>
        </div>

        <div className="header-footer-note">
          <span className="req-indicator">* Indicates required question</span>
          <span>M.I.C. Udma West Campus</span>
        </div>
      </div>
    </div>
  )
}
