<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from "@/api/axios"; // On utilise ton instance configurée

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
    // L'URL relative suffit si ton instance axios a déjà la baseURL configurée
    await api.post('/users/register', {
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
  <div class="min-h-screen bg-[#0d161c] text-white flex flex-col items-center overflow-x-hidden font-sans">

    <div class="w-full max-w-lg lg:max-w-5xl flex flex-col lg:flex-row min-h-screen lg:items-center lg:gap-16 p-6 lg:p-12">

      <div class="flex-1 lg:text-left">
        <div class="mt-4 lg:mt-0 mb-8">
          <button
              @click="router.push('/')"
              class="group text-[#00cba9] flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] hover:brightness-125 transition-all"
          >
            <span class="text-lg transition-transform group-hover:-translate-x-1">←</span> Retour
          </button>
        </div>

        <div class="mb-8 lg:mb-0">
          <h2 class="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-tight">
            Créer ton <br/>
            <span class="text-[#00cba9]">profil nomade</span>
          </h2>
          <p class="text-teal-100/50 text-sm lg:text-lg mt-4 max-w-[280px] lg:max-w-md">
            Rejoins la communauté pour partager tes spots et explorer le monde avec nous.
          </p>
        </div>
      </div>

      <div class="flex-1 w-full max-w-md mx-auto lg:mx-0">
        <form @submit.prevent="handleRegister" class="flex flex-col gap-4 bg-[#112220]/30 lg:bg-[#112220]/50 p-1 lg:p-8 rounded-[2rem] border border-white/5 lg:backdrop-blur-sm">

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="space-y-1 lg:col-span-2">
              <label class="text-[10px] uppercase tracking-[0.2em] text-teal-500 font-black ml-1">Username</label>
              <input
                  v-model="username"
                  type="text"
                  placeholder="JeanLeBackpacker"
                  class="w-full h-14 bg-[#112220] border border-[#1a3532] rounded-2xl px-5 text-white focus:border-[#00cba9] outline-none transition-all placeholder:text-teal-900/50"
              />
            </div>

            <div class="space-y-1 lg:col-span-2">
              <label class="text-[10px] uppercase tracking-[0.2em] text-teal-500 font-black ml-1">Email</label>
              <input
                  v-model="email"
                  type="email"
                  placeholder="jean@backpack.com"
                  class="w-full h-14 bg-[#112220] border border-[#1a3532] rounded-2xl px-5 text-white focus:border-[#00cba9] outline-none transition-all placeholder:text-teal-900/50"
              />
            </div>

            <div class="space-y-1">
              <label class="text-[10px] uppercase tracking-[0.2em] text-teal-500 font-black ml-1">Mot de passe</label>
              <input
                  v-model="password"
                  type="password"
                  placeholder="••••••••"
                  class="w-full h-14 bg-[#112220] border border-[#1a3532] rounded-2xl px-5 text-white focus:border-[#ff7e5f] outline-none transition-all placeholder:text-teal-900/50"
              />
            </div>

            <div class="space-y-1">
              <label class="text-[10px] uppercase tracking-[0.2em] text-[#ff7e5f] font-black ml-1">Confirmer</label>
              <input
                  v-model="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  class="w-full h-14 bg-[#112220] border border-[#1a3532] rounded-2xl px-5 text-white focus:border-[#ff7e5f] outline-none transition-all placeholder:text-teal-900/50"
              />
            </div>
          </div>

          <transition name="fade">
            <p v-if="error" class="text-[#ff7e5f] text-xs font-bold text-center bg-[#ff7e5f]/10 py-3 rounded-xl border border-[#ff7e5f]/20">
              {{ error }}
            </p>
          </transition>

          <div class="pt-4 pb-6 lg:pb-0">
            <button
                type="submit"
                :disabled="loading"
                class="w-full h-16 bg-gradient-to-r from-[#00cba9] to-[#009b82] text-[#0d161c] font-black rounded-2xl shadow-lg shadow-[#00cba9]/20 active:scale-[0.98] hover:brightness-110 transition-all uppercase tracking-widest disabled:opacity-50"
            >
              <span v-if="!loading">C'est parti !</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>