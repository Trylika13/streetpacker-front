<template>
  <div class="min-h-screen bg-[#F4F7F5] text-[#1E2E2A] pb-12 font-sans selection:bg-[#00A896]/10">

    <div class="bg-white border-b border-[#E4ECE9] p-4 sticky top-0 z-50 shadow-sm">
      <div class="max-w-5xl mx-auto flex items-center gap-4">
        <button @click="$router.back()" class="group p-2 bg-[#F4F7F5] rounded-full text-[#5C756E]/60 hover:text-[#00A896] transition-colors flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 class="text-base font-medium">Détails du Spot</h1>
          <p class="text-[9px] text-[#5C756E]/60 uppercase tracking-wider">Exploration sauvage</p>
        </div>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-4 mt-6">
      <div v-if="loading" class="text-center py-12 text-xs italic text-[#5C756E]/60">
        Chargement du lieu secret...
      </div>

      <div v-else-if="spot" class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-[#E4ECE9] rounded-[2rem] md:rounded-[3rem] p-5 md:p-8 shadow-sm items-stretch">

        <div v-if="spot.imageUrl" class="w-full h-64 md:h-full min-h-[300px] md:min-h-[450px] rounded-2xl md:rounded-[2rem] overflow-hidden border border-[#E4ECE9] bg-[#F4F7F5] relative">
          <img :src="spot.imageUrl" class="w-full h-full object-cover" alt="Spot" />

        </div>

        <div class="flex flex-col justify-between space-y-5 pt-2 md:pt-0">
          <div class="space-y-5">
            <div>
              <h2 class="text-xl md:text-2xl font-semibold tracking-tight text-[#1E2E2A] leading-tight">
                {{ spot.title }}
              </h2>
              <div class="flex items-center gap-1.5 mt-2 text-xs md:text-sm text-[#5C756E]/70">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#00A896]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <span>Partagé par <strong class="text-[#1E2E2A]">{{ spot.username }}</strong></span>
              </div>
            </div>

            <div class="flex items-center justify-between bg-[#F4F7F5]/60 border border-[#E4ECE9] rounded-xl p-3">
              <div class="flex items-center gap-2 text-xs font-medium text-[#5C756E]">
                <span class="relative flex h-2 w-2">
                  <span :class="spot.freshnessScore >= 75 ? 'bg-green-500' : spot.freshnessScore >= 25 ? 'bg-amber-500' : 'bg-red-500'" class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"></span>
                  <span :class="spot.freshnessScore >= 75 ? 'bg-green-500' : spot.freshnessScore >= 25 ? 'bg-amber-500' : 'bg-red-500'" class="relative inline-flex rounded-full h-2 w-2"></span>
                </span>
                <span>Indice de fraîcheur et fiabilité :</span>
              </div>
              <span class="text-xs font-bold text-[#1E2E2A] bg-white border border-[#E4ECE9] px-2 py-0.5 rounded-lg shadow-sm">
                {{ spot.freshnessScore }}%
              </span>
            </div>

            <div class="space-y-1.5">
              <span class="text-[10px] uppercase tracking-[0.15em] text-[#5C756E]/60 font-bold block">Notes de route</span>
              <p class="text-xs md:text-sm text-[#5C756E] leading-relaxed bg-[#F4F7F5]/30 p-3.5 rounded-xl border border-[#E4ECE9]/60 whitespace-pre-line">
                {{ spot.description || 'Aucune description fournie par le packer.' }}
              </p>
            </div>
          </div>

          <button
              @click="copyCoords(spot.latitude, spot.longitude)"
              class="w-full h-12 text-white rounded-xl flex items-center justify-center text-xs font-medium active:scale-95 transition-all shadow-sm gap-2 mt-4 md:mt-0"
              :class="isCopied ? 'bg-emerald-600' : 'bg-[#00A896] hover:bg-[#009485]'"
          >
            <svg v-if="!isCopied" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3a1 1 0 011-1h9a1 1 0 011 1v9a1 1 0 01-1 1h-4M4 7h6a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ isCopied ? 'Coordonnées copiées !' : 'Copier les coordonnées GPS' }}</span>
          </button>
        </div>

      </div>

      <div v-else class="text-center py-12 text-xs italic text-[#FF6B6B] bg-white border border-[#E4ECE9] rounded-[2rem]">
        Oups, impossible de mettre la main sur ce spot sauvage.
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/axios'

const route = useRoute()
const spot = ref(null)
const loading = ref(true)

const isCopied = ref(false)

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

onMounted(async () => {
  try {
    loading.value = true
    const res = await api.get(`/Spots/${route.params.id}`)
    spot.value = res.data
  } catch (err) {
    console.error("Erreur chargement détails spot:", err)
  } finally {
    loading.value = false
  }
})
</script>