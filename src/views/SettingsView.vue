<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'
import { compressImage, uploadImage } from '../api/mediaService'

interface UserProfile {
  username: string;
  email: string;
  whatsAppUrl: string;
  avatarUrl: string;
}

const router = useRouter()
const loading = ref(true)
const isSaving = ref(false)
const isUploadingAvatar = ref(false)

const avatarInput = ref<HTMLInputElement | null>(null)
const profile = ref<UserProfile>({
  username: '',
  email: '',
  whatsAppUrl: '',
  avatarUrl: ''
})

// Récupérer les infos de l'utilisateur connecté
const fetchProfileData = async () => {
  try {
    loading.value = true
    const res = await api.get('/users/me')
    profile.value = {
      username: res.data.username || '',
      email: res.data.email || '',
      whatsAppUrl: res.data.whatsAppUrl || '',
      avatarUrl: res.data.avatarUrl || ''
    }
  } catch (err) {
    console.error('Erreur chargement des réglages:', err)
  } finally {
    loading.value = false
  }
}

// Déclencher l'input d'upload caché
const triggerAvatarUpload = () => {
  avatarInput.value?.click()
}

// Gérer le changement d'avatar (compression + upload via mediaService)
const handleAvatarChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    isUploadingAvatar.value = true
    // Compression locale pour pas surcharger Supabase
    const compressedFile = await compressImage(file)
    // Upload sur ton service
    const { url } = await uploadImage(compressedFile)
    profile.value.avatarUrl = url
  } catch (err) {
    console.error('Erreur upload avatar:', err)
    alert('Échec de l\'upload de l\'image.')
  } finally {
    isUploadingAvatar.value = false
  }
}

// Sauvegarder les modifications du profil
const saveSettings = async () => {
  try {
    isSaving.value = true

    const payload = {
      username: profile.value.username,
      email: profile.value.email,
      whatsAppUrl: profile.value.whatsAppUrl,
      avatarUrl: profile.value.avatarUrl
    }

    // Adapte l'URL selon ton controller User côté .NET (ex: /users/update ou /users/me)
    await api.put('/users/me', payload)

    alert('Profil mis à jour avec succès ! 🎒')
    router.push('/profile')
  } catch (err) {
    console.error('Erreur lors de la sauvegarde du profil:', err)
    alert('Erreur lors de la mise à jour.')
  } finally {
    isSaving.value = false
  }
}

// Supprimer définitivement le compte
const deleteAccount = async () => {
  const firstConfirm = confirm('ATTENTION : Es-tu sûr de vouloir supprimer définitivement ton compte StreetPacker ? Toutes tes annonces et tes spots seront effacés.')
  if (!firstConfirm) return

  const secondConfirm = confirm('Dernière vérification : Cette action est irréversible. On supprime tout ? 🌊')
  if (!secondConfirm) return

  try {
    // Adapte la route selon ton API .NET
    await api.delete('/users/me')

    // Clear du localStorage et retour au login
    localStorage.clear()
    router.push('/login')
  } catch (err) {
    console.error('Erreur suppression compte:', err)
    alert('Impossible de supprimer le compte pour le moment.')
  }
}

onMounted(fetchProfileData)
</script>

<template>
  <div class="min-h-screen bg-[#F4F7F5] text-[#1E2E2A] pb-12 font-sans">

    <div class="bg-white border-b border-[#E4ECE9] p-4 sticky top-0 z-50 shadow-sm">
      <div class="max-w-xl mx-auto flex items-center gap-4">
        <button @click="router.push('/profile')" class="group p-2 bg-[#F4F7F5] rounded-full text-[#5C756E]/60 hover:text-[#00A896] transition-colors flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 class="text-lg font-medium">Configuration profil</h1>
          <p class="text-[10px] text-[#5C756E]/60 uppercase tracking-wider">Gère tes informations personnelles</p>
        </div>
      </div>
    </div>

    <div class="max-w-xl mx-auto p-4 mt-4">
      <div v-if="loading" class="text-center py-12 text-xs italic text-[#5C756E]/60">Chargement de tes paramètres...</div>

      <div v-else class="bg-white p-6 rounded-3xl border border-[#E4ECE9] shadow-[0_4px_20px_rgba(9,17,14,0.01)] space-y-6">

        <div class="flex flex-col items-center pb-4 border-b border-[#E4ECE9]">
          <div class="w-20 h-20 rounded-full border border-[#E4ECE9] bg-[#F4F7F5] flex items-center justify-center shadow-sm overflow-hidden mb-3 relative group">
            <img v-if="profile.avatarUrl" :src="profile.avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
            <span v-else class="text-xl font-light text-[#5C756E]">{{ profile.username ? profile.username.charAt(0).toUpperCase() : '?' }}</span>

            <div v-if="isUploadingAvatar" class="absolute inset-0 bg-[#09110E]/40 flex items-center justify-center text-white text-[10px] font-medium">...</div>
          </div>

          <button @click="triggerAvatarUpload" type="button" class="text-xs text-[#00A896] font-medium hover:underline">
            {{ isUploadingAvatar ? 'Téléversement...' : 'Modifier la photo' }}
          </button>
          <input type="file" ref="avatarInput" class="hidden" accept="image/*" @change="handleAvatarChange" />
        </div>

        <form @submit.prevent="saveSettings" class="space-y-5">
          <div class="relative border-b border-[#E4ECE9] focus-within:border-[#00A896] transition-colors pb-1">
            <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold mb-1">Nom d'utilisateur</label>
            <input v-model="profile.username" type="text" class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none h-8" required />
          </div>

          <div class="relative border-b border-[#E4ECE9] focus-within:border-[#00A896] transition-colors pb-1">
            <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold mb-1">Adresse Email</label>
            <input v-model="profile.email" type="email" class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none h-8" required />
          </div>

          <div class="relative border-b border-[#E4ECE9] focus-within:border-[#00A896] transition-colors pb-1">
            <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold mb-1">Numéro WhatsApp (Format International)</label>
            <input v-model="profile.whatsAppUrl" type="text" placeholder="Ex: 32470123456" class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none h-8 placeholder-[#5C756E]/30" />
            <p class="text-[10px] text-[#5C756E]/60 mt-1">Utilisé par les autres acheteurs pour te contacter directement sur la Marketplace.</p>
          </div>

          <div class="flex gap-3 pt-4">
            <button type="submit" :disabled="isSaving" class="flex-1 h-12 bg-[#00A896] text-white font-medium rounded-xl text-sm active:scale-95 disabled:opacity-50 transition-all">
              {{ isSaving ? 'Enregistrement...' : 'Sauvegarder les modifications' }}
            </button>
          </div>
        </form>

        <div class="pt-6 border-t border-[#E4ECE9]">
          <h2 class="text-xs uppercase tracking-[0.15em] text-[#FF6B6B] font-bold mb-2">Zone de danger</h2>
          <p class="text-xs text-[#5C756E]/70 mb-4">Si tu supprimes ton compte, toutes tes données stockées sur StreetPacker seront définitivement effacées.</p>
          <button @click="deleteAccount" type="button" class="h-10 px-4 border border-[#FF6B6B]/30 hover:border-[#FF6B6B] text-[#FF6B6B] rounded-xl text-xs font-medium active:scale-95 transition-all">
            Supprimer mon compte
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
</style>