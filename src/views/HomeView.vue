<script setup lang="ts">
import { useRouter } from 'vue-router';
import geckoLogo from '@/assets/gecko.svg';
const router = useRouter();
</script>

<template>
  <div class="min-h-screen bg-[#F4F7F5] text-[#1E2E2A] flex items-center justify-center font-sans relative overflow-hidden selection:bg-[#00A896]/20">

    <div class="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#FF6B6B]/10 blur-[100px] pointer-events-none"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#00A896]/10 blur-[100px] pointer-events-none"></div>

    <div class="w-full max-w-5xl px-6 py-12 flex flex-col lg:flex-row lg:items-center justify-between gap-16 z-10">

      <div class="flex flex-col items-start max-w-sm">
        <!-- 🦎 LOGO AGRANDI : Passage en w-14 h-14 pour asseoir l'identité visuelle de StreetPacker -->
        <div class="flex items-center gap-3 mb-6 opacity-95">
          <img :src="geckoLogo" alt="StreetPacker Gecko" class="w-14 h-14 object-contain" />
        </div>

        <h1 class="text-5xl lg:text-7xl font-light tracking-tight text-[#1E2E2A] leading-none mb-6">
          Street<span class="font-medium text-[#FF6B6B]">packer</span>
        </h1>

        <p class="text-sm text-[#5C756E] leading-relaxed">
          Partage tes spots cachés, localise les points d'eau essentiels et voyage hors des sentiers battus. Conçu par et pour les backpackers.
        </p>
      </div>

      <div class="w-full max-w-sm bg-white border border-[#E4ECE9] p-8 lg:p-10 rounded-[2rem] shadow-sm flex flex-col gap-4">

        <p class="text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold mb-2">
          Prêt pour l'exploration ?
        </p>

        <button
            @click="router.push('/login')"
            class="w-full h-14 rounded-xl bg-[#00A896] text-white font-medium text-sm tracking-wide active:scale-[0.98] hover:bg-[#009282] transition-all shadow-sm"
        >
          Se connecter
        </button>

        <button
            @click="router.push('/register')"
            class="w-full h-14 rounded-xl bg-[#F4F7F5] text-[#1E2E2A] text-sm font-medium active:scale-[0.98] hover:bg-[#EAF0EC] transition-all"
        >
          Créer un compte
        </button>

        <div class="mt-4 pt-4 border-t border-[#F4F7F5] flex justify-between items-center text-[10px] uppercase tracking-wider text-[#5C756E]/60">
          <span>Version 1.1.0</span>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>