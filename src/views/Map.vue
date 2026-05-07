<template>
  <div class="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-gray-100">

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
          class="absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] p-6 pb-12"
      >
        <div class="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>

        <div class="flex justify-between items-start mb-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 tracking-tight">
              {{ selectedSpot.title || selectedSpot.Title }}
            </h2>
            <p class="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">
              Spot StreetPacker
            </p>
          </div>

          <button
              @click="selectedSpot = null"
              class="p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <p class="text-gray-600 leading-relaxed mb-8">
          {{ selectedSpot.description || selectedSpot.Description || 'Aucune description disponible pour ce lieu de bivouac ou de passage.' }}
        </p>

        <div class="flex gap-3">
          <button
              class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-100 active:scale-95 transition-all text-center"
          >
            Y aller
          </button>

          <button class="px-5 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, shallowRef, onMounted, onUnmounted, watch } from 'vue';
import {config, GeolocateControl, Map, MapStyle, Marker} from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

const props = defineProps({
  spots: {
    type: Array,
    default: () => []
  }
});

const mapContainer = ref(null);
const map = shallowRef(null);
const markers = ref([]);
const selectedSpot = ref(null);

onMounted(() => {
  config.apiKey = '4FOCYl0j1EWf7D5remSs';

  if (mapContainer.value) {
    map.value = new Map({
      container: mapContainer.value,
      style: MapStyle.BASE,
      center: [5.694040, 50.679083],
      zoom: 13,
      navigationControl: false,
      geolocateControl: false
    });

    const geolocate = new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true, // Suit l'utilisateur s'il bouge
      showUserLocation: true   // Affiche le point bleu
    });
    map.value.addControl(geolocate);
    // Attendre que le style soit chargé avant de mettre les markers
    map.value.on('load', () => {
      if (props.spots.length > 0) {
        displaySpots();
      }
      geolocate.trigger();
    });
  }
});

watch(() => props.spots, () => {
  displaySpots();
}, { deep: true });

const displaySpots = () => {
  if (!map.value) return;

  // Nettoyage propre
  markers.value.forEach(m => m.remove());
  markers.value = [];

  props.spots.forEach(spot => {
    const lng = spot.longitude;
    const lat = spot.latitude;

    if (lng && lat) {
      const marker = new Marker({ color: "#059669" })
          .setLngLat([lng, lat])
          .addTo(map.value);

      // Gestion du clic pour ouvrir le Bottom Sheet
      marker.getElement().addEventListener('click', (e) => {
        e.stopPropagation();
        selectedSpot.value = spot;

        // Centrer avec décalage pour le volet
        map.value.flyTo({
          center: [lng, lat],
          zoom: 15,
          padding: { bottom: 300 }, // Place pour le texte en bas
          essential: true
        });
      });

      markers.value.push(marker);
    }
  });
};

onUnmounted(() => {
  if (map.value) {
    map.value.remove();
  }
});
</script>

<style scoped>
/* Suppression de l'attribution pour un look "App native" */
:deep(.maplibregl-ctrl-bottom-right),
:deep(.maplibregl-ctrl-bottom-left) {
  display: none !important;
}
</style>