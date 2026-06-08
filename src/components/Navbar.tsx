import { NavLink } from 'react-router-dom'

const icons = {
  home: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  history: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  insights: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
}

function Tab({ to, icon, label, end }: { to: string; icon: React.ReactNode; label: string; end?: boolean }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) =>
      `relative flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200 min-w-[52px] ${
        isActive ? 'text-primary' : 'text-text-3 hover:text-text-2'
      }`
    }>
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
          )}
          <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
            {icon}
          </span>
          <span className={`text-[9px] font-bold tracking-wide ${isActive ? 'text-primary' : ''}`}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  )
}

export function Navbar() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app z-50 pb-safe px-4">
      <div className="glass rounded-2xl border border-border shadow-medium mb-3">
        <div className="flex items-center justify-around px-2 py-2.5">
          <Tab to="/" icon={icons.home} label="Home" end />
          <Tab to="/history" icon={icons.history} label="History" />

          {/* FAB */}
          <NavLink to="/add"
            className="-mt-6 w-13 h-13 w-[52px] h-[52px] rounded-2xl bg-primary flex items-center justify-center text-white shadow-primary transition-all duration-200 active:scale-90 hover:bg-primary-soft">
            {icons.plus}
          </NavLink>

          <Tab to="/insights" icon={icons.insights} label="Insights" />
          <Tab to="/profile" icon={icons.profile} label="Profile" />
        </div>
      </div>
    </nav>
  )
}
