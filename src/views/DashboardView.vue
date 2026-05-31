<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import Map from "@/views/Map.vue";
import NavBar from "@/views/NavBar.vue";

const spots = ref([]);

// Ajouter les états pour la gestion de l'ajout d'un spot
const isAddingMode = ref(false);
const newSpotCoords = ref(null);

const fetchSpots = async () => {
  try {
    const response = await api.get('/spots');
    spots.value = response.data;
    console.log("Spots récupérés de la DB :", spots.value);
  } catch (error) {
    console.error("Erreur lors de la récup des spots :", error);
    spots.value = [{
      id: 0,
      title: "Erreur API - Mode Local",
      latitude: 50.679083,
      longitude: 5.694040,
      description: "Impossible de joindre le serveur C#"
    }];
  }
};


const handleAddSpotClick = () => {
  isAddingMode.value = !isAddingMode.value;
  if (!isAddingMode.value) {
    newSpotCoords.value = null; // Reset si l'utilisateur annule en cliquant à nouveau sur la nav
  }
};

const handleCoordsCaptured = (coords) => {
  newSpotCoords.value = coords;
  isAddingMode.value = false; // On a les coordonnées, on coupe le mode "ciblage" pour ouvrir le formulaire
};

const handleCloseForm = () => {
  newSpotCoords.value = null;
};

// Étape 3 : Fonction pour rafraîchir la liste après une création réussie
const handleSpotCreated = () => {
  newSpotCoords.value = null;
  fetchSpots(); // On recharge les marqueurs pour voir le nouveau apparaître sur la carte !
};

onMounted(() => {
  fetchSpots();
});
</script>

<template>
  <div class="relative min-h-screen bg-[#0d161c] text-white overflow-hidden">

    <transition name="slide-down">
      <div
          v-if="isAddingMode"
          class="absolute top-14 left-0 right-0 z-[3000] flex justify-center px-4 pointer-events-none"
      >
        <div class="bg-[#ff7e5f] text-[#0d161c] px-6 py-3 rounded-full font-black uppercase text-xs tracking-wider shadow-xl shadow-[#ff7e5f]/20 animate-bounce text-center max-w-xs sm:max-w-md pointer-events-auto">
          📍 Touche la carte pour placer le spot
        </div>
      </div>
    </transition>

    <main class="w-full h-screen">
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
/* Animation fluide pour faire descendre/monter le petit bandeau orange */
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-down-enter-from, .slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>