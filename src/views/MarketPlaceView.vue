<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()

// Variables réactives fondamentales
const ads = ref([])
const loading = ref(false)
const loadingMore = ref(false) // Traquer le chargement du paquet suivant
const errorMessage = ref('')
const currentUserId = localStorage.getItem('userId')
const favoriteAdIds = ref(new Set())

// Variables de pagination
const currentPage = ref(1)
const pageSize = ref(12) // Paquets de 12 annonces
const hasMoreAds = ref(true) // Est-ce qu'il reste des annonces à charger sur l'API ?

const selectedTag = ref(null)
const availableTags = ref([])

// Redirection vers la page de détails
const goToAdDetail = (ad) => {
  const id = ad.adId || ad.id || ad.Id
  if (!id) {
    console.error("Impossible de trouver l'ID de l'annonce :", ad)
    return
  }
  router.push(`/marketplace/${id}`)
}

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
    const tagsList = ad.tags || ad.Tags || []
    return tagsList.some(t => t.toLowerCase() === selectedTag.value.toLowerCase())
  })
})

// Chargement initial (Page 1)
const fetchInitialAdsAndFavorites = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    currentPage.value = 1
    hasMoreAds.value = true

    // On récupère les favoris et la première page d'annonces
    const [adsResponse, favsResponse] = await Promise.all([
      api.get(`/Ads?page=${currentPage.value}&pageSize=${pageSize.value}`),
      api.get('/Ads/favorites').catch(() => ({ data: [] }))
    ])

    if (favsResponse.data) {
      favoriteAdIds.value = new Set(favsResponse.data.map(fav => fav.adId))
    }

    const fetchedAds = adsResponse.data || []

    // Si l'API renvoie moins d'annonces que le pageSize, c'est qu'on a tout récupéré
    if (fetchedAds.length < pageSize.value) {
      hasMoreAds.value = false
    }

    ads.value = fetchedAds.map(ad => ({
      ...ad,
      isFavorite: favoriteAdIds.value.has(ad.adId)
    }))

  } catch (error) {
    console.error('Erreur lors du chargement initial:', error)
    errorMessage.value = 'Impossible de charger le marketplace. Réessaye plus tard.'
  } finally {
    loading.value = false
  }
}

// Charger le paquet d'annonces suivant (Page 2, 3, etc.)
const fetchMoreAds = async () => {
  // On bloque si un chargement est déjà en cours ou s'il n'y a plus rien à récupérer
  if (loadingMore.value || !hasMoreAds.value || loading.value) return

  try {
    loadingMore.value = true
    currentPage.value++

    const res = await api.get(`/Ads?page=${currentPage.value}&pageSize=${pageSize.value}`)
    const newAds = res.data || []

    if (newAds.length < pageSize.value) {
      hasMoreAds.value = false
    }

    // On ajoute les nouvelles annonces à la suite du tableau existant
    const mappedNewAds = newAds.map(ad => ({
      ...ad,
      isFavorite: favoriteAdIds.value.has(ad.adId)
    }))

    ads.value = [...ads.value, ...mappedNewAds]

  } catch (error) {
    console.error('Erreur lors du chargement des annonces suivantes:', error)
    currentPage.value-- // Reset la page en cas d'échec
  } finally {
    loadingMore.value = false
  }
}

// Détecter quand l'utilisateur scrolle tout en bas
const handleScroll = () => {
  const scrollHeight = document.documentElement.scrollHeight
  const scrollTop = document.documentElement.scrollTop
  const clientHeight = document.documentElement.clientHeight

  // Si on est à 50px ou moins du bas de la page, on déclenche le chargement
  if (scrollTop + clientHeight >= scrollHeight - 50) {
    fetchMoreAds()
  }
}

const toggleFavoriteAd = async (ad) => {
  try {
    const res = await api.post(`/Ads/${ad.adId}/favorite`)
    ad.isFavorite = res.data.isFavorite
  } catch (err) {
    console.error("Erreur lors de la modification du favori :", err)
  }
}

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

// Si l'utilisateur change de tag de filtre, on réinitialise pour éviter les conflits de listes complètes
watch(selectedTag, () => {
  fetchInitialAdsAndFavorites()
})

onMounted(() => {
  fetchInitialAdsAndFavorites()
  loadMarketplaceTags()

  // On écoute le scroll du navigateur
  window.addEventListener('scroll', handleScroll)
})
</script>
<template>
  <div class="min-h-screen bg-[#F4F7F5] text-[#1E2E2A] pb-24 lg:pb-8 font-sans selection:bg-[#00A896]/20 relative">

    <!-- HEADER DE L'APPLICATION -->
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
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Matériel & Bons plans de nomades
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

    <!-- FILTRES HORIZONTAUX (TAGS) -->
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

    <!-- GRILLE DES ANNONCES -->
    <div class="max-w-7xl mx-auto p-3 sm:p-6 mt-1">

      <!-- ÉTAT DE CHARGEMENT -->
      <div v-if="loading" class="text-center py-20 text-sm font-medium text-[#5C756E]/60 italic flex flex-col items-center justify-center gap-3">
        <svg class="animate-spin h-5 w-5 text-[#00A896]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Recherche des meilleures offres en cours...</span>
      </div>

      <!-- ÉTAT D'ERREUR -->
      <div v-if="errorMessage" class="bg-red-50 border border-red-100 text-[#FF6B6B] p-4 rounded-2xl text-xs max-w-md mx-auto text-center shadow-sm">
        {{ errorMessage }}
      </div>

      <!-- BOUCLE SUR LES ANNONCES FILTRÉES -->
      <div v-if="!loading && filteredAds.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">        <div
            v-for="ad in filteredAds"
            :key="ad.adId"
            @click="goToAdDetail(ad)"
            class="bg-white rounded-2xl border border-[#E4ECE9] overflow-hidden shadow-sm hover:border-[#00A896]/30 transition-all duration-200 flex flex-col justify-between group relative cursor-pointer"
        >
          <!-- IMAGE ET BOUTONS ACTIONS FLOTTANTS -->
          <div class="aspect-square w-full bg-[#F4F7F5] relative overflow-hidden border-b border-[#E4ECE9]">
            <img
                src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=600&auto=format&fit=crop"
                alt="Ad image"
                class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            />

            <span class="absolute bottom-2 left-2 bg-[#1E2E2A]/70 backdrop-blur-sm text-white text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5 text-[#00A896]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ ad.locationArea }}
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



          <div class="p-4 flex flex-col justify-between flex-grow bg-white">

            <!-- BLOC HAUT : Titre à gauche, Tag à droite au même niveau -->
            <div class="flex items-start justify-between gap-3">
              <!-- Le Titre (prend la place restante) -->
              <h2 class="text-base font-bold text-[#1E2E2A] tracking-tight line-clamp-2 leading-tight flex-1">
                {{ ad.title }}
              </h2>

              <!-- Le Tag (calé à droite, ne shrink pas) -->
              <span v-if="ad.tags && ad.tags.length" class="text-[9px] uppercase tracking-wider text-[#5C756E]/60 font-bold whitespace-nowrap mt-1">
                {{ ad.tags[0] }}
              </span>
              <span v-else class="text-[9px] uppercase tracking-wider text-[#5C756E]/60 font-bold whitespace-nowrap mt-1">
                Équipement
              </span>
            </div>

            <!-- BLOC BAS : Prix pur et action -->
            <div class="mt-5 flex justify-between items-center">
              <!-- Prix technique style badge -->
              <span class="text-xs font-bold text-[#1E2E2A] bg-[#F4F7F5] border border-[#E4ECE9] px-2.5 py-1 rounded-lg">
                {{ ad.price }} $
              </span>

              <!-- Flèche fine style Apple -->
              <div class="text-[#00A896] group-hover:translate-x-0.5 transition-transform duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>

          </div>        </div>
      </div>

      <!-- AUCUN RÉSULTAT -->
      <div v-if="!loading && filteredAds.length === 0" class="text-center py-16 text-[#5C756E]/50 italic text-xs bg-white rounded-2xl border border-[#E4ECE9] p-6 max-w-sm mx-auto flex flex-col items-center gap-3 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#5C756E]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <span>Aucun équipement ne correspond à cette catégorie pour le moment.</span>
      </div>

    </div>

    <!-- BOUTON FLOTTANT AJOUTER ANNONCE -->
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
    <!-- PETIT SPINNER DE CHARGEMENT EN BAS DE PAGE (INFINITE SCROLL) -->
    <div v-if="loadingMore" class="w-full flex justify-center py-6">
      <svg class="animate-spin h-5 w-5 text-[#00A896]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

  </div>
</template>
<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>