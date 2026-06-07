<template>
  <!-- h-full prend désormais le 100dvh du parent, la carte occupe TOUT l'espace -->
  <div class="relative w-full h-full overflow-hidden bg-[#F4F7F5] font-sans selection:bg-[#00A896]/20">

    <!-- CONTENEUR DE LA CARTE MAPTILER -->
    <div ref="mapContainer" class="w-full h-full absolute inset-0 z-0"></div>

    <!-- TOOLBAR FLOTTANTE ÉPURÉE (Recherche uniquement) -->
    <!-- pt-[calc(16px+env(safe-area-inset-top))] : gère dynamiquement l'encoche/notch du haut sur iPhone -->
    <div class="absolute top-[calc(12px+env(safe-area-inset-top))] left-0 right-0 lg:top-4 lg:left-6 lg:right-auto lg:mx-0 z-[1000] px-4 w-full max-w-md mx-auto pointer-events-none">
      <div class="w-full h-12 bg-white/90 backdrop-blur-md border border-[#E4ECE9] rounded-2xl px-4 flex items-center gap-3 shadow-sm pointer-events-auto">
        <span class="text-[#5C756E]/40 text-sm">🔍</span>
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher"
            class="bg-transparent flex-1 h-full text-sm text-[#1E2E2A] outline-none placeholder:text-[#5C756E]/30"
        />
        <button v-if="searchQuery" @click="searchQuery = ''" class="text-[#5C756E]/40 text-xs hover:text-[#1E2E2A]">✕</button>
      </div>
    </div>

    <!-- VOLET 1 : DÉTAILS D'UN SPOT SÉLECTIONNÉ -->
    <!-- Optimisation Laptop : Animation adaptative (glisse par la gauche sur ordi, par le bas sur mobile) -->
    <transition
        enter-active-class="transform transition ease-out duration-300"
        :enter-from-class="isLaptop ? '-translate-x-full' : 'translate-y-full'"
        :enter-to-class="isLaptop ? 'translate-x-0' : 'translate-y-0'"
        leave-active-class="transform transition ease-in duration-200"
        :leave-from-class="isLaptop ? 'translate-x-0' : 'translate-y-0'"
        :leave-to-class="isLaptop ? '-translate-x-full' : 'translate-y-full'"
    >
      <!-- Optimisation Laptop : Devient un panneau latéral gauche fixe sur toute la hauteur (lg:top-0 lg:h-full lg:rounded-r-[2.5rem]) -->
      <div
          v-if="selectedSpot"
          class="absolute bottom-0 left-0 right-0 lg:top-0 lg:bottom-auto lg:right-auto z-[1000] bg-white border-t lg:border-t-0 lg:border-r border-[#E4ECE9] text-[#1E2E2A] rounded-t-[2.5rem] lg:rounded-t-none lg:rounded-r-[2.5rem] shadow-[0_-10px_40px_rgba(9,17,14,0.08)] lg:shadow-[10px_0_40px_rgba(9,17,14,0.05)] p-6 pb-8 lg:pt-24 w-full max-w-md mx-auto overflow-y-auto max-h-[60vh] lg:max-h-full lg:h-full no-scrollbar"
      >
        <!-- Masqué sur Laptop -->
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

        <p class="text-[#5C756E] text-sm leading-relaxed mb-6">
          {{ selectedSpot.description || selectedSpot.Description || 'Aucune description disponible pour ce lieu.' }}
        </p>

        <!-- Optimisation Laptop : Hauteur d'image légèrement augmentée sur grand écran pour plus de confort visuel -->
        <div v-if="selectedSpot.imageUrl || selectedSpot.ImageUrl" class="w-full h-44 lg:h-56 rounded-2xl overflow-hidden mb-6 border border-[#E4ECE9]">
          <img :src="selectedSpot.imageUrl || selectedSpot.ImageUrl" class="w-full h-full object-cover" />
        </div>

        <div class="flex gap-3">
          <button
              @click="copyCoords(selectedSpot.latitude, selectedSpot.longitude)"
              class="flex-1 h-12 font-medium rounded-xl shadow-sm active:scale-95 transition-all text-sm tracking-wide flex items-center justify-center gap-2"
              :class="isCopied ? 'bg-[#1E2E2A] text-[#00A896] border border-[#00A896]/20' : 'bg-[#00A896] text-white'"
          >
            <span v-if="isCopied">✓ Coordonnées copiées !</span>
            <span v-else>Copier les coordonnées</span>
          </button>

          <button class="px-4 bg-[#F4F7F5] text-[#5C756E] rounded-xl hover:text-[#FF6B6B] transition-colors border border-[#E4ECE9]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </transition>

    <!-- VOLET 2 : FORMULAIRE D'AJOUT D'UN NOUVEAU SPOT -->
    <!-- Optimisation Laptop : Même comportement latéral ultra-pro (Google Maps style) -->
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
          class="absolute bottom-0 left-0 right-0 lg:top-0 lg:bottom-auto lg:right-auto z-[1000] bg-white border-t lg:border-t-0 lg:border-r border-[#E4ECE9] text-[#1E2E2A] rounded-t-[2.5rem] lg:rounded-t-none lg:rounded-r-[2.5rem] p-6 pb-8 lg:pt-24 shadow-[0_-10px_40px_rgba(9,17,14,0.08)] lg:shadow-[10px_0_40px_rgba(9,17,14,0.05)] w-full max-w-md mx-auto overflow-y-auto max-h-[75vh] lg:max-h-full lg:h-full no-scrollbar"
      >
        <!-- Masqué sur Laptop -->
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
          <!-- Zone d'upload épurée -->
          <div class="space-y-1">
            <div
                @click="triggerSpotImageUpload"
                class="w-full h-28 lg:h-36 bg-[#F4F7F5] border border-dashed border-[#E4ECE9] rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#00A896] transition-colors relative"
            >
              <img v-if="newSpotImageUrl" :src="newSpotImageUrl" class="w-full h-full object-cover" />
              <div v-else class="flex flex-col items-center text-[#5C756E]/40">
                <span class="text-xl">📸</span>
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

          <!-- Nom du Spot -->
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

          <!-- Description -->
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

          <!-- Validation -->
          <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full h-12 bg-[#00A896] text-white font-medium rounded-xl text-sm tracking-wide active:scale-95 transition-all mt-2 disabled:opacity-40"
          >
            {{ isSubmitting ? 'Enregistrement...' : 'Partager le spot' }}
          </button>
        </form>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, shallowRef, onMounted, onUnmounted, watch, computed } from 'vue';
import { config, GeolocateControl, Map, MapStyle, Marker } from '@maptiler/sdk';
import api from '@/api/axios'
import { compressImage, uploadImage } from '@/api/mediaService';
import '@maptiler/sdk/dist/maptiler-sdk.css';

const props = defineProps({
  spots: { type: Array, default: () => [] },
  isAddingMode: { type: Boolean, default: false },
  newSpotCoords: { type: Object, default: null }
});

const emit = defineEmits(['coords-captured', 'close-form', 'spot-created']);

const mapContainer = ref(null);
const map = shallowRef(null);
const markers = ref([]);
const selectedSpot = ref(null);

// Détection dynamique de la taille d'écran pour adapter les volets
const isLaptop = ref(false);

// Filtrage State
const searchQuery = ref('');

// Formulaire states
const newSpotTitle = ref('');
const newSpotDescription = ref('');
const isSubmitting = ref(false)
const newSpotImageUrl = ref('')
const isUploadingSpotImage = ref(false)
const spotImageInput = ref(null);

// Fonction de détection du breakpoint ordinateur (lg = 1024px)
const checkScreenSize = () => {
  isLaptop.value = window.innerWidth >= 1024;
};

// FILTRAGE UNIQUEMENT PAR TITRE
const filteredSpots = computed(() => {
  return props.spots.filter(spot => {
    const title = (spot.title || spot.Title || '').toLowerCase();
    const query = searchQuery.value.toLowerCase();

    return title.includes(query);
  });
});

onMounted(() => {
  config.apiKey = import.meta.env.VITE_MAPTILER_KEY;

  // Écouteur de redimensionnement
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);

  if (mapContainer.value) {
    map.value = new Map({
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
    map.value.addControl(geolocate);

    map.value.on('load', () => {
      if (filteredSpots.value.length > 0) {
        displaySpots();
      }
      geolocate.trigger();

      map.value.on('click', (e) => {
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

// Redessine dès que la recherche filtre le tableau par titre
watch(filteredSpots, () => {
  displaySpots();
}, { deep: true });

watch(() => props.isAddingMode, (newVal) => {
  if (mapContainer.value) {
    mapContainer.value.style.cursor = newVal ? 'crosshair' : '';
  }
});

watch(() => props.newSpotCoords, (newVal) => {
  if (!newVal) {
    newSpotTitle.value = '';
    newSpotDescription.value = '';
    newSpotImageUrl.value = ''
  }
});

const displaySpots = () => {
  if (!map.value) return;

  markers.value.forEach(m => m.remove());
  markers.value = [];

  filteredSpots.value.forEach(spot => {
    const lng = spot.longitude;
    const lat = spot.latitude;

    if (lng && lat) {
      const marker = new Marker({ color: "#00A896" })
          .setLngLat([lng, lat])
          .addTo(map.value);

      marker.getElement().addEventListener('click', (e) => {
        e.stopPropagation();
        if (props.isAddingMode) return;

        selectedSpot.value = spot;

        // Optimisation Laptop : Sur grand écran, on centre le zoom normalement sans le décaler vers le bas (padding optionnel sur mobile uniquement)
        map.value.flyTo({
          center: [lng, lat],
          zoom: 15,
          padding: isLaptop.value ? { left: 100 } : { bottom: 250 },
          essential: true
        });
      });

      markers.value.push(marker);
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

const submitNewSpot = async () => {
  if (!props.newSpotCoords) return;
  isSubmitting.value = true;

  try {
    await api.post('/spots', {
      title: newSpotTitle.value,
      description: newSpotDescription.value,
      latitude: props.newSpotCoords.lat,
      longitude: props.newSpotCoords.lng,
      imageUrl: newSpotImageUrl.value
    });
    emit('spot-created');
  } catch (error) {
    console.error("Erreur création spot :", error);
  } finally {
    isSubmitting.value = false;
  }
};

const isCopied = ref(false);

const copyCoords = async (lat, lng) => {
  if (!lat || !lng) return;

  try {
    const coordsString = `${lat},${lng}`;
    await navigator.clipboard.writeText(coordsString);

    // On passe à true pour changer le look du bouton
    isCopied.value = true;

    // Au bout de 2 secondes, le bouton redevient normal
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);

  } catch (err) {
    console.error("Impossible de copier :", err);
  }
};

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
  if (map.value) map.value.remove();
});
</script>

<style scoped>
:deep(.maplibregl-ctrl-bottom-right),
:deep(.maplibregl-ctrl-bottom-left) {
  display: none !important;
}

/* Aligne le bouton GPS sous le notch de l'iPhone proprement */
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