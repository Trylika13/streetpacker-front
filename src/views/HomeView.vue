<script setup lang="ts">
import { useRouter } from 'vue-router';
import geckoLogo from '@/assets/gecko.svg'
const router = useRouter();
</script>

<template>
  <!-- Fond Deep Ocean -->
  <div class="min-h-screen bg-[#0d161c] flex flex-col items-center justify-between px-6 py-10 max-w-lg mx-auto overflow-hidden">

    <div class="flex-1 flex flex-col items-center justify-center text-center">
      <!-- Cercle Jungle avec effet de lueur -->
      <div class="relative group">
        <div class="relative w-36 h-36 rounded-[2.5rem] bg-[#112220] flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
          <img :src="geckoLogo" alt="StreetPacker Gecko" class="w-24 h-24 object-contain" />
        </div>
      </div>

      <h1 class="text-4xl font-black text-white mb-2 tracking-tight">
        STREET<span class="text-[#ff7e5f]">PACKER</span>
      </h1>

      <p class="text-teal-100/60 max-w-[250px] text-sm leading-relaxed font-medium">
        Par les backpackers, pour les backpackers
      </p>
    </div>

    <div class="w-full space-y-4 mb-4">
      <!-- Bouton Sunset Orange -->
      <button
          @click="router.push('/login')"
          class="w-full h-14 rounded-2xl bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] text-[#0d161c] font-black shadow-lg shadow-[#ff7e5f]/20 active:scale-95 transition-all uppercase tracking-wider"
      >
        Se connecter
      </button>

      <!-- Bouton Deep Jungle -->
      <button
          @click="router.push('/register')"
          class="w-full h-14 rounded-2xl bg-[#112220] text-[#00cba9] border border-[#1a3532] font-bold active:scale-95 transition-all"
      >
        Créer un compte
      </button>

      <p class="text-center text-[10px] uppercase tracking-[0.2em] text-teal-500/50 pt-4 font-bold">
        L'aventure commence ici
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Pour que le dégradé du texte soit fluide */
span {
  background-clip: text;
  -webkit-background-clip: text;
}
</style>