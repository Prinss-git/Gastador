import { useInstallPrompt } from '../hooks/useInstallPrompt'

export function InstallBanner() {
  const { install, dismiss, showBanner, isIOS } = useInstallPrompt()

  if (!showBanner) return null

  return (
    <div className="mx-4 mb-4 rounded-2xl overflow-hidden animate-slide-up"
      style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%)' }}>
      <div className="p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
          💸
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm">Install Gastador</p>
          <p className="text-white/70 text-xs mt-0.5">
            {isIOS
              ? 'Tap the share button then "Add to Home Screen"'
              : 'Get the full app experience on your device'}
          </p>
        </div>
        <button onClick={dismiss} className="text-white/50 hover:text-white p-1 flex-shrink-0">✕</button>
      </div>
      {!isIOS && (
        <button onClick={install}
          className="w-full py-3 bg-white/15 hover:bg-white/25 transition-all text-white font-bold text-sm border-t border-white/10">
          📲 Install App
        </button>
      )}
      {isIOS && (
        <div className="px-4 pb-3 flex items-center gap-2 text-white/60 text-xs">
          <span>Tap</span>
          <span className="text-white font-bold text-base">⬆️</span>
          <span>then "Add to Home Screen"</span>
        </div>
      )}
    </div>
  )
}
