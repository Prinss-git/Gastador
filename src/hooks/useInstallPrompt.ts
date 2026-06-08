import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function useInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isDismissed, setIsDismissed] = useState(
    () => localStorage.getItem('pwa-dismissed') === 'true'
  )

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isInStandaloneMode =
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)

  useEffect(() => {
    if (isInStandaloneMode) { setIsInstalled(true); return }

    const handler = (e: Event) => {
      e.preventDefault()
      // When the browser re-offers the prompt, clear any prior dismissal
      setIsDismissed(false)
      localStorage.removeItem('pwa-dismissed')
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setIsInstalled(true))

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [isInStandaloneMode])

  const install = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setIsInstalled(true)
    setInstallPrompt(null)
  }

  const dismiss = () => {
    setIsDismissed(true)
    localStorage.setItem('pwa-dismissed', 'true')
  }

  // Show banner if: not installed, not dismissed, and either prompt is ready OR on iOS
  const showBanner =
    !isInstalled &&
    !isDismissed &&
    !isInStandaloneMode &&
    (installPrompt !== null || isIOS)

  // Show install hint in profile if not installed (even without prompt — show manual instructions)
  const canInstall = !isInstalled && !isInStandaloneMode

  return { install, dismiss, showBanner, canInstall, isIOS, isInstalled, hasPrompt: installPrompt !== null }
}
