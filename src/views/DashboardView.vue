<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import Map from "@/views/Map.vue";
import NavBar from "@/views/NavBar.vue";

const spots = ref([]);

const fetchSpots = async () => {
  try {

    spots.value = [{
      id: 1,
      title: "Home",
      latitude: 50.679083,
      longitude: 5.694040,
      description: "Test local sans API"
    }];
  } catch (error) {
    console.error("Erreur lors de la récup des spots", error);
  }
};
</script>

<template>
  <div class="dashboard">
    <NavBar />
    <main>

      <Map :spots="spots" />
    </main>
  </div>
</template>