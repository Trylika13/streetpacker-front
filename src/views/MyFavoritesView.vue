<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../api/axios'

interface FavoriteSpot {
  id: string | number;
  title: string;
  description: string;
}

interface FavoriteAd {
  adId: string | number;
  title: string;
  price: number;
  locationArea: string;
  contactLink: string;
}

const router = useRouter()
const route = useRoute()

// On détecte l'onglet actif grâce à la query string (?tab=ads ou ?tab=spots), par défaut 'spots'
const activeTab = ref(route.query.tab === 'ads' ? 'ads' : 'spots')
const loading = ref(true)

const favoriteSpots = ref<FavoriteSpot[]>([])
const favoriteAds = ref<FavoriteAd[]>([])

// Supprimer un spot des favoris
const removeSpotFavorite = async (spotId: string | number) => {
  try {
    await api.delete(`/spots/${spotId}/favorite`) // Adapte si ton endpoint .NET est différent
    favoriteSpots.value = favoriteSpots.value.filter(s => s.id !== spotId)
  } catch (err) {
    console.error('Erreur suppression favori spot:', err)
  }
}

// Supprimer une annonce des favoris
const removeAdFavorite = async (adId: string | number) => {
  try {
    await api.delete(`/Ads/${adId}/favorite`) // Adapte si ton endpoint .NET est différent
    favoriteAds.value = favoriteAds.value.filter(a => a.adId !== adId)
  } catch (err) {
    console.error('Erreur suppression favori annonce:', err)
  }
}

// Génération du lien WhatsApp ou Mailto selon ce que l'API a stocké
const generateContactLink = (contact: string, adTitle: string) => {
  if (!contact) return '#'
  const message = `Bonjour, je viens de voir ton annonce pour "${adTitle}" dans mes favoris StreetPacker...`

  if (contact.includes('@')) {
    return `mailto:${contact}?subject=${encodeURIComponent('StreetPacker - Annonce')}&body=${encodeURIComponent(message)}`
  }

  const cleanNumber = contact.replace(/[^0-9]/g, '')
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
}

const fetchFavorites = async () => {
  try {
    loading.value = true
    const [spotsRes, adsRes] = await Promise.all([
      api.get('/spots/favorites'), // Adapte tes routes d'API .NET au besoin
      api.get('/Ads/favorites')
    ])
    favoriteSpots.value = spotsRes.data || []
    favoriteAds.value = adsRes.data || []
  } catch (err) {
    console.error('Erreur lors du chargement des favoris:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchFavorites)
</script>

<template>
  <div class="min-h-screen bg-[#F4F7F5] text-[#1E2E2A] pb-12 font-sans">

    <!-- HEADER STICKY -->
    <div class="bg-white border-b border-[#E4ECE9] p-4 sticky top-0 z-50 shadow-sm">
      <div class="max-w-4xl mx-auto flex items-center gap-4">
        <button @click="router.push('/profile')" class="group p-2 bg-[#F4F7F5] rounded-full text-[#5C756E]/60 hover:text-[#00A896] transition-colors flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 class="text-lg font-medium">Mes Favoris</h1>
          <p class="text-[10px] text-[#5C756E]/60 uppercase tracking-wider">Tes coups de cœur StreetPacker</p>
        </div>
      </div>
    </div>

    <!-- SÉLECTEUR D'ONGLETS -->
    <div class="max-w-4xl mx-auto mt-6 px-4">
      <div class="flex gap-6 border-b border-[#E4ECE9]">
        <button @click="activeTab = 'spots'" :class="activeTab === 'spots' ? 'text-[#00A896] border-b-2 border-[#00A896]' : 'text-[#5C756E]/40'" class="pb-2 text-xs font-semibold uppercase tracking-wider outline-none flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Spots sauvages ({{ favoriteSpots.length }})
        </button>
        <button @click="activeTab = 'ads'" :class="activeTab === 'ads' ? 'text-[#00A896] border-b-2 border-[#00A896]' : 'text-[#5C756E]/40'" class="pb-2 text-xs font-semibold uppercase tracking-wider outline-none flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          Matériel Marketplace ({{ favoriteAds.length }})
        </button>
      </div>
    </div>

    <!-- ZONE DE LISTES RESPONSIVE -->
    <div class="max-w-4xl mx-auto p-4 mt-2">
      <div v-if="loading" class="text-center py-12 text-xs italic text-[#5C756E]/60">Chargement de tes favoris...</div>

      <div v-else>
        <!-- Onglet : Spots Favoris -->
        <div v-if="activeTab === 'spots'" class="space-y-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
          <div v-if="favoriteSpots.length === 0" class="text-center py-12 sm:col-span-2 text-[#5C756E]/40 italic text-xs">Aucun spot mis en favori pour l'instant.</div>

          <div v-for="spot in favoriteSpots" :key="spot.id" class="bg-white p-4 rounded-2xl border border-[#E4ECE9] flex items-center justify-between gap-4 shadow-sm hover:border-[#00A896]/20 transition-colors">
            <div class="min-w-0 flex-1">
              <h4 class="font-medium text-sm text-[#1E2E2A] truncate">{{ spot.title }}</h4>
              <p class="text-xs text-[#5C756E]/70 truncate mt-0.5">{{ spot.description }}</p>
            </div>
            <button @click="removeSpotFavorite(spot.id)" class="p-2 text-[#FF6B6B] hover:bg-red-50 rounded-full transition-colors" title="Retirer des favoris">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </button>
          </div>
        </div>

        <!-- Onglet : Annonces Favorites -->
        <div v-if="activeTab === 'ads'" class="space-y-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
          <div v-if="favoriteAds.length === 0" class="text-center py-12 sm:col-span-2 text-[#5C756E]/40 italic text-xs">Aucune annonce enregistrée dans tes favoris.</div>

          <div v-for="ad in favoriteAds" :key="ad.adId" class="bg-white p-4 rounded-2xl border border-[#E4ECE9] flex items-center justify-between gap-4 shadow-sm hover:border-[#00A896]/20 transition-colors">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold text-[#00A896] bg-[#00A896]/10 px-1.5 py-0.5 rounded">{{ ad.price }} $</span>
                <h4 class="font-medium text-sm text-[#1E2E2A] truncate">{{ ad.title }}</h4>
              </div>
              <p class="text-xs text-[#5C756E]/70 truncate mt-1">📍 {{ ad.locationArea }}</p>

              <a :href="generateContactLink(ad.contactLink, ad.title)" target="_blank" class="inline-flex items-center gap-1 text-[11px] font-medium text-[#00A896] mt-2 hover:underline">
                Contacter le vendeur
                <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
              </a>
            </div>

            <button @click="removeAdFavorite(ad.adId)" class="p-2 text-[#FF6B6B] hover:bg-red-50 rounded-full transition-colors" title="Retirer des favoris">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
</style>