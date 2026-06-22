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
    const compressedFile = await compressImage(file)
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

    await api.put('/users/me', payload)

    alert('Profil mis à jour avec succès.')
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
  const firstConfirm = confirm('ATTENTION : Confirmer la suppression définitive de ton compte StreetPacker ? Toutes tes annonces et tes spots seront effacés.')
  if (!firstConfirm) return

  const secondConfirm = confirm('Dernière vérification : Cette action est irréversible. Confirmer la suppression globale ?')
  if (!secondConfirm) return

  try {
    await api.delete('/users/me')
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
  <div class="min-h-screen bg-[#F4F7F5] text-[#1E2E2A] pb-12 font-sans selection:bg-[#00A896]/10">

    <div class="bg-white border-b border-[#E4ECE9] pb-4 pt-[calc(12px+env(safe-area-inset-top))] px-4 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
      <div class="max-w-5xl mx-auto flex items-center gap-4">
        <button @click="router.push('/profile')" class="group p-2 bg-[#F4F7F5] rounded-full text-[#5C756E]/60 hover:text-[#00A896] transition-colors flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 class="text-base font-medium">Configuration profil</h1>
          <p class="text-[9px] text-[#5C756E]/60 uppercase tracking-wider">Gère tes informations personnelles</p>
        </div>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-4 mt-6">
      <div v-if="loading" class="text-center py-12 text-xs italic text-[#5C756E]/60">
        Chargement de tes paramètres...
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

        <div class="bg-white p-6 rounded-[2rem] border border-[#E4ECE9] shadow-sm flex flex-col items-center justify-center text-center">
          <div class="w-24 h-24 rounded-full border border-[#E4ECE9] bg-[#F4F7F5] flex items-center justify-center shadow-sm overflow-hidden mb-4 relative group">
            <img v-if="profile.avatarUrl" :src="profile.avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
            <span v-else class="text-2xl font-light text-[#5C756E]">{{ profile.username ? profile.username.charAt(0).toUpperCase() : '?' }}</span>

            <div v-if="isUploadingAvatar" class="absolute inset-0 bg-[#09110E]/50 flex items-center justify-center">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>

          <button @click="triggerAvatarUpload" type="button" class="text-xs text-[#00A896] font-medium hover:underline disabled:opacity-40" :disabled="isUploadingAvatar">
            {{ isUploadingAvatar ? 'Téléversement...' : 'Modifier la photo de profil' }}
          </button>
          <input type="file" ref="avatarInput" class="hidden" accept="image/*" @change="handleAvatarChange" />
        </div>

        <div class="md:col-span-2 space-y-6">

          <div class="bg-white p-6 md:p-8 rounded-[2rem] border border-[#E4ECE9] shadow-sm">
            <form @submit.prevent="saveSettings" class="space-y-6">

              <div class="bg-[#F4F7F5] rounded-xl px-4 py-2.5 border border-transparent focus-within:border-[#00A896]/20 focus-within:bg-white transition-all">
                <label class="block text-[9px] uppercase tracking-wider text-[#5C756E]/70 font-bold mb-0.5">Nom d'utilisateur</label>
                <input v-model="profile.username" type="text" class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none font-medium h-7" required />
              </div>

              <div class="bg-[#F4F7F5] rounded-xl px-4 py-2.5 border border-transparent focus-within:border-[#00A896]/20 focus-within:bg-white transition-all">
                <label class="block text-[9px] uppercase tracking-wider text-[#5C756E]/70 font-bold mb-0.5">Adresse Email</label>
                <input v-model="profile.email" type="email" class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none font-medium h-7" required />
              </div>

              <div class="bg-[#F4F7F5] rounded-xl px-4 py-2.5 border border-transparent focus-within:border-[#00A896]/20 focus-within:bg-white transition-all">
                <label class="block text-[9px] uppercase tracking-wider text-[#5C756E]/70 font-bold mb-0.5">Numéro WhatsApp (Format International)</label>
                <input v-model="profile.whatsAppUrl" type="text" placeholder="Ex: 32470123456" class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none font-medium h-7 placeholder-[#5C756E]/30" />
                <p class="text-[10px] text-[#5C756E]/60 mt-1.5 leading-normal">Utilisé par les autres voyageurs pour amorcer l'échange sur le marketplace.</p>
              </div>

              <div class="pt-2">
                <button type="submit" :disabled="isSaving || isUploadingAvatar" class="w-full h-12 bg-[#00A896] text-white font-medium rounded-xl text-xs tracking-wider uppercase active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center">
                  <span v-if="isSaving" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span v-else>Enregistrer les modifications</span>
                </button>
              </div>
            </form>
          </div>

          <div class="bg-white p-6 md:p-8 rounded-[2rem] border border-[#E4ECE9] shadow-sm">
            <h2 class="text-xs uppercase tracking-[0.15em] text-[#FF6B6B] font-bold mb-2">Zone de danger</h2>
            <p class="text-xs text-[#5C756E]/70 mb-5 leading-relaxed">Si tu supprimes ton compte, toutes tes données stockées sur StreetPacker (annonces en cours, favoris et repères cartographiques) seront définitivement effacées.</p>
            <button @click="deleteAccount" type="button" class="h-11 px-5 border border-[#FF6B6B]/30 hover:border-[#FF6B6B] text-[#FF6B6B] rounded-xl text-xs font-medium tracking-wider uppercase active:scale-[0.98] transition-all">
              Supprimer mon compte
            </button>
          </div>

        </div>

      </div>
    </div>

  </div>
</template>