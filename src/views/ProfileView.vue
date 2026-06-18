<template>
  <div class="min-h-screen bg-[#F4F7F5] text-[#1E2E2A] pb-24 lg:pb-0 font-sans lg:flex lg:items-stretch">

    <!-- SIDEBAR LEFT (DESKTOP) -->
    <div class="p-6 pt-8 bg-white border-b lg:border-b-0 lg:border-r border-[#E4ECE9] relative lg:w-80 lg:shrink-0 lg:flex lg:flex-col lg:h-screen lg:sticky lg:top-0 lg:pt-16">
      <div class="flex flex-col items-center mt-4 lg:mt-0 w-full">
        <!-- Bouton Retour -->
        <div class="absolute top-6 left-6">
          <button @click="router.push('/dashboard')" class="group p-2 bg-[#F4F7F5] rounded-full text-[#5C756E]/60 hover:text-[#00A896] transition-colors flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <!-- Profil -->
        <div class="w-20 h-20 rounded-full border border-[#E4ECE9] bg-[#F4F7F5] flex items-center justify-center shadow-sm overflow-hidden mb-3">
          <img v-if="user.avatarUrl" :src="user.avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
          <span v-else class="text-xl font-light text-[#5C756E]">{{ user.username ? user.username.charAt(0).toUpperCase() : '?' }}</span>
        </div>

        <h2 class="text-lg font-medium tracking-tight text-[#1E2E2A] text-center">{{ user.username }}</h2>
        <p class="text-[9px] text-[#00A896] font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Explorateur Nomade
        </p>
      </div>

      <!-- Déconnexion Desktop -->
      <div class="hidden lg:block w-full pt-6 border-t border-[#E4ECE9] mt-auto">
        <button @click="logout" class="w-full h-10 bg-[#F4F7F5] text-[#5C756E] border border-[#E4ECE9] rounded-xl font-medium text-xs tracking-wider active:scale-95 transition-all">Déconnexion</button>
      </div>
    </div>

    <!-- MAIN CONTENT (Grid Layout sur Laptop) -->
    <div class="flex-1 p-4 lg:p-12 lg:max-w-5xl mx-auto w-full flex flex-col justify-center">

      <h3 class="text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-bold mb-6 px-1 hidden lg:block">Tableau de bord</h3>

      <!-- Grid responsive : 1 col sur mobile, 2 col équilibrées sur laptop -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        <!-- COLONNE GAUCHE LAPTOP : MON ACTIVITÉ -->
        <div class="space-y-4">
          <h3 class="text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-bold px-1 lg:hidden">Mon Activité</h3>

          <div class="grid grid-cols-2 lg:grid-cols-1 gap-3">
            <!-- Tuile Spots (prend plus d'importance sur grand écran) -->
            <button @click="router.push('/profile/spots')" class="bg-white p-4 lg:p-6 rounded-2xl border border-[#E4ECE9] hover:border-[#00A896]/30 hover:-translate-y-0.5 hover:shadow-sm transition-all text-left active:scale-95 group relative overflow-hidden flex flex-col justify-between lg:h-32">
              <div>
                <div class="text-2xl lg:text-3xl font-medium text-[#1E2E2A] group-hover:text-[#00A896] transition-colors">{{ stats.spots }}</div>
                <div class="text-[11px] font-medium text-[#5C756E]/80 mt-0.5">Mes spots partagés</div>
              </div>
              <p class="hidden lg:block text-xs text-[#5C756E]/50 mt-2">Gère tes emplacements sauvages sur la carte</p>

              <div class="absolute top-4 right-4 text-[#5C756E]/30 group-hover:text-[#00A896] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </button>

            <!-- Tuile Annonces -->
            <button @click="router.push('/profile/ads')" class="bg-white p-4 lg:p-6 rounded-2xl border border-[#E4ECE9] hover:border-[#00A896]/30 hover:-translate-y-0.5 hover:shadow-sm transition-all text-left active:scale-95 group relative overflow-hidden flex flex-col justify-between lg:h-32">
              <div>
                <div class="text-2xl lg:text-3xl font-medium text-[#1E2E2A] group-hover:text-[#00A896] transition-colors">{{ stats.ads }}</div>
                <div class="text-[11px] font-medium text-[#5C756E]/80 mt-0.5">Mes annonces matériel</div>
              </div>
              <p class="hidden lg:block text-xs text-[#5C756E]/50 mt-2">Suis ou retire tes objets en vente sur le marketplace</p>

              <div class="absolute top-4 right-4 text-[#5C756E]/30 group-hover:text-[#00A896] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        <!-- COLONNE DROITE LAPTOP : FAVORIS & RÉGLAGES -->
        <div class="space-y-6">
          <!-- Sous-bloc Favoris -->
          <div>
            <h3 class="text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-bold mb-3 px-1">Mes Favoris</h3>
            <div class="bg-white rounded-2xl border border-[#E4ECE9] overflow-hidden shadow-[0_4px_20px_rgba(9,17,14,0.01)]">
              <!-- Spots Favoris -->
              <button @click="router.push('/profile/favorites?tab=spots')" class="w-full px-5 h-14 flex items-center justify-between border-b border-[#E4ECE9] hover:bg-[#F4F7F5]/50 active:bg-[#F4F7F5] transition-colors text-left text-sm group">
                <div class="flex items-center gap-3 text-[#1E2E2A]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#5C756E]/70 group-hover:text-[#00A896] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="font-medium">Spots sauvages mis de côté</span>
                </div>
                <div class="flex items-center gap-2 text-[#5C756E]/40 group-hover:text-[#00A896] transition-colors">
                  <span class="text-xs font-medium">{{ stats.favSpots }}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
                </div>
              </button>

              <!-- Annonces Favorites -->
              <button @click="router.push('/profile/favorites?tab=ads')" class="w-full px-5 h-14 flex items-center justify-between hover:bg-[#F4F7F5]/50 active:bg-[#F4F7F5] transition-colors text-left text-sm group">
                <div class="flex items-center gap-3 text-[#1E2E2A]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#5C756E]/70 group-hover:text-[#00A896] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span class="font-medium">Annonces matériel suivies</span>
                </div>
                <div class="flex items-center gap-2 text-[#5C756E]/40 group-hover:text-[#00A896] transition-colors">
                  <span class="text-xs font-medium">{{ stats.favAds }}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
                </div>
              </button>
            </div>
          </div>

          <!-- Sous-bloc Réglages -->
          <div>
            <h3 class="text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-bold mb-3 px-1">Réglages</h3>
            <div class="bg-white rounded-2xl border border-[#E4ECE9] overflow-hidden shadow-[0_4px_20px_rgba(9,17,14,0.01)]">
              <button @click="router.push('/profile/settings')" class="w-full px-5 h-14 flex items-center justify-between hover:bg-[#F4F7F5]/50 active:bg-[#F4F7F5] transition-colors text-left text-sm group">
                <div class="flex items-center gap-3 text-[#1E2E2A]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#5C756E]/70 group-hover:text-[#00A896] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="font-medium">Configuration du profil</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#5C756E]/40 group-hover:text-[#00A896] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- Déconnexion Mobile -->
      <button @click="logout" class="lg:hidden w-full h-12 bg-white text-[#FF6B6B] border border-[#E4ECE9] rounded-xl font-medium text-xs tracking-wider active:scale-95 transition-all pt-0.5 shadow-sm mt-6">
        Se déconnecter de l'aventure
      </button>
    </div>

  </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'

interface User {
  username: string;
  avatarUrl: string;
}

const router = useRouter()

// On initialise avec des structures par défaut pour un affichage immédiat
const user = ref<User>({ username: 'Backpacker', avatarUrl: '' })

const stats = ref({
  spots: 0,
  ads: 0,
  favSpots: 0,
  favAds: 0
})

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  router.push('/login')
}

const fetchProfileStats = async () => {
  // 1. Charger l'utilisateur (Infos de base)
  try {
    const userRes = await api.get('/users/me')
    user.value = userRes.data
  } catch (err) {
    console.error('Erreur chargement profil utilisateur:', err)
  }

  // 2. Charger les compteurs de favoris via tes nouveaux endpoints dédiés
  try {
    const [favSpotsRes, favAdsRes] = await Promise.all([
      api.get('/Spots/favorites'),
      api.get('/Ads/favorites')
    ])
    stats.value.favSpots = favSpotsRes.data?.length || 0
    stats.value.favAds = favAdsRes.data?.length || 0
  } catch (err) {
    console.error('Erreur chargement des compteurs de favoris:', err)
  }

  // 3. Charger les spots créés par l'utilisateur
  try {
    const spotsRes = await api.get('/Spots/my-spots')
    stats.value.spots = spotsRes.data?.length || 0
  } catch (err) {
    console.error('Erreur chargement mes spots:', err)
    stats.value.spots = 0
  }

  // 4. Charger les annonces créées par l'utilisateur
  try {
    const adsRes = await api.get('/Ads/my-ads') // URL passée en minuscules
    stats.value.ads = adsRes.data?.length || 0
  } catch (err) {
    console.error('Erreur chargement mes annonces:', err)
    stats.value.ads = 0
  }
}
onMounted(fetchProfileStats)
</script>
<style scoped>
</style>