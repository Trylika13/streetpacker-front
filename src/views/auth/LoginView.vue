<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from "@/api/axios";

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

const login = async () => {
  error.value = null
  loading.value = true

  try {
    const response = await api.post('/users/login', {
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
  <div class="min-h-screen bg-[#0d161c] text-white flex flex-col items-center overflow-x-hidden font-sans">

    <div class="w-full max-w-lg lg:max-w-4xl flex flex-col lg:flex-row min-h-screen lg:items-center lg:gap-16 p-6 lg:p-12">

      <div class="flex-1 lg:text-left">
        <div class="mt-4 lg:mt-0 mb-10">
          <button
              @click="router.push('/')"
              class="group text-[#00cba9] flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] hover:brightness-125 transition-all"
          >
            <span class="text-lg transition-transform group-hover:-translate-x-1">←</span> Retour
          </button>
        </div>

        <div class="mb-10 lg:mb-0">
          <h2 class="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-tight">
            Bon retour <br/>
            <span class="text-[#ff7e5f]">parmi nous</span>
          </h2>
          <p class="text-teal-100/50 text-sm lg:text-lg mt-4 max-w-[280px] lg:max-w-none">
            Connecte-toi pour retrouver tes spots favoris et tes itinéraires.
          </p>
        </div>
      </div>

      <div class="flex-1 w-full max-w-md mx-auto lg:mx-0">
        <form @submit.prevent="login" class="flex flex-col gap-5 bg-[#112220]/30 lg:bg-[#112220]/50 p-1 lg:p-8 rounded-[2rem] border border-white/5 lg:backdrop-blur-sm">

          <div class="space-y-2">
            <label class="text-[10px] uppercase tracking-[0.3em] text-teal-500 font-black ml-1">Pseudo</label>
            <input
                v-model="username"
                type="text"
                placeholder="johndoe123"
                class="w-full h-16 bg-[#112220] border border-[#1a3532] rounded-2xl px-5 text-white focus:border-[#ff7e5f] focus:ring-1 focus:ring-[#ff7e5f]/20 outline-none transition-all placeholder:text-teal-900/50"
            />
          </div>

          <div class="space-y-2">
            <label class="text-[10px] uppercase tracking-[0.3em] text-teal-500 font-black ml-1">Mot de passe</label>
            <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                class="w-full h-16 bg-[#112220] border border-[#1a3532] rounded-2xl px-5 text-white focus:border-[#ff7e5f] focus:ring-1 focus:ring-[#ff7e5f]/20 outline-none transition-all placeholder:text-teal-900/50"
            />
          </div>

          <transition name="fade">
            <p v-if="error" class="text-[#ff7e5f] text-xs font-bold text-center bg-[#ff7e5f]/10 py-4 rounded-xl border border-[#ff7e5f]/20">
              {{ error }}
            </p>
          </transition>

          <div class="pt-4 space-y-6">
            <button
                type="submit"
                :disabled="loading"
                class="w-full h-16 bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] text-[#0d161c] font-black rounded-2xl shadow-lg shadow-[#ff7e5f]/10 active:scale-[0.98] hover:brightness-110 transition-all uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!loading">C'est parti !</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5 text-[#0d161c]" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exploration...
              </span>
            </button>

            <p @click="router.push('/register')" class="text-center text-xs text-teal-500/70 cursor-pointer group">
              Pas encore de compte ?
              <span class="text-[#00cba9] font-black group-hover:underline transition-all underline-offset-4">Inscris-toi</span>
            </p>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>