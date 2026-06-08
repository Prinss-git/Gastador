import { useInstallPrompt } from '../hooks/useInstallPrompt'

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

export function InstallBanner() {
  const { install, dismiss, showBanner, isIOS } = useInstallPrompt()

  if (!showBanner) return null

  return (
    <div className="mx-5 mb-5 rounded-2xl border border-primary/30 bg-bg-elevated overflow-hidden animate-slide-up">
      <div className="flex items-center gap-3 px-4 py-3.5">
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary flex-shrink-0">
          <DownloadIcon />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-text-1 font-semibold text-sm">Install Gastador</p>
          <p className="text-text-3 text-xs mt-0.5 leading-snug">
            {isIOS
              ? 'Tap Share → "Add to Home Screen"'
              : 'Add to home screen for a faster experience'}
          </p>
        </div>
        <button onClick={dismiss} className="text-text-3 hover:text-text-1 p-1.5 flex-shrink-0 transition-colors">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      {!isIOS && (
        <button onClick={install}
          className="w-full py-3 bg-primary/10 hover:bg-primary/20 active:bg-primary/30 transition-colors text-primary font-semibold text-sm border-t border-primary/20">
          Install App
        </button>
      )}
    </div>
  )
}
