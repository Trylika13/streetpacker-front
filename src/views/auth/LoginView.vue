<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from "../../api/axios";

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

const login = async () => {
  error.value = null
  loading.value = true

  try {
    const response = await api.post('/auth/login', {
      username: username.value,
      password: password.value
    })

    localStorage.setItem('token', response.data.accessToken)
    localStorage.setItem('refreshToken', response.data.refreshToken)

    router.push('/dashboard')
  } catch (err: any) {
    error.value = "Identifiants incorrects. Réessaie, backpacker !"
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#F4F7F5] text-[#1E2E2A] flex items-center justify-center font-sans relative overflow-hidden selection:bg-[#00A896]/20">

    <div class="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#FF6B6B]/10 blur-[100px] pointer-events-none"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#00A896]/10 blur-[100px] pointer-events-none"></div>

    <div class="w-full max-w-5xl px-6 py-12 flex flex-col lg:flex-row lg:items-center justify-between gap-12 lg:gap-16 z-10 min-h-screen lg:min-h-0">

      <div class="flex-1 flex flex-col items-start justify-between lg:justify-center h-full">
        <div class="mb-8 lg:mb-12">
          <button
              @click="router.push('/')"
              class="group text-[#00A896] flex items-center gap-2 font-medium text-[11px] uppercase tracking-[0.2em] transition-all"
          >
            <span class="text-sm transition-transform group-hover:-translate-x-1">←</span> Retour
          </button>
        </div>

        <div class="max-w-sm">
          <h2 class="text-4xl lg:text-6xl font-light tracking-tight text-[#1E2E2A] leading-tight mb-4">
            Bon retour <br/>
            <span class="font-medium text-[#FF6B6B]">parmi nous</span>
          </h2>
          <p class="text-sm text-[#5C756E] leading-relaxed">
            Connecte-toi pour retrouver tes spots favoris, ta streetfood préférée et tes coups de coeur de voyage.
          </p>
        </div>
      </div>

      <div class="flex-1 w-full max-w-sm mx-auto lg:mx-0">
        <form @submit.prevent="login" class="flex flex-col gap-8 bg-white border border-[#E4ECE9] p-8 lg:p-10 rounded-[2rem] shadow-sm">

          <div class="relative border-b border-[#E4ECE9] focus-within:border-[#00A896] transition-colors pb-1">
            <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold mb-1">Pseudo</label>
            <input
                v-model="username"
                type="text"
                placeholder="johndoe123"
                class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none placeholder:text-[#1E2E2A]/20 h-9"
            />
          </div>

          <div class="relative border-b border-[#E4ECE9] focus-within:border-[#00A896] transition-colors pb-1">
            <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold mb-1">Mot de passe</label>
            <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none placeholder:text-[#1E2E2A]/20 h-9"
            />
          </div>

          <transition name="fade">
            <p v-if="error" class="text-[#FF6B6B] text-xs font-medium text-center bg-[#FF6B6B]/5 py-3 rounded-xl border border-[#FF6B6B]/10">
              {{ error }}
            </p>
          </transition>

          <div class="pt-2 flex flex-col gap-6">
            <button
                type="submit"
                :disabled="loading"
                class="w-full h-14 bg-[#00A896] text-white font-medium text-sm tracking-wide rounded-xl active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex items-center justify-center"
            >
              <span v-if="!loading">Se connecter</span>
              <span v-else class="flex items-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exploration...
              </span>
            </button>

            <p @click="router.push('/register')" class="text-center text-xs text-[#5C756E] cursor-pointer group">
              Pas encore de compte ?
              <span class="text-[#00A896] font-medium group-hover:underline underline-offset-4 transition-all">Inscris-toi</span>
            </p>
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
</style>

