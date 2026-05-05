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

    console.log("Réponse API :", response.data)

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
  <div class="min-h-screen bg-[#0d161c] text-white p-6 flex flex-col">
    <!-- Header avec bouton retour -->
    <div class="mt-4 mb-10">
      <button @click="router.push('/')" class="text-[#00cba9] flex items-center gap-2 font-bold text-sm uppercase tracking-widest">
        <span>←</span> Retour
      </button>
    </div>

    <!-- Titre -->
    <div class="mb-10">
      <h2 class="text-3xl font-black text-white uppercase tracking-tighter">
        Bon retour <br/>
        <span class="text-[#ff7e5f]">parmi nous</span>
      </h2>
      <p class="text-teal-100/50 text-sm mt-2">Connecte-toi pour retrouver tes spots.</p>
    </div>

    <!-- Formulaire -->
    <form @submit.prevent="login" class="flex-1 flex flex-col gap-6">
      <div class="space-y-2">
        <label class="text-[10px] uppercase tracking-[0.2em] text-teal-500 font-black ml-1">Pseudo</label>
        <input
            v-model="username"
            type="text"
            placeholder="johndoe123"
            class="w-full h-16 bg-[#112220] border border-[#1a3532] rounded-2xl px-5 text-white focus:border-[#ff7e5f] outline-none transition-all placeholder:text-teal-900/50"
        />
      </div>

      <div class="space-y-2">
        <label class="text-[10px] uppercase tracking-[0.2em] text-teal-500 font-black ml-1">Mot de passe</label>
        <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full h-16 bg-[#112220] border border-[#1a3532] rounded-2xl px-5 text-white focus:border-[#ff7e5f] outline-none transition-all placeholder:text-teal-900/50"
        />
      </div>

      <p v-if="error" class="text-[#ff7e5f] text-xs font-bold text-center bg-[#ff7e5f]/10 py-3 rounded-xl">
        {{ error }}
      </p>

      <div class="mt-auto pb-10 space-y-4">
        <button
            type="submit"
            :disabled="loading"
            class="w-full h-16 bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] text-[#0d161c] font-black rounded-2xl shadow-lg shadow-[#ff7e5f]/10 active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50"
        >
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>

        <p @click="router.push('/register')" class="text-center text-xs text-teal-500/70">
          Pas encore de compte ? <span class="text-[#00cba9] font-bold">Inscris-toi</span>
        </p>
      </div>
    </form>
  </div>
</template>