<template>
  <div class="map-wrap">
    <div ref="mapContainer" class="map"></div>
  </div>
</template>

<script setup>
import { ref, shallowRef, onMounted, onUnmounted } from 'vue';
import { config, Map, MapStyle } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

const mapContainer = ref(null);
const map = shallowRef(null);
onMounted(() => {
  config.apiKey = '4FOCYl0j1EWf7D5remSs';

  if (mapContainer.value) {
    map.value = new Map({
      container: mapContainer.value,
      style: MapStyle.BASE,
      center: [5.694040, 50.679083], // Longitude, Latitude
      zoom: 15
    });
  }
});

onUnmounted(() => {
  if (map.value) {
    map.value.remove();
  }
});
</script>
<style scoped>
.map-wrap {
  width: 100%;
  height: 100vh;
  background-color: #eee;
}
.map {
  width: 100%;
  height: 100%;
}
</style>