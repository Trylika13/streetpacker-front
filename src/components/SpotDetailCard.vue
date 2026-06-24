<template>
  <div class="absolute bottom-0 left-0 right-0 lg:top-0 lg:bottom-auto lg:right-auto z-[3000] bg-white border-t lg:border-t-0 lg:border-r border-[#E4ECE9] text-[#1E2E2A] rounded-t-[2.5rem] lg:rounded-t-none lg:rounded-r-[2.5rem] shadow-[0_-10px_40px_rgba(9,17,14,0.08)] lg:shadow-[10px_0_40px_rgba(9,17,14,0.05)] p-6 pb-8 lg:pt-24 w-full max-w-md mx-auto overflow-y-auto max-h-[60vh] lg:max-h-full lg:h-full no-scrollbar">
    <div class="w-12 h-1 bg-[#E4ECE9] rounded-full mx-auto mb-5 lg:hidden"></div>

    <div class="flex justify-between items-start mb-4">
      <div>
        <h2 class="text-2xl font-light tracking-tight text-[#1E2E2A] leading-tight">
          {{ spot.title }}
        </h2>
        <p class="text-[10px] font-bold text-[#00A896] uppercase tracking-widest mt-1">
          Spot ajouté par {{ spot.username || 'un nomade' }}
        </p>
      </div>

      <button @click="emit('close')" class="p-2 bg-[#F4F7F5] rounded-full text-[#5C756E]/60 hover:text-[#1E2E2A] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <div class="flex items-center justify-between mb-5 bg-[#F4F7F5]/60 border border-[#E4ECE9] rounded-xl p-2.5">
      <div class="flex items-center gap-2">
        <span class="relative flex h-2 w-2">
          <span :class="{
            'bg-green-500': spot.freshnessScore >= 75,
            'bg-amber-500': spot.freshnessScore >= 25 && spot.freshnessScore < 75,
            'bg-red-500': spot.freshnessScore < 25
          }" class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"></span>
          <span :class="{
            'bg-green-500': spot.freshnessScore >= 75,
            'bg-amber-500': spot.freshnessScore >= 25 && spot.freshnessScore < 75,
            'bg-red-500': spot.freshnessScore < 25
          }" class="relative inline-flex rounded-full h-2 w-2"></span>
        </span>
        <span class="text-xs font-medium text-[#5C756E]">
          Indice de fiabilité :
          <span class="font-bold text-[#1E2E2A]">{{ spot.freshnessScore ?? 100 }}%</span>
        </span>
      </div>

      <div class="flex items-center gap-1 bg-white border border-[#E4ECE9] rounded-lg p-0.5 shadow-sm">
        <button @click="emit('vote', true)" class="p-1.5 text-[#5C756E]/70 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200" title="Valider (+25%)">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
          </svg>
        </button>
        <div class="w-[1px] h-3 bg-[#E4ECE9]"></div>
        <button @click="emit('vote', false)" class="p-1.5 text-[#5C756E]/70 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200" title="Signaler un problème (-25%)">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
          </svg>
        </button>
      </div>
    </div>

    <p class="text-[#5C756E] text-sm leading-relaxed mb-6">
      {{ spot.description || 'Aucune description disponible pour ce lieu.' }}
    </p>

    <div v-if="spot.imageUrl" class="w-full h-44 lg:h-56 rounded-2xl overflow-hidden mb-6 border border-[#E4ECE9]">
      <img :src="spot.imageUrl" class="w-full h-full object-cover" alt="Visuel du spot" />
    </div>

    <div class="flex gap-3">
      <button @click="emit('copy-coords')" class="flex-1 h-12 font-medium rounded-xl shadow-sm active:scale-95 transition-all text-sm tracking-wide flex items-center justify-center gap-2" :class="isCopied ? 'bg-[#1E2E2A] text-[#00A896] border border-[#00A896]/20' : 'bg-[#00A896] text-white'">
        <span>{{ isCopied ? 'Coordonnées copiées' : 'Copier les coordonnées' }}</span>
      </button>

      <button @click="emit('toggle-favorite')" class="px-4 bg-[#F4F7F5] rounded-xl transition-colors border border-[#E4ECE9] flex items-center justify-center active:scale-90" :class="spot.isFavorite ? 'text-[#FF6B6B]' : 'text-[#5C756E] hover:text-[#FF6B6B]'">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :fill="spot.isFavorite ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>

    <div v-if="isOwner || isAdmin" class="mt-5 pt-4 border-t border-[#E4ECE9]">
      <button @click="emit('delete')" class="w-full h-12 bg-[#FF6B6B]/10 hover:bg-[#FF6B6B] text-[#FF6B6B] hover:text-white font-medium rounded-xl text-sm transition-all flex items-center justify-center gap-2 active:scale-95 border border-[#FF6B6B]/20">
        {{ isAdmin ? 'Supprimer le spot (Mode Admin Global)' : 'Supprimer mon spot' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Spot {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  freshnessScore: number;
  userId: string;
  isFavorite?: boolean;
  username?: string;
}

defineProps<{
  spot: Spot;
  isCopied: boolean;
  isOwner: boolean;
  isAdmin: boolean;
}>()

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'vote', isUpvote: boolean): void;
  (e: 'copy-coords'): void;
  (e: 'toggle-favorite'): void;
  (e: 'delete'): void;
}>()
</script>