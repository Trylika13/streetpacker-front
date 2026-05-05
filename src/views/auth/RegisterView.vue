<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

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
    // Utilise l'IP de ton PC comme pour le Login
    await axios.post('http://localhost:5174/api/users/register', {
      username: username.value,
      email: email.value,
      password: password.value
    })

    // Inscription réussie -> Direction le login
    router.push('/login')
  } catch (err: any) {
    error.value = err.response?.data?.message || "Erreur lors de l'aventure... Réessaie !"
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#0d161c] text-white p-6 flex flex-col">
    <!-- Header -->
    <div class="mt-4 mb-8">
      <button @click="router.push('/')" class="text-[#00cba9] flex items-center gap-2 font-bold text-sm uppercase tracking-widest">
        <span>←</span> Retour
      </button>
    </div>

    <!-- Titre -->
    <div class="mb-8">
      <h2 class="text-3xl font-black text-white uppercase tracking-tighter leading-none">
        Créer ton <br/>
        <span class="text-[#ff7e5f]">profil nomade</span>
      </h2>
      <p class="text-teal-100/50 text-sm mt-2">Rejoins la communauté StreetPacker.</p>
    </div>

    <!-- Formulaire -->
    <form @submit.prevent="handleRegister" class="flex-1 flex flex-col gap-4">
      <div class="space-y-1">
        <label class="text-[10px] uppercase tracking-[0.2em] text-teal-500 font-black ml-1">Username</label>
        <input
            v-model="username"
            type="text"
            placeholder="JeanLeBackpacker"
            class="w-full h-14 bg-[#112220] border border-[#1a3532] rounded-2xl px-5 text-white focus:border-[#00cba9] outline-none transition-all placeholder:text-teal-900/50"
        />
      </div>

      <div class="space-y-1">
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

      <p v-if="error" class="text-[#ff7e5f] text-xs font-bold text-center bg-[#ff7e5f]/10 py-3 rounded-xl mt-2">
        {{ error }}
      </p>

      <div class="mt-auto pb-6">
        <button
            type="submit"
            :disabled="loading"
            class="w-full h-16 bg-gradient-to-r from-[#00cba9] to-[#009b82] text-[#0d161c] font-black rounded-2xl shadow-lg shadow-[#00cba9]/10 active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50"
        >
          {{ loading ? 'Création...' : "C'est parti !" }}
        </button>
      </div>
    </form>
  </div>
</template>