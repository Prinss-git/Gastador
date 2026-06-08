import { NavLink } from 'react-router-dom'

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
)
const ListIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
)
const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
  </svg>
)
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M12 3a1 1 0 011 1v7h7a1 1 0 110 2h-7v7a1 1 0 11-2 0v-7H4a1 1 0 110-2h7V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
)
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
)

function NavItem({ to, icon, label, end }: { to: string; icon: React.ReactNode; label: string; end?: boolean }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) =>
      `flex flex-col items-center gap-1 min-w-[48px] transition-all duration-200 ${isActive ? 'text-primary' : 'text-text-muted'}`
    }>
      {({ isActive }) => (
        <>
          <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/15 scale-110' : ''}`}>
            {icon}
          </div>
          <span className={`text-[10px] font-bold transition-all ${isActive ? 'gradient-text' : ''}`}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  )
}

export function Navbar() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app z-50 pb-safe px-3">
      <div className="glass-strong rounded-2xl border border-border/60 shadow-card mb-3">
        <div className="flex items-center justify-around px-2 py-3">
          <NavItem to="/" icon={<HomeIcon />} label="Home" end />
          <NavItem to="/history" icon={<ListIcon />} label="History" />

          {/* FAB */}
          <NavLink to="/add"
            className="-mt-7 w-14 h-14 rounded-2xl flex items-center justify-center shadow-fab transition-all duration-200 active:scale-90 hover:shadow-glow text-white"
            style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%)' }}>
            <PlusIcon />
          </NavLink>

          <NavItem to="/insights" icon={<SparkleIcon />} label="Insights" />
          <NavItem to="/profile" icon={<UserIcon />} label="Profile" />
        </div>
      </div>
    </nav>
  )
}
