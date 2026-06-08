import { NavLink } from 'react-router-dom'

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
)

const ListIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
)

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
)

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path fillRule="evenodd" d="M12 3a1 1 0 011 1v7h7a1 1 0 110 2h-7v7a1 1 0 11-2 0v-7H4a1 1 0 110-2h7V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
)

export function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-0.5 px-4 transition-colors ${
      isActive ? 'text-primary' : 'text-text-muted'
    }`

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-card border-t border-white/10 pb-safe z-50">
      <div className="flex items-end justify-around px-2 pt-2 pb-3">
        <NavLink to="/" end className={linkClass}>
          <HomeIcon />
          <span className="text-xs">Home</span>
        </NavLink>

        <NavLink to="/history" className={linkClass}>
          <ListIcon />
          <span className="text-xs">History</span>
        </NavLink>

        {/* FAB-style Add button */}
        <NavLink
          to="/add"
          className={({ isActive }) =>
            `-mt-5 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
              isActive ? 'bg-primary-dark' : 'bg-primary'
            }`
          }
        >
          <PlusIcon />
        </NavLink>

        <NavLink to="/insights" className={linkClass}>
          <SparkleIcon />
          <span className="text-xs">Insights</span>
        </NavLink>

        {/* placeholder for balance */}
        <div className="w-14" />
      </div>
    </nav>
  )
}
