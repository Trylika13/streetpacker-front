<script setup lang="ts">
import { onMounted, ref } from 'vue'
import api from '@/api/axios'

const spots = ref([])

onMounted(async () => {
  try {
    const response = await api.get('/spots')
    spots.value = response.data
  } catch (err) {
    console.error("❌ Erreur dans le composant :", err)
  }
})
</script>

<template>
  <div style="padding: 20px; font-family: sans-serif;">
    <h1 style="color: #2c3e50;">StreetPacker Dashboard</h1>
    <p v-if="spots.length === 0">Chargement des spots ou aucun spot trouvé...</p>

    <div v-else style="display: grid; gap: 15px; margin-top: 20px;">
      <div v-for="spot in spots" :key="spot.id"
           style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: #f9f9f9;">
        <h3 style="margin: 0;">{{ spot.title }}</h3>
        <p style="color: #666;">{{ spot.description }}</p>
      </div>
    </div>
  </div>
</template>