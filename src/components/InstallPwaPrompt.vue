<template>
  <Transition name="fade-slide">
    <div
        v-if="showPrompt"
        class="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 sm:pb-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pwa-install-title"
    >
      <div
          class="w-full max-w-sm rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden"
      >
        <!-- Header -->
        <div class="flex items-start gap-3 p-4 pb-3">
          <div class="flex-shrink-0 w-11 h-11 rounded-xl bg-[#00A896] flex items-center justify-center p-2">
            <img :src="geckoLogo" alt="StreetPacker" class="w-full h-full object-contain" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 id="pwa-install-title" class="text-sm font-semibold text-gray-900">
              Installer StreetPacker
            </h3>
            <p class="text-xs text-gray-500 mt-0.5">
              Accès rapide depuis votre écran d'accueil, même hors ligne.
            </p>
          </div>
          <button
              @click="dismiss"
              class="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fermer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Contenu selon plateforme -->
        <div class="px-4 pb-4">
          <!-- Cas Android / Desktop avec prompt natif disponible -->
          <div v-if="canInstallNatively">
            <button
                @click="triggerNativeInstall"
                class="w-full bg-[#00A896] hover:bg-[#009282] active:scale-[0.98] text-white text-sm font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v8.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 12.586V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Installer l'application
            </button>
          </div>

          <!-- Cas iOS : pas d'API native, instructions manuelles -->
          <div v-else-if="isIos" class="space-y-2.5">
            <div class="flex items-center gap-2.5 text-sm text-gray-700">
              <span class="flex-shrink-0 w-6 h-6 rounded-full bg-[#00A896]/10 text-[#00A896] text-xs font-semibold flex items-center justify-center">1</span>
              <span>
                Appuyez sur l'icône
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline -mt-0.5 mx-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v13m0-13l-4 4m4-4l4 4M5 21h14a1 1 0 001-1v-7a1 1 0 00-1-1h-3m-10 0H4a1 1 0 00-1 1v7a1 1 0 001 1z" />
                </svg>
                <strong>Partager</strong> en bas de Safari
              </span>
            </div>
            <div class="flex items-center gap-2.5 text-sm text-gray-700">
              <span class="flex-shrink-0 w-6 h-6 rounded-full bg-[#00A896]/10 text-[#00A896] text-xs font-semibold flex items-center justify-center">2</span>
              <span>Faites défiler et appuyez sur <strong>« Sur l'écran d'accueil »</strong></span>
            </div>
            <div class="flex items-center gap-2.5 text-sm text-gray-700">
              <span class="flex-shrink-0 w-6 h-6 rounded-full bg-[#00A896]/10 text-[#00A896] text-xs font-semibold flex items-center justify-center">3</span>
              <span>Confirmez avec <strong>« Ajouter »</strong></span>
            </div>
          </div>

          <!-- Fallback générique (navigateur sans support détecté) -->
          <div v-else class="text-sm text-gray-600">
            Ouvrez le menu de votre navigateur et choisissez
            <strong>« Installer l'application »</strong> ou
            <strong>« Ajouter à l'écran d'accueil »</strong>.
          </div>

          <button
              @click="dismiss"
              class="w-full mt-2 text-xs text-gray-400 hover:text-gray-600 py-1.5 transition-colors"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import geckoLogo from '@/assets/gecko.svg'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const STORAGE_KEY = 'sp_pwa_prompt_dismissed'

const showPrompt = ref(false)
const isIos = ref(false)
const canInstallNatively = ref(false)
let deferredPrompt: BeforeInstallPromptEvent | null = null

function isStandalone(): boolean {
  return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true // iOS Safari
  )
}

function detectIos(): boolean {
  const ua = window.navigator.userAgent
  return /iphone|ipad|ipod/i.test(ua) && !(window as any).MSStream
}

function wasDismissed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function dismiss(): void {
  showPrompt.value = false
  try {
    localStorage.setItem(STORAGE_KEY, 'true')
  } catch {
    // localStorage indisponible (navigation privée, etc.) : on ignore silencieusement
  }
}

async function triggerNativeInstall(): Promise<void> {
  if (!deferredPrompt) return
  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  if (outcome === 'accepted' || outcome === 'dismissed') {
    dismiss()
  }
  deferredPrompt = null
  canInstallNatively.value = false
}

function handleBeforeInstallPrompt(event: Event): void {
  event.preventDefault()
  deferredPrompt = event as BeforeInstallPromptEvent
  canInstallNatively.value = true
  if (!wasDismissed() && !isStandalone()) {
    showPrompt.value = true
  }
}

function handleAppInstalled(): void {
  dismiss()
}

onMounted(() => {
  if (isStandalone() || wasDismissed()) {
    return
  }

  isIos.value = detectIos()

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)

  // Sur iOS, il n'y a jamais de beforeinstallprompt : on affiche
  // directement les instructions manuelles après un court délai.
  if (isIos.value) {
    setTimeout(() => {
      if (!wasDismissed() && !isStandalone()) {
        showPrompt.value = true
      }
    }, 1200)
  }
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.removeEventListener('appinstalled', handleAppInstalled)
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>