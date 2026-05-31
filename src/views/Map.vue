<template>
  <div class="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-gray-100">

    <div ref="mapContainer" class="w-full h-full"></div>

    <transition
        enter-active-class="transform transition ease-out duration-300"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transform transition ease-in duration-200"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
    >
      <div
          v-if="selectedSpot"
          class="absolute bottom-0 left-0 right-0 z-[1000] bg-[#0d161c] border-t border-white/5 text-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.4)] p-6 pb-12 max-w-md mx-auto"
      >
        <div class="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6"></div>

        <div class="flex justify-between items-start mb-4">
          <div>
            <h2 class="text-2xl font-black text-white uppercase tracking-tight">
              {{ selectedSpot.title || selectedSpot.Title }}
            </h2>
            <p class="text-xs font-black text-[#00cba9] uppercase tracking-widest mt-1">
              Spot StreetPacker
            </p>
          </div>

          <button
              @click="selectedSpot = null"
              class="p-2 bg-[#112220] rounded-full text-teal-500/50 hover:text-white transition-colors border border-white/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <p class="text-teal-100/60 leading-relaxed mb-8 text-sm">
          {{ selectedSpot.description || selectedSpot.Description || 'Aucune description disponible pour ce lieu de bivouac ou de passage.' }}
        </p>

        <div v-if="selectedSpot.imageUrl || selectedSpot.ImageUrl" class="w-full h-48 rounded-2xl overflow-hidden mb-8 border border-white/5">
          <img :src="selectedSpot.imageUrl || selectedSpot.ImageUrl" class="w-full h-full object-cover" />
        </div>

        <div class="flex gap-3">
          <button
              class="flex-1 bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] text-[#0d161c] font-black py-4 rounded-2xl shadow-lg shadow-[#ff7e5f]/10 active:scale-95 transition-all text-center uppercase tracking-wider text-sm"
          >
            Y aller
          </button>

          <button class="px-5 bg-[#112220] text-teal-500 rounded-2xl hover:bg-[#162d2a] border border-[#1a3532] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </transition>

    <transition
        enter-active-class="transform transition ease-out duration-300"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transform transition ease-in duration-200"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
    >
      <div
          v-if="newSpotCoords"
          class="absolute bottom-0 left-0 right-0 z-[1000] bg-[#0d161c] border-t border-white/5 text-white rounded-t-3xl p-6 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] max-w-md mx-auto"
      >
        <div class="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6"></div>

        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-2xl font-black uppercase tracking-tight text-[#00cba9]">Nouveau Spot</h3>
            <p class="text-[10px] text-white/30 font-mono mt-1">
              📍 LAT: {{ newSpotCoords.lat.toFixed(5) }} | LNG: {{ newSpotCoords.lng.toFixed(5) }}
            </p>
          </div>
          <button @click="emit('close-form')" class="text-white/40 font-black text-xs uppercase tracking-wider hover:text-white transition-colors">Annuler</button>
        </div>

        <form @submit.prevent="submitNewSpot" class="space-y-4">
          <div class="space-y-1 text-center">
            <div 
              @click="triggerSpotImageUpload"
              class="w-full h-32 bg-[#112220] border border-dashed border-[#1a3532] rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#00cba9] transition-colors"
            >
              <img v-if="newSpotImageUrl" :src="newSpotImageUrl" class="w-full h-full object-cover" />
              <div v-else class="flex flex-col items-center text-teal-900/30">
                <span class="text-2xl">📸</span>
                <span class="text-[9px] uppercase font-black mt-2">Ajouter une photo</span>
              </div>
              
              <div v-if="isUploadingSpotImage" class="absolute inset-0 bg-[#0d161c]/60 flex items-center justify-center">
                <div class="w-6 h-6 border-2 border-[#00cba9] border-t-transparent rounded-full animate-spin"></div>
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
          <div class="space-y-1">
            <label class="text-[9px] uppercase tracking-widest text-teal-500 font-black ml-1">Nom du spot</label>
            <input
                v-model="newSpotTitle"
                type="text"
                placeholder="Ex: Source d'eau ou Bivouac de Blegny"
                class="w-full h-12 bg-[#112220] border border-[#1a3532] rounded-xl px-4 text-sm outline-none focus:border-[#ff7e5f] transition-all placeholder:text-teal-900/30"
                required
            />
          </div>

          <div class="space-y-1">
            <label class="text-[9px] uppercase tracking-widest text-teal-500 font-black ml-1">Description</label>
            <textarea
                v-model="newSpotDescription"
                placeholder="Donne des infos utiles (accès, sécurité...)"
                rows="3"
                class="w-full bg-[#112220] border border-[#1a3532] rounded-xl p-4 text-sm outline-none focus:border-[#ff7e5f] transition-all resize-none placeholder:text-teal-900/30"
                required
            ></textarea>
          </div>

          <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full h-12 bg-gradient-to-r from-[#00cba9] to-[#009b82] text-[#0d161c] font-black rounded-xl uppercase tracking-wider text-xs active:scale-95 transition-all mt-2 disabled:opacity-50"
          >
            {{ isSubmitting ? 'Enregistrement...' : 'Partager le spot' }}
          </button>
        </form>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, shallowRef, onMounted, onUnmounted, watch } from 'vue';
import { config, GeolocateControl, Map, MapStyle, Marker } from '@maptiler/sdk';
import api from '@/api/axios'
import { compressImage, uploadImage } from '@/api/mediaService'; // On utilise ton axios configuré
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

// Formulaire states
const newSpotTitle = ref('');
const newSpotDescription = ref('');
const isSubmitting = ref(false)
const newSpotImageUrl = ref('')
const isUploadingSpotImage = ref(false)
const spotImageInput = ref(null);

onMounted(() => {
  config.apiKey = '4FOCYl0j1EWf7D5remSs';

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
      if (props.spots.length > 0) {
        displaySpots();
      }
      geolocate.trigger();

      // ÉCOUTE DU CLIC SUR LA CARTE POUR L'AJOUT
      map.value.on('click', (e) => {
        if (props.isAddingMode) {
          const { lat, lng } = e.lngLat;
          selectedSpot.value = null; // Ferme le volet classique au cas où
          emit('coords-captured', { lat, lng });
        } else {
          // Si on clique au pif sur la carte hors mode ajout, on ferme le volet ouvert
          selectedSpot.value = null;
        }
      });
    });
  }
});

// Watcher pour le curseur de la souris (crosshair en mode ajout)
watch(() => props.isAddingMode, (newVal) => {
  if (mapContainer.value) {
    mapContainer.value.style.cursor = newVal ? 'crosshair' : '';
  }
});

// Watcher pour vider le formulaire quand le volet se ferme
watch(() => props.newSpotCoords, (newVal) => {
  if (!newVal) {
    newSpotTitle.value = '';
    newSpotDescription.value = '';
    newSpotImageUrl.value = ''
  }
});

watch(() => props.spots, () => {
  displaySpots();
}, { deep: true });

const displaySpots = () => {
  if (!map.value) return;

  markers.value.forEach(m => m.remove());
  markers.value = [];

  props.spots.forEach(spot => {
    const lng = spot.longitude;
    const lat = spot.latitude;

    if (lng && lat) {
      const marker = new Marker({ color: "#00cba9" }) // Passé en Teal pour aller avec ton thème
          .setLngLat([lng, lat])
          .addTo(map.value);

      marker.getElement().addEventListener('click', (e) => {
        e.stopPropagation();
        if (props.isAddingMode) return; // Désactive la sélection de spot si on cherche à ajouter

        selectedSpot.value = spot;

        map.value.flyTo({
          center: [lng, lat],
          zoom: 15,
          padding: { bottom: 300 },
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
    alert("Impossible d'uploader l'image.");
  } finally {
    isUploadingSpotImage.value = false;
  }
}

const triggerSpotImageUpload = () => {
  spotImageInput.value?.click();
}

// ENVOI DU NOUVEAU SPOT À TON API C#
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

    // On prévient le dashboard que c'est réussi pour rafraîchir la liste
    emit('spot-created');
  } catch (error) {
    console.error("Erreur lors de la création du spot :", error);
    alert("Impossible d'enregistrer ton spot pour le moment.");
  } finally {
    isSubmitting.value = false;
  }
};

onUnmounted(() => {
  if (map.value) map.value.remove();
});
</script>

<style scoped>
:deep(.maplibregl-ctrl-bottom-right),
:deep(.maplibregl-ctrl-bottom-left) {
  display: none !important;
}

:deep(.maplibregl-ctrl-top-right) {
  margin-top: 40px !important;
}
</style>