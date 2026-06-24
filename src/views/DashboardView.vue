<script setup>
import { ref, shallowRef, onMounted } from 'vue';
import api from '@/api/axios';
import Map from "@/views/Map.vue";
import NavBar from "@/views/NavBar.vue";

const spots = shallowRef([]);
const isAddingMode = ref(false);
const newSpotCoords = ref(null);

// Charger les spots ET les favoris en parallèle
const fetchSpots = async () => {
  try {

    const [spotsResponse, favoritesResponse] = await Promise.all([
      api.get('/Spots'),
      api.get('/Spots/favorites').catch(() => ({ data: [] }))
    ]);


    const favoriteSpotIds = new Set(
        favoritesResponse.data?.map(fav => fav.spotsId || fav.id) || []
    );

    if (spotsResponse.data && Array.isArray(spotsResponse.data)) {
      spots.value = spotsResponse.data.map(spot => {
        const id = spot.spotsId || spot.id;
        return {
          ...spot,
          spotsId: id,
          isFavorite: favoriteSpotIds.has(id)
        };
      });
    }

    console.log("Spots avec état favori prêts pour la Map :", spots.value);
  } catch (error) {
    console.error("Erreur lors de la récup des spots :", error);
    spots.value = [{
      id: 0,
      spotsId: 0,
      title: "Erreur API - Mode Local",
      latitude: 50.679083,
      longitude: 5.694040,
      description: "Impossible de joindre le serveur C#",
      isFavorite: false
    }];
  }
};

const handleAddSpotClick = () => {
  isAddingMode.value = !isAddingMode.value;
  if (!isAddingMode.value) {
    newSpotCoords.value = null;
  }
};

const handleCoordsCaptured = (coords) => {
  newSpotCoords.value = coords;
  isAddingMode.value = false;
};

const handleCloseForm = () => {
  newSpotCoords.value = null;
};

// Fonction pour rafraîchir la liste après une création réussie
const handleSpotCreated = () => {
  newSpotCoords.value = null;
  fetchSpots();
};

onMounted(() => {
  fetchSpots();
});
</script>
<template>

  <div class="relative h-[100dvh] w-full bg-[#F4F7F5] text-[#1E2E2A] overflow-hidden font-sans antialiased selection:bg-[#00A896]/20">

    <transition name="slide-down">
      <div
          v-if="isAddingMode"
          class="absolute top-28 left-0 right-0 z-[3000] flex justify-center px-4 pointer-events-none"
      >
        <div class="bg-[#FF6B6B] text-white px-5 py-2.5 rounded-full font-medium text-xs tracking-wide shadow-md shadow-[#FF6B6B]/10 animate-bounce text-center max-w-xs pointer-events-auto border border-white/10">
          Touche la carte pour placer ton spot 📍
        </div>
      </div>
    </transition>

    <main class="w-full h-full z-0">
      <Map
          :spots="spots"
          :is-adding-mode="isAddingMode"
          :new-spot-coords="newSpotCoords"
          @coords-captured="handleCoordsCaptured"
          @close-form="handleCloseForm"
          @spot-created="handleSpotCreated"
      />
    </main>

    <footer>
      <NavBar @add-spot="handleAddSpotClick" />
    </footer>
  </div>
</template>

<style scoped>
/* Rendu ultra-propre sur les écrans Retina/MacBook */
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Animation fluide pour faire descendre/monter le petit bandeau orange */
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-down-enter-from, .slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>