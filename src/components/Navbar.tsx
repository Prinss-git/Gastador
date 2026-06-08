import { NavLink } from 'react-router-dom'

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
const HistoryIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const InsightsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)
const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)

function Tab({ to, icon, label, end }: { to: string; icon: React.ReactNode; label: string; end?: boolean }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) =>
      `flex flex-col items-center gap-1 flex-1 py-2.5 transition-colors duration-150 ${
        isActive ? 'text-primary' : 'text-text-3'
      }`
    }>
      {icon}
      <span className="text-[9px] font-semibold tracking-wide leading-none">{label}</span>
    </NavLink>
  )
}

export function Navbar() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app z-50 px-4 pb-safe mb-2">
      {/* Outer wrapper — positions the FAB above the pill */}
      <div className="relative">
        {/* FAB — absolutely centered above the pill */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-5 flex flex-col items-center z-10">
          <NavLink to="/add"
            className="w-14 h-14 rounded-full bg-primary shadow-primary
                       flex items-center justify-center text-white
                       border-4 border-[#0A0A12]
                       transition-transform duration-100 active:scale-90">
            <PlusIcon />
          </NavLink>
        </div>

        {/* Pill bar */}
        <div className="glass rounded-[28px] border border-border shadow-large">
          <div className="flex items-center px-1 pt-2.5 pb-1">
            <Tab to="/" icon={<HomeIcon />} label="Home" end />
            <Tab to="/history" icon={<HistoryIcon />} label="History" />

            {/* Spacer for FAB */}
            <div className="flex-1 flex flex-col items-center py-2.5">
              <div className="w-[22px] h-[22px]" />
              <span className="text-[9px] font-semibold tracking-wide text-text-3 leading-none mt-1">Add</span>
            </div>

            <Tab to="/insights" icon={<InsightsIcon />} label="Insights" />
            <Tab to="/profile" icon={<ProfileIcon />} label="Profile" />
          </div>
        </div>
      </div>
    </nav>
  )
}
