<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios'; // Ton instance axios configurée
import Map from "@/views/Map.vue";
import NavBar from "@/views/NavBar.vue";

const spots = ref([]);

const fetchSpots = async () => {
  try {
    // 1. On décommente l'appel réel à ton API C#
    const response = await api.get('/spots');

    // 2. On assigne les données reçues de la DB
    spots.value = response.data;

    console.log("Spots récupérés de la DB :", spots.value);
  } catch (error) {
    console.error("Erreur lors de la récup des spots :", error);

    // Optionnel : Garder le fallback "Home" si l'API échoue
    spots.value = [{
      id: 0,
      title: "Erreur API - Mode Local",
      latitude: 50.679083,
      longitude: 5.694040,
      description: "Impossible de joindre le serveur C#"
    }];
  }
};

onMounted(() => {
  fetchSpots();
});
</script>

<template>
  <div class="dashboard">
    <main>
      <Map :spots="spots" />
    </main>
    <footer>
      <NavBar />
    </footer>
  </div>
</template>