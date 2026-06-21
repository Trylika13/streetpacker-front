<template>
  <div class="relative w-full h-full overflow-hidden bg-[#F4F7F5] font-sans selection:bg-[#00A896]/20">

    <div ref="mapContainer" class="w-full h-full absolute inset-0 z-0"></div>

    <div class="absolute top-[calc(12px+env(safe-area-inset-top))] left-0 right-0 z-[1000] px-4 w-full max-w-md mx-auto pointer-events-none">
      <div class="w-full flex gap-2 overflow-x-auto no-scrollbar pointer-events-auto py-1">

        <button
            @click="selectedTag = null"
            :class="!selectedTag ? 'bg-[#00A896] text-white border-[#00A896]' : 'bg-white/90 text-[#1E2E2A] border-[#E4ECE9]'"
            class="px-4 h-9 backdrop-blur-md border text-xs font-medium rounded-full shadow-sm transition-all whitespace-nowrap active:scale-95"
        >
          Tous les lieux
        </button>

        <button
            v-for="tag in availableTags"
            :key="tag.id"
            @click="selectedTag = tag.name"
            :class="selectedTag === tag.name ? 'bg-[#00A896] text-white border-[#00A896]' : 'bg-white/90 text-[#1E2E2A] border-[#E4ECE9]'"
            class="px-4 h-9 backdrop-blur-md border text-xs font-medium rounded-full shadow-sm transition-all whitespace-nowrap active:scale-95"
        >
          {{ tag.name }}
        </button>

      </div>
    </div>

    <transition
        enter-active-class="transform transition ease-out duration-300"
        :enter-from-class="isLaptop ? '-translate-x-full' : 'translate-y-full'"
        :enter-to-class="isLaptop ? 'translate-x-0' : 'translate-y-0'"
        leave-active-class="transform transition ease-in duration-200"
        :leave-from-class="isLaptop ? 'translate-x-0' : 'translate-y-0'"
        :leave-to-class="isLaptop ? '-translate-x-full' : 'translate-y-full'"
    >
      <div
          v-if="selectedSpot"
          class="absolute bottom-0 left-0 right-0 lg:top-0 lg:bottom-auto lg:right-auto z-[3000] bg-white border-t lg:border-t-0 lg:border-r border-[#E4ECE9] text-[#1E2E2A] rounded-t-[2.5rem] lg:rounded-t-none lg:rounded-r-[2.5rem] shadow-[0_-10px_40px_rgba(9,17,14,0.08)] lg:shadow-[10px_0_40px_rgba(9,17,14,0.05)] p-6 pb-8 lg:pt-24 w-full max-w-md mx-auto overflow-y-auto max-h-[60vh] lg:max-h-full lg:h-full no-scrollbar"
      >
        <div class="w-12 h-1 bg-[#E4ECE9] rounded-full mx-auto mb-5 lg:hidden"></div>

        <div class="flex justify-between items-start mb-4">
          <div>
            <h2 class="text-2xl font-light tracking-tight text-[#1E2E2A] leading-tight">
              {{ selectedSpot.title || selectedSpot.Title }}
            </h2>
            <p class="text-[10px] font-bold text-[#00A896] uppercase tracking-widest mt-1">
              Spot ajouté par {{ selectedSpot.username || selectedSpot.Username || selectedSpot.createdBy || 'un nomade' }}
            </p>
          </div>

          <button
              @click="selectedSpot = null"
              class="p-2 bg-[#F4F7F5] rounded-full text-[#5C756E]/60 hover:text-[#1E2E2A] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <div class="flex items-center justify-between mb-5 bg-[#F4F7F5]/60 border border-[#E4ECE9] rounded-xl p-2.5">
          <div class="flex items-center gap-2">
            <span class="relative flex h-2 w-2">
              <span :class="{
                'bg-green-500': (selectedSpot.freshnessScore ?? selectedSpot.FreshnessScore) >= 75,
                'bg-amber-500': (selectedSpot.freshnessScore ?? selectedSpot.FreshnessScore) >= 25 && (selectedSpot.freshnessScore ?? selectedSpot.FreshnessScore) < 75,
                'bg-red-500': (selectedSpot.freshnessScore ?? selectedSpot.FreshnessScore) < 25
              }" class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"></span>
              <span :class="{
                'bg-green-500': (selectedSpot.freshnessScore ?? selectedSpot.FreshnessScore) >= 75,
                'bg-amber-500': (selectedSpot.freshnessScore ?? selectedSpot.FreshnessScore) >= 25 && (selectedSpot.freshnessScore ?? selectedSpot.FreshnessScore) < 75,
                'bg-red-500': (selectedSpot.freshnessScore ?? selectedSpot.FreshnessScore) < 25
              }" class="relative inline-flex rounded-full h-2 w-2"></span>
            </span>
            <span class="text-xs font-medium text-[#5C756E]">
              Indice de fiabilité :
              <span class="font-bold text-[#1E2E2A]">{{ selectedSpot.freshnessScore ?? selectedSpot.FreshnessScore ?? 100 }}%</span>
            </span>
          </div>

          <div class="flex items-center gap-1 bg-white border border-[#E4ECE9] rounded-lg p-0.5 shadow-sm">
            <button
                @click="voteSpot(selectedSpot, true)"
                class="p-1.5 text-[#5C756E]/70 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200"
                title="Valider (+25%)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
              </svg>
            </button>

            <div class="w-[1px] h-3 bg-[#E4ECE9]"></div>

            <button
                @click="voteSpot(selectedSpot, false)"
                class="p-1.5 text-[#5C756E]/70 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                title="Signaler un problème (-25%)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
              </svg>
            </button>
          </div>
        </div>

        <p class="text-[#5C756E] text-sm leading-relaxed mb-6">
          {{ selectedSpot.description || selectedSpot.Description || 'Aucune description disponible pour ce lieu.' }}
        </p>

        <div v-if="selectedSpot.imageUrl || selectedSpot.ImageUrl" class="w-full h-44 lg:h-56 rounded-2xl overflow-hidden mb-6 border border-[#E4ECE9]">
          <img :src="selectedSpot.imageUrl || selectedSpot.ImageUrl" class="w-full h-full object-cover" />
        </div>

        <div class="flex gap-3">
          <button
              @click="copyCoords(selectedSpot.latitude, selectedSpot.longitude)"
              class="flex-1 h-12 font-medium rounded-xl shadow-sm active:scale-95 transition-all text-sm tracking-wide flex items-center justify-center gap-2"
              :class="isCopied ? 'bg-[#1E2E2A] text-[#00A896] border border-[#00A896]/20' : 'bg-[#00A896] text-white'"
          >
            <span v-if="isCopied">Coordonnées copiées</span>
            <span v-else>Copier les coordonnées</span>
          </button>

          <button
              @click="toggleFavoriteSpot(selectedSpot)"
              class="px-4 bg-[#F4F7F5] rounded-xl transition-colors border border-[#E4ECE9] flex items-center justify-center active:scale-90"
              :class="selectedSpot.isFavorite ? 'text-[#FF6B6B]' : 'text-[#5C756E] hover:text-[#FF6B6B]'"
              :title="selectedSpot.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :fill="selectedSpot.isFavorite ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        <div v-if="isOwner(selectedSpot) || isAdmin" class="mt-5 pt-4 border-t border-[#E4ECE9]">
          <button
              @click="deleteSpot(selectedSpot)"
              class="w-full h-12 bg-[#FF6B6B]/10 hover:bg-[#FF6B6B] text-[#FF6B6B] hover:text-white font-medium rounded-xl text-sm transition-all flex items-center justify-center gap-2 active:scale-95 border border-[#FF6B6B]/20"
          >
            {{ isAdmin ? 'Supprimer le spot (Mode Admin)' : 'Supprimer mon spot' }}
          </button>
        </div>
      </div>
    </transition>

    <transition
        enter-active-class="transform transition ease-out duration-300"
        :enter-from-class="isLaptop ? '-translate-x-full' : 'translate-y-full'"
        :enter-to-class="isLaptop ? 'translate-x-0' : 'translate-y-0'"
        leave-active-class="transform transition ease-in duration-200"
        :leave-from-class="isLaptop ? 'translate-x-0' : 'translate-y-0'"
        :leave-to-class="isLaptop ? '-translate-x-full' : 'translate-y-full'"
    >
      <div
          v-if="newSpotCoords"
          class="absolute bottom-0 left-0 right-0 lg:top-0 lg:bottom-auto lg:right-auto z-[3000] bg-white border-t lg:border-t-0 lg:border-r border-[#E4ECE9] text-[#1E2E2A] rounded-t-[2.5rem] lg:rounded-t-none lg:rounded-r-[2.5rem] p-6 pb-8 lg:pt-24 shadow-[0_-10px_40px_rgba(9,17,14,0.08)] lg:shadow-[10px_0_40px_rgba(9,17,14,0.05)] w-full max-w-md mx-auto overflow-y-auto max-h-[75vh] lg:max-h-full lg:h-full no-scrollbar"
      >
        <div class="w-12 h-1 bg-[#E4ECE9] rounded-full mx-auto mb-5 lg:hidden"></div>

        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-xl font-medium tracking-tight text-[#1E2E2A]">Nouveau Spot</h3>
            <p class="text-[9px] text-[#5C756E]/60 font-mono mt-0.5">
              LAT: {{ newSpotCoords.lat.toFixed(5) }} | LNG: {{ newSpotCoords.lng.toFixed(5) }}
            </p>
          </div>
          <button @click="emit('close-form')" class="text-[#5C756E]/60 font-medium text-xs tracking-wide hover:text-[#FF6B6B] transition-colors">Annuler</button>
        </div>

        <form @submit.prevent="submitNewSpot" class="space-y-5">
          <div class="space-y-1">
            <div
                @click="triggerSpotImageUpload"
                class="w-full h-28 lg:h-36 bg-[#F4F7F5] border border-dashed border-[#E4ECE9] rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#00A896] transition-colors relative"
            >
              <img v-if="newSpotImageUrl" :src="newSpotImageUrl" class="w-full h-full object-cover" />
              <div v-else class="flex flex-col items-center text-[#5C756E]/40">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
                <span class="text-[9px] uppercase font-bold tracking-wider mt-1.5">Ajouter une photo</span>
              </div>

              <div v-if="isUploadingSpotImage" class="absolute inset-0 bg-white/80 flex items-center justify-center">
                <div class="w-5 h-5 border-2 border-[#00A896] border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <input
                type="file"
                ref="spotImageInput"
                class="hidden"
                accept="image/*"
                @change="handleSpotImageChange"
            />
          </div>

          <div class="relative border-b border-[#E4ECE9] focus-within:border-[#00A896] transition-colors pb-1">
            <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold mb-1">Nom du spot</label>
            <input
                v-model="newSpotTitle"
                type="text"
                placeholder="Ex: Source d'eau ou Bivouac sauvage"
                class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none placeholder:text-[#1E2E2A]/20 h-8"
                required
            />
          </div>

          <div class="relative border-b border-[#E4ECE9] focus-within:border-[#00A896] transition-colors pb-1">
            <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold mb-1">Description</label>
            <textarea
                v-model="newSpotDescription"
                placeholder="Donne des infos utiles (accès, sécurité...)"
                rows="2"
                class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none placeholder:text-[#1E2E2A]/20 resize-none pt-1"
                required
            ></textarea>
          </div>

          <div class="space-y-2 pt-1">
            <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold">
              Caractéristiques du lieu
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                  v-for="tag in availableTags"
                  :key="tag.id"
                  type="button"
                  @click="toggleTagSelection(tag.id)"
                  :class="selectedTagIds.includes(tag.id)
                    ? 'bg-[#00A896] text-white border-[#00A896]'
                    : 'bg-[#F4F7F5] text-[#5C756E] border-[#E4ECE9] hover:border-[#00A896]/40'"
                  class="px-3 py-1.5 border text-xs font-medium rounded-xl transition-all active:scale-95 flex items-center gap-1"
              >
                {{ tag.name }}
              </button>
            </div>
          </div>

          <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full h-12 bg-[#00A896] text-white font-medium rounded-xl text-sm tracking-wide active:scale-95 transition-all mt-4 disabled:opacity-40"
          >
            {{ isSubmitting ? 'Enregistrement...' : 'Partager le spot' }}
          </button>
        </form>
      </div>
    </transition>

  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { config, GeolocateControl, Map, MapStyle, Marker } from '@maptiler/sdk';
import api from '@/api/axios'
import { useAuth } from '@/stores/auth';
import { compressImage, uploadImage } from '@/api/mediaService';
import '@maptiler/sdk/dist/maptiler-sdk.css';

const props = defineProps({
  spots: { type: Array, default: () => [] },
  isAddingMode: { type: Boolean, default: false },
  newSpotCoords: { type: Object, default: null }
});

const emit = defineEmits(['coords-captured', 'close-form', 'spot-created']);

const mapContainer = ref(null);
const authStore = useAuth();

let mapInstance = null;
let mapMarkers = [];

const selectedSpot = ref(null);
const isLaptop = ref(false);

const newSpotTitle = ref('');
const newSpotDescription = ref('');
const isSubmitting = ref(false)
const newSpotImageUrl = ref('')
const isUploadingSpotImage = ref(false)
const spotImageInput = ref(null);

// --- 👑 GESTION DES TAGS ---
const selectedTag = ref(null);
const availableTags = ref([]);
const selectedTagIds = ref([]); // Pour stocker les sélections du formulaire d'ajout

const isAdmin = computed(() => {
  return authStore.user?.roles?.includes('Admin') || false;
});

const isOwner = (spot) => {
  if (!spot) return false;
  const currentUserId = authStore.user?.id || authStore.user?.UserId;
  const spotOwnerId = spot.userId || spot.UserId;
  return currentUserId && spotOwnerId && currentUserId === spotOwnerId;
};

const checkScreenSize = () => {
  isLaptop.value = window.innerWidth >= 1024;
};

const filteredSpots = computed(() => {
  if (!selectedTag.value) return props.spots;

  return props.spots.filter(spot => {
    const tagsList = spot.tags || spot.Tags || [];


    return tagsList.includes(selectedTag.value);
  });
});

// --- API FETCH ---
const loadSpotTags = async () => {
  try {
    const res = await api.get('/spots/tags');
    availableTags.value = res.data;
  } catch (err) {
    console.error("Erreur lors du chargement des tags 'Spot' :", err);
  }
};

onMounted(() => {
  config.apiKey = import.meta.env.VITE_MAPTILER_KEY;

  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);

  // On charge les tags de la DB
  loadSpotTags();

  if (mapContainer.value) {
    mapInstance = new Map({
      container: mapContainer.value,
      style: MapStyle.OPENSTREETMAP,
      center: [5.694040, 50.679083],
      zoom: 13,
      navigationControl: false,
      geolocateControl: false
    });

    const geolocate = new GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserLocation: true
    });
    mapInstance.addControl(geolocate);

    mapInstance.on('load', () => {
      if (filteredSpots.value.length > 0) {
        displaySpots();
      }
      geolocate.trigger();

      mapInstance.on('click', (e) => {
        if (props.isAddingMode) {
          const { lat, lng } = e.lngLat;
          selectedSpot.value = null;
          emit('coords-captured', { lat, lng });
        } else {
          selectedSpot.value = null;
        }
      });
    });
  }
});

watch(filteredSpots, () => {
  displaySpots();
});

watch(() => props.isAddingMode, (newVal) => {
  if (mapContainer.value) {
    mapContainer.value.style.cursor = newVal ? 'crosshair' : '';
  }
});

watch(() => props.newSpotCoords, (newVal) => {
  if (!newVal) {
    newSpotTitle.value = '';
    newSpotDescription.value = '';
    newSpotImageUrl.value = '';
    selectedTagIds.value = []; // Reset des cases cochées
  }
});

const displaySpots = () => {
  if (!mapInstance) return;

  mapMarkers.forEach(m => m.remove());
  mapMarkers = [];

  filteredSpots.value.forEach(spot => {
    const lng = spot.longitude;
    const lat = spot.latitude;

    if (lng && lat) {
      const score = spot.freshnessScore ?? spot.FreshnessScore ?? 100;
      let markerColor = "#00A896";

      if (score < 25) {
        markerColor = "#FF6B6B";
      } else if (score < 75) {
        markerColor = "#F59E0B";
      }

      const marker = new Marker({ color: markerColor })
          .setLngLat([lng, lat])
          .addTo(mapInstance);

      marker.getElement().addEventListener('click', (e) => {
        e.stopPropagation();
        if (props.isAddingMode) return;

        selectedSpot.value = spot;

        mapInstance.flyTo({
          center: [lng, lat],
          zoom: 15,
          padding: isLaptop.value ? { left: 100 } : { bottom: 250 },
          essential: true
        });
      });

      mapMarkers.push(marker);
    }
  });
};

const handleSpotImageChange = async (event) => {
  const target = event.target;
  const file = target.files?.[0];
  if (!file) return;

  try {
    isUploadingSpotImage.value = true;
    const compressedFile = await compressImage(file);
    const { url } = await uploadImage(compressedFile);
    newSpotImageUrl.value = url;
  } catch (err) {
    console.error("Erreur spot image upload:", err);
  } finally {
    isUploadingSpotImage.value = false;
  }
}

const triggerSpotImageUpload = () => {
  spotImageInput.value?.click();
}

// --- GESTION DES CASES À COCHER (FORMULAIRE) ---
const toggleTagSelection = (tagId) => {
  const index = selectedTagIds.value.indexOf(tagId);
  if (index === -1) {
    selectedTagIds.value.push(tagId);
  } else {
    selectedTagIds.value.splice(index, 1);
  }
};

const submitNewSpot = async () => {
  if (!props.newSpotCoords) return;
  isSubmitting.value = true;

  try {
    await api.post('/spots', {
      title: newSpotTitle.value,
      description: newSpotDescription.value,
      latitude: props.newSpotCoords.lat,
      longitude: props.newSpotCoords.lng,
      imageUrl: newSpotImageUrl.value,
      // 👑 On envoie la liste des UUIDs cochés
      tagIds: selectedTagIds.value
    });
    emit('spot-created');
  } catch (error) {
    console.error("Erreur création spot :", error);
  } finally {
    isSubmitting.value = false;
  }
};

const copyCoords = async (lat, lng) => {
  if (!lat || !lng) return;
  try {
    const coordsString = `${lat},${lng}`;
    await navigator.clipboard.writeText(coordsString);
    isCopied.value = true;
    setTimeout(() => { isCopied.value = false; }, 2000);
  } catch (err) {
    console.error("Impossible de copier :", err);
  }
};

const toggleFavoriteSpot = async (spot) => {
  try {
    const id = spot.spotsId || spot.id || spot.SpotsId;
    const res = await api.post(`/spots/${id}/favorite`)
    spot.isFavorite = res.data.isFavorite
  } catch (err) {
    console.error("Erreur lors de la modification du spot favori :", err)
  }
}

const voteSpot = async (spot, isUpvote) => {
  try {
    const id = spot.spotsId || spot.id || spot.Id || spot.SpotsId;
    const res = await api.post(`/spots/${id}/vote?isUpvote=${isUpvote}`);
    const newScore = res.data.freshnessScore ?? res.data.FreshnessScore;

    if (spot.freshnessScore !== undefined) spot.freshnessScore = newScore;
    if (spot.FreshnessScore !== undefined) spot.FreshnessScore = newScore;
    if (spot.freshnessScore === undefined && spot.FreshnessScore === undefined) {
      spot.freshnessScore = newScore;
    }

    const spotIndex = filteredSpots.value.findIndex(s => (s.spotsId || s.id || s.Id) === id);

    if (spotIndex !== -1 && mapMarkers[spotIndex]) {
      let newColor = "#00A896";
      if (newScore < 25) {
        newColor = "#FF6B6B";
      } else if (newScore < 75) {
        newColor = "#F59E0B";
      }

      const markerElement = mapMarkers[spotIndex].getElement();
      const svgElement = markerElement.querySelector('svg path');
      if (svgElement) {
        svgElement.setAttribute('fill', newColor);
      }
    }

  } catch (err) {
    console.error("Erreur lors du vote :", err);
  }
};

const deleteSpot = async (spot) => {
  const id = spot.id || spot.spotsId || spot.SpotsId;
  if (!id) return;

  if (!confirm(isAdmin.value ? "🔥 MODE ADMIN : Confirmer la suppression définitive de ce spot ?" : "Es-tu sûr de vouloir supprimer ton spot ?")) return;

  try {
    const endpoint = isAdmin.value ? `/spots/admin/${id}` : `/spots/${id}`;
    await api.delete(endpoint);

    selectedSpot.value = null;
    emit('spot-created');
  } catch (err) {
    console.error("Erreur lors de la suppression du spot :", err);
    alert("Impossible de supprimer ce spot. Vérifie tes droits.");
  }
};

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);

  if (mapMarkers) {
    mapMarkers.forEach(m => m.remove());
    mapMarkers = [];
  }

  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
});
</script>
<style scoped>
:deep(.maplibregl-ctrl-bottom-right),
:deep(.maplibregl-ctrl-bottom-left) {
  display: none !important;
}

:deep(.maplibregl-ctrl-top-right) {
  margin-top: calc(75px + env(safe-area-inset-top)) !important;
}

@media (min-width: 1024px) {
  :deep(.maplibregl-ctrl-top-right) {
    margin-top: 16px !important;
    margin-right: 24px !important;
  }
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>