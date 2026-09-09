import { useState, useEffect, useCallback } from 'react'
import { fetchRegistrations, fetchStats, deleteRegistration } from '../api/api'
import PassModal from './PassModal'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [genderFilter, setGenderFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedPass, setSelectedPass] = useState(null)
  const [viewMode, setViewMode] = useState('auto') // 'auto' | 'table' | 'cards'

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [rRes, sRes] = await Promise.all([
        fetchRegistrations({
          page, limit: 20,
          gender: genderFilter === 'all' ? undefined : genderFilter,
          search: search || undefined,
        }),
        fetchStats(),
      ])
      setRegistrations(rRes.data?.data || [])
      setTotal(rRes.data?.total || 0)
      setTotalPages(rRes.data?.totalPages || 1)
      setStats(sRes.data?.data || null)
    } catch (err) {
      console.error('Failed to load admin data:', err)
    } finally {
      setLoading(false)
    }
  }, [page, genderFilter, search])

  useEffect(() => { loadData() }, [loadData])

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete registration for "${name}"?\nThis cannot be undone.`)) return
    try {
      await deleteRegistration(id)
      loadData()
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message))
    }
  }

  function exportCSV() {
    if (!registrations.length) { alert('No registrations to export'); return }
    const headers = ['Registration ID', 'Full Name', 'Place', 'Age', 'Gender', 'Attendees Count', 'WhatsApp Number', 'Community Concern', 'Registered At']
    const rows = registrations.map(r => [
      `"${r.registrationId || ''}"`,
      `"${r.fullName || ''}"`,
      `"${r.place || ''}"`,
      r.age || '',
      `"${r.gender || ''}"`,
      r.attendeesCount || 1,
      `"${r.whatsappNumber || ''}"`,
      `"${r.whatsappCommunityConcern || ''}"`,
      `"${new Date(r.createdAt).toLocaleString('en-IN')}"`,
    ])
    const csv = 'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const a = document.createElement('a')
    a.href = encodeURI(csv)
    a.download = `IshqMajlis_Registrations_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
  }

  return (
    <div className="admin-wrap">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-title-group">
          <h1>ഇശ്ഖ് മജ്‌ലിസ് – Administrator Dashboard</h1>
          <p>M.I.C. Udma West Campus • Registration Records & Live Headcount</p>
        </div>
        <button type="button" className="btn-export-csv" onClick={exportCSV}>
          <i className="fa-solid fa-file-csv" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* KPI Stats — Original IUML Gradient Card Style */}
      {stats && (
        <div className="admin-stats-grid">
          <div
            className="admin-stat-card"
            style={{
              background: 'linear-gradient(135deg, #008751 0%, #005c37 100%)',
              boxShadow: '0 6px 18px rgba(0,135,81,0.25)',
            }}
          >
            <i className="fa-solid fa-address-card admin-stat-icon" />
            <div className="admin-stat-num">{stats.totalRegistrations}</div>
            <div className="admin-stat-lbl">Total Registrations</div>
            <div className="admin-stat-sub-lbl">ആകെ രജിസ്ട്രേഷൻ</div>
          </div>

          <div
            className="admin-stat-card"
            style={{
              background: 'linear-gradient(135deg, #0b598d 0%, #083c5e 100%)',
              boxShadow: '0 6px 18px rgba(11,89,141,0.25)',
            }}
          >
            <i className="fa-solid fa-users admin-stat-icon" />
            <div className="admin-stat-num">{stats.totalHeadcount}</div>
            <div className="admin-stat-lbl">Total Headcount</div>
            <div className="admin-stat-sub-lbl">പങ്കെടുക്കുന്നവർ</div>
          </div>

          <div
            className="admin-stat-card"
            style={{
              background: 'linear-gradient(135deg, #5a189a 0%, #3c096c 100%)',
              boxShadow: '0 6px 18px rgba(90,24,154,0.25)',
            }}
          >
            <i className="fa-solid fa-venus-mars admin-stat-icon" />
            <div className="admin-stat-num admin-stat-gender-num">
              {stats.byGender?.length
                ? stats.byGender.map(g => `${g.count} ${g._id === 'Female' ? 'F' : 'M'}`).join(' · ')
                : '—'}
            </div>
            <div className="admin-stat-lbl">Gender Split</div>
            <div className="admin-stat-sub-lbl">പുരുഷൻ / സ്ത്രീ</div>
          </div>

          <div
            className="admin-stat-card"
            style={{
              background: 'linear-gradient(135deg, #b8860b 0%, #856108 100%)',
              boxShadow: '0 6px 18px rgba(184,134,11,0.25)',
            }}
          >
            <i className="fa-solid fa-cake-candles admin-stat-icon" />
            <div className="admin-stat-num">{stats.averageAge || 0}</div>
            <div className="admin-stat-lbl">Average Age</div>
            <div className="admin-stat-sub-lbl">ശരാശരി വയസ്സ്</div>
          </div>
        </div>
      )}

      {/* Places breakdown */}
      {stats?.byPlace?.length > 0 && (
        <div className="places-card">
          <div className="places-card-title">
            <i className="fa-solid fa-location-dot" />
            Top Locations / സ്ഥലങ്ങൾ
          </div>
          <div className="places-chips">
            {stats.byPlace.map(p => (
              <div key={p._id} className="place-chip">
                <span className="place-chip-name">{p._id}</span>
                <span className="place-count-badge">{p.count} reg · {p.attendees} pax</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="admin-toolbar">
        <form
          onSubmit={e => { e.preventDefault(); setPage(1); loadData() }}
          className="admin-search-form"
        >
          <div className="search-input-wrap">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              type="text"
              placeholder="Search by Name, Place, Reg ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => { setSearch(''); setPage(1) }}
                title="Clear search"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            )}
          </div>
          <button type="submit" className="btn-search">
            <i className="fa-solid fa-filter" /> Filter
          </button>
        </form>

        <div className="admin-filter-group">
          <label className="filter-label">Gender:</label>
          <select
            className="filter-select"
            value={genderFilter}
            onChange={e => { setGenderFilter(e.target.value); setPage(1) }}
          >
            <option value="all">All / എല്ലാം</option>
            <option value="Male">Male / പുരുഷൻ</option>
            <option value="Female">Female / സ്ത്രീ</option>
          </select>
        </div>
      </div>

      {/* Records Container */}
      <div className="admin-table-card">
        {/* Card Header with View Toggle */}
        <div className="admin-records-header">
          <div className="records-count-wrap">
            <i className="fa-solid fa-list-check" />
            <span>രജിസ്ട്രേഷൻ വിവരങ്ങൾ / Records</span>
            <span className="records-pill">{total}</span>
          </div>
          <div className="admin-header-actions">
            <div className="admin-view-toggle">
              <button
                type="button"
                className={`admin-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Table View"
              >
                <i className="fa-solid fa-table" />
                <span className="toggle-label">Table</span>
              </button>
              <button
                type="button"
                className={`admin-toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
                onClick={() => setViewMode('cards')}
                title="Card View"
              >
                <i className="fa-solid fa-grip-vertical" />
                <span className="toggle-label">Cards</span>
              </button>
            </div>
            <button
              type="button"
              className="btn-refresh-data"
              onClick={loadData}
              title="Refresh data"
            >
              <i className={`fa-solid fa-arrows-rotate ${loading ? 'fa-spin' : ''}`} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="admin-state-box">
            <i className="fa-solid fa-spinner fa-spin" />
            <p>Loading registrations…</p>
          </div>
        ) : registrations.length === 0 ? (
          <div className="admin-state-box">
            <i className="fa-solid fa-inbox" />
            <p>No registrations found matching criteria.</p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE VIEW */}
            <div className={`table-responsive ${viewMode === 'cards' ? 'force-hidden' : viewMode === 'table' ? 'force-visible' : 'admin-table-desktop'}`}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Reg ID</th>
                    <th>Full Name / പേര്</th>
                    <th>Place / സ്ഥലം</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Attendees</th>
                    <th>WhatsApp</th>
                    <th>Community Concern</th>
                    <th>Registered At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map(item => (
                    <tr key={item._id}>
                      <td><span className="reg-id-cell">{item.registrationId || '—'}</span></td>
                      <td className="cell-name">{item.fullName}</td>
                      <td className="cell-place">{item.place}</td>
                      <td>{item.age}</td>
                      <td>
                        <span className={`gender-badge ${item.gender === 'Female' ? 'gender-female' : 'gender-male'}`}>
                          {item.gender}
                        </span>
                      </td>
                      <td>
                        <span className="attendees-badge">
                          <i className="fa-solid fa-users" />
                          {item.attendeesCount}
                        </span>
                      </td>
                      <td>{item.whatsappNumber || item.whatsappNo || item.whatsapp || '—'}</td>
                      <td>{item.whatsappCommunityConcern || item.communityConcern || 'No'}</td>
                      <td className="cell-date">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                      <td>
                        <div className="action-btn-group">
                          <button
                            type="button"
                            className="btn-icon"
                            title="View Entry Pass"
                            onClick={() => setSelectedPass(item)}
                          >
                            <i className="fa-solid fa-id-card" style={{ color: 'var(--gold)' }} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon delete"
                            title="Delete"
                            onClick={() => handleDelete(item._id, item.fullName)}
                          >
                            <i className="fa-solid fa-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS VIEW (Auto active on mobile screens or when Cards selected) */}
            <div className={`admin-cards-container ${viewMode === 'table' ? 'force-hidden' : viewMode === 'cards' ? 'force-visible' : 'admin-cards-mobile'}`}>
              {registrations.map((item, idx) => (
                <div key={item._id} className="registration-mobile-card">
                  <div className="rmc-header">
                    <div className="rmc-avatar">
                      <i className={`fa-solid ${item.gender === 'Female' ? 'fa-user-nurse' : 'fa-user'}`} />
                    </div>
                    <div className="rmc-info-top">
                      <div className="rmc-name">{item.fullName}</div>
                      <div className="rmc-badges">
                        <span className="rmc-reg-badge">
                          {item.registrationId || `#${(page - 1) * 20 + idx + 1}`}
                        </span>
                        <span className={`gender-badge ${item.gender === 'Female' ? 'gender-female' : 'gender-male'}`}>
                          {item.gender}
                        </span>
                        <span className="rmc-age-badge">{item.age} yrs</span>
                      </div>
                    </div>
                    <div className="rmc-top-actions">
                      <button
                        type="button"
                        className="btn-icon"
                        title="View Pass"
                        onClick={() => setSelectedPass(item)}
                      >
                        <i className="fa-solid fa-id-card" style={{ color: 'var(--gold)' }} />
                      </button>
                      <button
                        type="button"
                        className="btn-icon delete"
                        title="Delete"
                        onClick={() => handleDelete(item._id, item.fullName)}
                      >
                        <i className="fa-solid fa-trash" />
                      </button>
                    </div>
                  </div>

                  <div className="rmc-grid">
                    <div className="rmc-item">
                      <span className="rmc-label">
                        <i className="fa-solid fa-location-dot" /> സ്ഥലം / Place
                      </span>
                      <span className="rmc-val">{item.place}</span>
                    </div>
                    <div className="rmc-item">
                      <span className="rmc-label">
                        <i className="fa-solid fa-users" /> പങ്കെടുക്കുന്നവർ / Attendees
                      </span>
                      <span className="rmc-val rmc-attendees-val">
                        <i className="fa-solid fa-check" />
                        {item.attendeesCount} {item.attendeesCount > 1 ? 'പേർ' : 'ആൾ'}
                      </span>
                    </div>
                    <div className="rmc-item">
                      <span className="rmc-label">
                        <i className="fa-brands fa-whatsapp" /> WhatsApp
                      </span>
                      <span className="rmc-val">{item.whatsappNumber || item.whatsappNo || item.whatsapp || '—'}</span>
                    </div>
                    <div className="rmc-item">
                      <span className="rmc-label">
                        <i className="fa-solid fa-circle-question" /> Community issue
                      </span>
                      <span className="rmc-val">{item.whatsappCommunityConcern || item.communityConcern || 'No'}</span>
                    </div>
                    <div className="rmc-item rmc-full">
                      <span className="rmc-label">
                        <i className="fa-regular fa-clock" /> രജിസ്റ്റർ ചെയ്ത സമയം / Registered
                      </span>
                      <span className="rmc-val rmc-date">
                        {new Date(item.createdAt).toLocaleString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit', hour12: true
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="rmc-actions">
                    <button
                      type="button"
                      className="rmc-btn-pass"
                      onClick={() => setSelectedPass(item)}
                    >
                      <i className="fa-solid fa-id-card" />
                      <span>View & Download Entry Pass</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination Bar */}
        <div className="pagination-bar">
          <span className="pagination-count-text">
            Showing <strong>{registrations.length}</strong> of <strong>{total}</strong>
          </span>
          <div className="page-controls">
            <button
              className="page-btn"
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
            >
              ← Prev
            </button>
            <span className="page-indicator">
              {page} / {totalPages}
            </span>
            <button
              className="page-btn"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Modal preview when a pass is clicked */}
      {selectedPass && (
        <PassModal data={selectedPass} onClose={() => setSelectedPass(null)} />
      )}
    </div>
  )
}
