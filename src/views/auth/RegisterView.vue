<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from "../../api/axios";

const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

const handleRegister = async () => {
  error.value = null

  if (password.value !== confirmPassword.value) {
    error.value = "Les mots de passe ne correspondent pas !"
    return
  }

  loading.value = true

  try {
    await api.post('/auth/register', {
      username: username.value,
      email: email.value,
      password: password.value
    })

    router.push('/login')
  } catch (err: any) {
    error.value = err.response?.data?.message || "Erreur lors de l'aventure... Réessaie !"
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="h-screen w-screen bg-[#F4F7F5] text-[#1E2E2A] flex items-center justify-center font-sans relative overflow-hidden selection:bg-[#00A896]/20">

    <div class="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#FF6B6B]/10 blur-[100px] pointer-events-none"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#00A896]/10 blur-[100px] pointer-events-none"></div>

    <div class="w-full max-w-5xl px-6 h-full max-h-[850px] flex flex-col lg:flex-row lg:items-center justify-center lg:justify-between gap-8 lg:gap-16 z-10 py-4">

      <div class="flex flex-col items-start justify-center shrink-0">
        <div class="mb-4 lg:mb-8">
          <button
              @click="router.push('/')"
              class="group text-[#00A896] flex items-center gap-2 font-medium text-[11px] uppercase tracking-[0.2em] transition-all"
          >
            <span class="text-sm transition-transform group-hover:-translate-x-1">←</span> Retour
          </button>
        </div>

        <div class="max-w-sm">
          <h2 class="text-3xl lg:text-5xl font-light tracking-tight text-[#1E2E2A] leading-tight mb-3">
            Créer ton <br/>
            <span class="font-medium text-[#00A896]">profil de backpacker</span>
          </h2>
          <p class="text-xs lg:text-sm text-[#5C756E] leading-relaxed">
            Rejoins la communauté pour partager tes spots secrets et explorer le monde autrement.
          </p>
        </div>
      </div>


      <div class="w-full max-w-md mx-auto lg:mx-0 overflow-y-auto max-h-[75vh] lg:max-h-none no-scrollbar shrink-0">
        <form @submit.prevent="handleRegister" class="flex flex-col gap-5 bg-white border border-[#E4ECE9] p-6 lg:p-10 rounded-[2rem] shadow-sm">

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

            <div class="relative border-b border-[#E4ECE9] focus-within:border-[#00A896] transition-colors pb-1 sm:col-span-2">
              <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold mb-1">Username</label>
              <input
                  v-model="username"
                  type="text"
                  placeholder="JeanLeBackpacker"
                  class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none placeholder:text-[#1E2E2A]/20 h-8"
              />
            </div>

            <div class="relative border-b border-[#E4ECE9] focus-within:border-[#00A896] transition-colors pb-1 sm:col-span-2">
              <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold mb-1">Email</label>
              <input
                  v-model="email"
                  type="email"
                  placeholder="jean@backpack.com"
                  class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none placeholder:text-[#1E2E2A]/20 h-8"
              />
            </div>

            <div class="relative border-b border-[#E4ECE9] focus-within:border-[#FF6B6B] transition-colors pb-1">
              <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold mb-1">Mot de passe</label>
              <input
                  v-model="password"
                  type="password"
                  placeholder="••••••••"
                  class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none placeholder:text-[#1E2E2A]/20 h-8"
              />
            </div>

            <div class="relative border-b border-[#E4ECE9] focus-within:border-[#FF6B6B] transition-colors pb-1">
              <label class="block text-[10px] uppercase tracking-[0.2em] text-[#FF6B6B] font-semibold mb-1">Confirmer</label>
              <input
                  v-model="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none placeholder:text-[#1E2E2A]/20 h-8"
              />
            </div>
          </div>

          <transition name="fade">
            <p v-if="error" class="text-[#FF6B6B] text-xs font-medium text-center bg-[#FF6B6B]/5 py-2.5 rounded-xl border border-[#FF6B6B]/10 my-0">
              {{ error }}
            </p>
          </transition>

          <div class="pt-1">
            <button
                type="submit"
                :disabled="loading"
                class="w-full h-12 bg-[#00A896] text-white font-medium text-sm tracking-wide rounded-xl active:scale-[0.98] transition-all disabled:opacity-40 shadow-sm flex items-center justify-center"
            >
              <span v-if="!loading">Créer mon compte</span>
              <span v-else class="flex items-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création...
              </span>
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Évite les barres de défilement moches sur les formulaires compacts */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>