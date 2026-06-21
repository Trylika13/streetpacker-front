<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()

// Variables réactives
const ads = ref([])
const loading = ref(true)
const errorMessage = ref('')
const currentUserId = localStorage.getItem('userId')

// Traquer les IDs des annonces favorites de l'utilisateur
const favoriteAdIds = ref(new Set())

const selectedTag = ref(null)
const availableTags = ref([])

const loadMarketplaceTags = async () => {
  try {
    const res = await api.get('/Ads/tags')
    availableTags.value = res.data
  } catch (err) {
    console.error("Erreur lors du chargement des tags marketplace :", err)
  }
}

const filteredAds = computed(() => {
  if (!selectedTag.value) return ads.value

  return ads.value.filter(ad => {
    // On récupère le tableau peu importe s'il s'appelle tags ou Tags
    const tagsList = ad.tags || ad.Tags || []

    // On s'assure que chaque élément est comparé proprement en minuscules
    return tagsList.some(t => t.toLowerCase() === selectedTag.value.toLowerCase())
  })
})

// Charger les annonces et les favoris en parallèle
const fetchAdsAndFavorites = async () => {
  try {
    loading.value = true

    // On lance les deux requêtes en même temps
    const [adsResponse, favsResponse] = await Promise.all([
      api.get('/Ads'),
      api.get('/Ads/favorites').catch(() => ({ data: [] })) // Fallback si pas connecté ou erreur
    ])

    // Stocker les IDs des favoris dans un Set pour une recherche ultra-rapide (O(1))
    if (favsResponse.data) {
      favoriteAdIds.value = new Set(favsResponse.data.map(fav => fav.adId))
    }

    // Associer l'état initial du favori à chaque annonce
    ads.value = (adsResponse.data || []).map(ad => ({
      ...ad,
      isFavorite: favoriteAdIds.value.has(ad.adId)
    }))

  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
    errorMessage.value = 'Impossible de charger le marketplace. Réessaye plus tard.'
  } finally {
    loading.value = false
  }
}

// Ajouter / Retirer une annonce des favoris
const toggleFavoriteAd = async (ad) => {
  try {
    const res = await api.post(`/Ads/${ad.adId}/favorite`)
    ad.isFavorite = res.data.isFavorite
  } catch (err) {
    console.error("Erreur lors de la modification du favori :", err)
  }
}

// Supprimer une annonce
const deleteAd = async (adId) => {
  if (!confirm('Es-tu sûr de vouloir retirer cette annonce du marketplace ?')) return

  try {
    await api.delete(`/Ads/${adId}`)
    ads.value = ads.value.filter(ad => ad.adId !== adId)
  } catch (error) {
    console.error('Erreur suppression:', error)
    alert('Une erreur est survenue lors de la suppression.')
  }
}

const generateContactLink = (contact, adTitle) => {
  if (!contact || contact === "Pas de contact configuré") return '#'

  const message = `Bonjour, je viens de voir ton annonce pour "${adTitle}" sur StreetPacker. Est-elle toujours disponible ?`

  if (contact.includes('@')) {
    return `mailto:${contact}?subject=${encodeURIComponent('StreetPacker - Annonce : ' + adTitle)}&body=${encodeURIComponent(message)}`
  }

  const cleanNumber = contact.replace(/[^0-9]/g, '')
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
}

onMounted(() => {
  fetchAdsAndFavorites()
  loadMarketplaceTags() // 👑 Lancement du chargement des tags
})
</script>

<template>
  <div class="min-h-screen bg-[#F4F7F5] text-[#1E2E2A] pb-24 lg:pb-8 font-sans selection:bg-[#00A896]/20 relative">

    <div class="bg-white border-b border-[#E4ECE9] p-4 pt-6 lg:pt-8 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
      <div class="max-w-7xl mx-auto flex items-center justify-between px-2">

        <div class="flex items-center gap-4">
          <button
              @click="router.push('/dashboard')"
              class="group p-2 bg-[#F4F7F5] rounded-full text-[#5C756E]/60 hover:text-[#00A896] transition-colors flex items-center justify-center"
              title="Retour au dashboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div>
            <h1 class="text-xl lg:text-2xl font-medium tracking-tight text-[#1E2E2A]">Marketplace</h1>
            <p class="text-[9px] text-[#00A896] font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1">
              🎒 Matériel & Bons plans de nomades
            </p>
          </div>
        </div>

        <button class="p-2 text-[#5C756E]/60 hover:text-[#00A896] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

      </div>
    </div>

    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-4">
      <div class="flex gap-2 overflow-x-auto no-scrollbar py-1">
        <button
            @click="selectedTag = null"
            :class="!selectedTag ? 'bg-[#00A896] text-white border-[#00A896]' : 'bg-white text-[#1E2E2A] border-[#E4ECE9]'"
            class="px-4 h-9 border text-xs font-medium rounded-full shadow-sm transition-all whitespace-nowrap active:scale-95"
        >
          Tout l'équipement
        </button>

        <button
            v-for="tag in availableTags"
            :key="tag.id"
            @click="selectedTag = tag.name"
            :class="selectedTag === tag.name ? 'bg-[#00A896] text-white border-[#00A896]' : 'bg-white text-[#1E2E2A] border-[#E4ECE9]'"
            class="px-4 h-9 border text-xs font-medium rounded-full shadow-sm transition-all whitespace-nowrap active:scale-95"
        >
          {{ tag.name }}
        </button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto p-3 sm:p-6 mt-1">

      <div v-if="loading" class="text-center py-20 text-sm font-medium text-[#5C756E]/60 italic">
        Recherche des meilleures offres en cours... 🌊
      </div>

      <div v-if="errorMessage" class="bg-red-50 border border-red-100 text-[#FF6B6B] p-4 rounded-2xl text-xs max-w-md mx-auto text-center shadow-sm">
        {{ errorMessage }}
      </div>

      <div v-if="!loading && filteredAds.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
            v-for="ad in filteredAds"
            :key="ad.adId"
            class="bg-white rounded-2xl border border-[#E4ECE9] overflow-hidden shadow-sm hover:border-[#00A896]/30 transition-all duration-200 flex flex-col justify-between group relative"
        >
          <div class="aspect-square w-full bg-[#F4F7F5] relative overflow-hidden border-b border-[#E4ECE9]">
            <img
                src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=600&auto=format&fit=crop"
                alt="Ad image"
                class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            />

            <span class="absolute bottom-2 left-2 bg-[#1E2E2A]/70 backdrop-blur-sm text-white text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md font-medium">
              📍 {{ ad.locationArea }}
            </span>

            <div class="absolute top-2 right-2 flex items-center gap-1.5 z-10">
              <button
                  @click.stop="toggleFavoriteAd(ad)"
                  class="bg-white/95 backdrop-blur-sm shadow-sm p-2 rounded-full transition-all duration-150 active:scale-90"
                  :class="ad.isFavorite ? 'text-[#FF6B6B]' : 'text-[#5C756E] hover:text-[#FF6B6B]'"
                  :title="ad.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" :fill="ad.isFavorite ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              <button
                  v-if="ad.userId === currentUserId"
                  @click.stop="deleteAd(ad.adId)"
                  class="bg-white/95 backdrop-blur-sm text-[#5C756E] hover:bg-[#FF6B6B] hover:text-white p-2 rounded-full shadow-sm transition-all duration-150 active:scale-90"
                  title="Supprimer mon annonce"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div class="p-3 flex flex-col justify-between flex-grow">
            <div>
              <div class="flex items-center justify-between gap-1">
                <p class="text-base font-semibold text-[#1E2E2A] tracking-tight">
                  {{ ad.price }} $
                </p>
                <div v-if="ad.tags && ad.tags.length" class="flex gap-1 overflow-hidden max-w-[60%]">
                  <span v-for="tName in ad.tags" :key="tName" class="text-[8px] bg-[#F4F7F5] text-[#5C756E] px-1.5 py-0.5 rounded-md truncate font-medium border border-[#E4ECE9]">
                    {{ tName }}
                  </span>
                </div>
              </div>
              <h2 class="text-xs text-[#5C756E] font-normal truncate mt-1">
                {{ ad.title }}
              </h2>
            </div>

            <div class="mt-3 pt-2.5 border-t border-[#E4ECE9] flex justify-between items-center">
              <span class="text-[9px] uppercase tracking-wider text-[#5C756E]/40 font-semibold">Détails</span>
              <a
                  :href="generateContactLink(ad.contactLink, ad.title)"
                  target="_blank"
                  @click.stop
                  class="text-xs font-medium text-[#00A896] hover:text-[#00A896]/80 flex items-center gap-1 transition-colors"
              >
                Contacter
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>

      <div v-if="!loading && filteredAds.length === 0" class="text-center py-20 text-[#5C756E]/50 italic text-xs bg-white rounded-2xl border border-[#E4ECE9] p-6 max-w-sm mx-auto">
        Aucun équipement ne correspond à cette catégorie pour le moment.
      </div>

    </div>

    <div class="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[2000]">
      <button
          @click="router.push('/create-ad')"
          class="w-14 h-14 bg-[#00A896] hover:bg-[#00A896]/90 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
          title="Ajouter une annonce"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>

  </div>
</template>

<style scoped>
/* Masquer la barre de défilement pour les filtres horizontaux */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>