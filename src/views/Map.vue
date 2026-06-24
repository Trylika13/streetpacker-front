<template>
  <div class="relative w-full h-full overflow-hidden bg-[#F4F7F5] text-[#1E2E2A] font-sans selection:bg-[#00A896]/20">
    <div ref="mapContainer" class="w-full h-full absolute inset-0 z-0"></div>

    <div class="absolute top-[calc(12px+env(safe-area-inset-top))] left-0 right-0 z-[1000] px-4 w-full max-w-md lg:max-w-5xl lg:px-8 mx-auto pointer-events-none">
      <div class="w-full flex gap-2 overflow-x-auto lg:overflow-visible lg:flex-wrap lg:justify-start no-scrollbar pointer-events-auto py-1">
        <button @click="selectedTag = null" :class="!selectedTag ? 'bg-[#00A896] text-white border-[#00A896]' : 'bg-white/90 text-[#1E2E2A] border-[#E4ECE9]'" class="px-4 h-9 backdrop-blur-md border text-xs font-medium rounded-full shadow-sm transition-all whitespace-nowrap active:scale-95">
          Tous les lieux
        </button>
        <button v-for="tag in availableTags" :key="tag.id" @click="selectedTag = tag.name" :class="selectedTag === tag.name ? 'bg-[#00A896] text-white border-[#00A896]' : 'bg-white/90 text-[#1E2E2A] border-[#E4ECE9]'" class="px-4 h-9 backdrop-blur-md border text-xs font-medium rounded-full shadow-sm transition-all whitespace-nowrap active:scale-95">
          {{ tag.name }}
        </button>
      </div>
    </div>

    <transition enter-active-class="transform transition ease-out duration-300" :enter-from-class="isLaptop ? '-translate-x-full' : 'translate-y-full'" :enter-to-class="isLaptop ? 'translate-x-0' : 'translate-y-0'" leave-active-class="transform transition ease-in duration-200" :leave-from-class="isLaptop ? 'translate-x-0' : 'translate-y-0'" :leave-to-class="isLaptop ? '-translate-x-full' : 'translate-y-full'">
      <SpotDetailCard v-if="selectedSpot" :spot="selectedSpot" :is-copied="isCopied" :is-owner="isOwner(selectedSpot)" :is-admin="isAdmin" @close="selectedSpot = null" @vote="handleVote" @copy-coords="handleCopyCoords" @toggle-favorite="handleToggleFavorite" @delete="handleDeleteSpot" />
    </transition>

    <transition enter-active-class="transform transition ease-out duration-300" :enter-from-class="isLaptop ? '-translate-x-full' : 'translate-y-full'" :enter-to-class="isLaptop ? 'translate-x-0' : 'translate-y-0'" leave-active-class="transform transition ease-in duration-200" :leave-from-class="isLaptop ? 'translate-x-0' : 'translate-y-0'" :leave-to-class="isLaptop ? '-translate-x-full' : 'translate-y-full'">
      <SpotCreateForm v-if="newSpotCoords" :coords="newSpotCoords" :available-tags="availableTags" :is-submitting="isSubmitting" @close="emit('close-form')" @submit="handleCreateSpot" />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import { config, GeolocateControl, Map, Marker } from '@maptiler/sdk'
import api from '../api/axios'
import { useAuth } from '../stores/auth'
import SpotDetailCard from '../components/SpotDetailCard.vue'
import SpotCreateForm from '../components/SpotCreateForm.vue'
import '@maptiler/sdk/dist/maptiler-sdk.css'

interface Spot { id: string; title: string; description: string; latitude: number; longitude: number; imageUrl?: string; freshnessScore: number; userId: string; username?: string; isFavorite?: boolean; }
interface Tag { id: string; name: string; }

const props = defineProps<{ spots: Spot[]; isAddingMode: boolean; newSpotCoords: { lat: number; lng: number } | null; }>()
const emit = defineEmits<{(e: 'coords-captured', coords: { lat: number; lng: number }): void; (e: 'close-form'): void; (e: 'spot-created'): void;}>()

const mapContainer = ref<HTMLDivElement | null>(null)
const authStore = useAuth()

let mapInstance: Map | null = null
let mapMarkers: Marker[] = []

const selectedSpot = ref<Spot | null>(null)
const isLaptop = ref(false)
const isSubmitting = ref(false)
const isCopied = ref(false)
const selectedTag = ref<string | null>(null)
const availableTags = ref<Tag[]>([])

const isAdmin = computed(() => authStore.user?.roles?.includes('Admin') || false)
const isOwner = (spot: Spot | null) => spot ? authStore.user?.id === spot.userId : false
const checkScreenSize = () => { isLaptop.value = window.innerWidth >= 1024 }

// Filtrage local des spots (calculé sur base des props)
const filteredSpots = computed(() => {
  if (!props.spots || !Array.isArray(props.spots)) return []
  if (!selectedTag.value) return props.spots
  return props.spots.filter(spot => {
    if (!spot) return false
    const tagsList = (spot as any).tags || (spot as any).Tags || []
    return tagsList.includes(selectedTag.value)
  })
})

const loadSpotTags = async () => {
  try { const res = await api.get('/spots/tags'); availableTags.value = res.data }
  catch (err) { console.error(err) }
}

// Récupération autonome si les props font défaut lors de la navigation interne
const fetchSpotsBackup = async () => {
  try {
    const res = await api.get('/spots')
    const spotsData = res.data

    if (!mapInstance) return
    const spotsToDisplay = !selectedTag.value
        ? spotsData
        : spotsData.filter((s: any) => {
          const tagsList = s.tags || s.Tags || []
          return tagsList.includes(selectedTag.value)
        })

    renderMarkers(spotsToDisplay)
  } catch (err) {
    console.error("Erreur backup fetch:", err)
  }
}

// Fonction unique pour poser les marqueurs sur la carte
const renderMarkers = (spotsList: Spot[]) => {
  if (!mapInstance) return
  mapMarkers.forEach(m => m.remove())
  mapMarkers = []

  spotsList.forEach(spot => {
    if (spot && spot.longitude && spot.latitude) {
      let markerColor = spot.freshnessScore < 25 ? "#FF6B6B" : spot.freshnessScore < 75 ? "#F59E0B" : "#00A896"
      const marker = new Marker({ color: markerColor }).setLngLat([spot.longitude, spot.latitude]).addTo(mapInstance!)

      marker.getElement().addEventListener('click', (e) => {
        e.stopPropagation()
        if (props.isAddingMode) return
        selectedSpot.value = spot
        mapInstance!.flyTo({ center: [spot.longitude, spot.latitude], zoom: 15, padding: isLaptop.value ? { left: 100 } : { bottom: 250 }, essential: true })
      })
      mapMarkers.push(marker)
    }
  })
}

const displaySpots = () => {
  renderMarkers(filteredSpots.value)
}

onMounted(async () => {
  config.apiKey = (import.meta as any).env.VITE_MAPTILER_KEY
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  loadSpotTags()

  if (mapInstance) {
    try { mapInstance.remove() } catch (e) {}
    mapInstance = null
  }

  await nextTick()

  if (mapContainer.value) {
    mapInstance = new Map({
      container: mapContainer.value,
      style: 'hybrid-v4',
      center: [5.694040, 50.679083],
      zoom: 13,
      navigationControl: false,
      geolocateControl: false,
      trackResize: true
    })

    const geolocate = new GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserLocation: true
    })
    mapInstance.addControl(geolocate)

    mapInstance.on('load', () => {
      mapInstance!.resize()
      geolocate.trigger()

      // Si le parent fournit déjà les éléments, on affiche. Sinon, refresh immédiat.
      if (props.spots && props.spots.length > 0) {
        displaySpots()
      } else {
        fetchSpotsBackup()
      }

      mapInstance!.on('click', (e) => {
        if (props.isAddingMode) emit('coords-captured', { lat: e.lngLat.lat, lng: e.lngLat.lng })
        else selectedSpot.value = null
      })
    })
  }
})

watch(filteredSpots, () => {
  if (mapInstance && mapInstance.loaded()) displaySpots()
}, { deep: true })

watch(() => props.isAddingMode, (val) => { if (mapContainer.value) mapContainer.value.style.cursor = val ? 'crosshair' : '' })

const handleVote = async (isUpvote: boolean) => {
  if (!selectedSpot.value) return
  try {
    const res = await api.post(`/Spots/${selectedSpot.value.id}/vote?isUpvote=${isUpvote}`)
    selectedSpot.value.freshnessScore = res.data.freshnessScore ?? res.data.FreshnessScore
    displaySpots()
  } catch (err) { console.error(err) }
}

const handleCopyCoords = async () => {
  if (!selectedSpot.value) return
  try {
    await navigator.clipboard.writeText(`${selectedSpot.value.latitude},${selectedSpot.value.longitude}`)
    isCopied.value = true; setTimeout(() => { isCopied.value = false }, 2000)
  } catch (err) { console.error(err) }
}

const handleToggleFavorite = async () => {
  if (!selectedSpot.value) return
  try {
    await api.post(`/Spots/${selectedSpot.value.id}/favorite`)
    selectedSpot.value.isFavorite = !selectedSpot.value.isFavorite
  } catch (err) { console.error(err) }
}

const handleCreateSpot = async (formData: any) => {
  if (!props.newSpotCoords) return
  try {
    isSubmitting.value = true
    await api.post('/spots', { ...formData, latitude: props.newSpotCoords.lat, longitude: props.newSpotCoords.lng })
    emit('spot-created')
    fetchSpotsBackup()
  } catch (err) { console.error(err) }
  finally { isSubmitting.value = false }
}

const handleDeleteSpot = async () => {
  if (!selectedSpot.value) return
  if (!confirm(isAdmin.value ? "MODE ADMIN : Supprimer ?" : "Supprimer ton spot ?")) return
  try {
    const endpoint = isAdmin.value ? `/spots/admin/${selectedSpot.value.id}` : `/spots/${selectedSpot.value.id}`
    await api.delete(endpoint)
    selectedSpot.value = null
    emit('spot-created')
    fetchSpotsBackup()
  } catch (err) { console.error(err) }
}

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)

  // 1. On nettoie les marqueurs
  mapMarkers.forEach(m => m.remove())
  mapMarkers = []

  // 2. On désactive temporairement TOUS les logs pour étouffer le .remove() de MapTiler
  const silentLog = () => {}
  const realWarn = console.warn
  const realError = console.error
  const realLog = console.log

  console.warn = silentLog
  console.error = silentLog
  console.log = silentLog

  // 3. On détruit la carte dans un silence radio complet
  if (mapInstance) {
    try {
      mapInstance.remove()
    } catch (e) {
      // Évitera tout blocage si le SDK râle en tâche de fond
    }
    mapInstance = null
  }

  // 4. On restaure immédiatement la console normale pour le reste de l'application
  console.warn = realWarn
  console.error = realError
  console.log = realLog
})
</script>

<style scoped>
:deep(.maplibregl-ctrl-bottom-right), :deep(.maplibregl-ctrl-bottom-left) { display: none !important; }
:deep(.maplibregl-ctrl-top-right) { margin-top: calc(75px + env(safe-area-inset-top)) !important; }
@media (min-width: 1024px) { :deep(.maplibregl-ctrl-top-right) { margin-top: 16px !important; margin-right: 24px !important; } }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
:deep(.maplibregl-user-location-accuracy-circle) {
  display: none !important;
}
</style>