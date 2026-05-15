<script setup lang="ts">
import { useRouter } from 'vue-router';
import geckoLogo from '@/assets/gecko.svg'
const router = useRouter();
</script>

<template>
  <div class="min-h-screen bg-[#0d161c] flex flex-col lg:flex-row items-center justify-center px-6 py-10 overflow-hidden font-sans">

    <div class="flex flex-col lg:flex-row items-center justify-between w-full max-w-5xl gap-12 lg:gap-20">

      <div class="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
        <div class="relative group mb-8">
          <div class="absolute -inset-4 bg-[#ff7e5f]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <div class="relative w-36 h-36 lg:w-48 lg:h-48 rounded-[2.5rem] bg-[#112220] flex items-center justify-center border border-white/5 shadow-2xl transition-transform group-hover:rotate-3">
            <img :src="geckoLogo" alt="StreetPacker Gecko" class="w-24 h-24 lg:w-32 lg:h-32 object-contain" />
          </div>
        </div>

        <h1 class="text-4xl lg:text-7xl font-black text-white mb-4 tracking-tight leading-none">
          STREET<span class="text-[#ff7e5f] block lg:inline">PACKER</span>
        </h1>

        <p class="text-teal-100/60 max-w-[280px] lg:max-w-md text-sm lg:text-lg leading-relaxed font-medium">
          L'application communautaire par les backpackers, pour les backpackers.
          <span class="hidden lg:block mt-2 text-teal-500/40 italic">Explorez, partagez, voyagez autrement.</span>
        </p>
      </div>

      <div class="w-full max-w-sm space-y-4 flex flex-col shrink-0">
        <button
            @click="router.push('/login')"
            class="w-full h-14 lg:h-16 rounded-2xl bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] text-[#0d161c] font-black shadow-lg shadow-[#ff7e5f]/20 active:scale-95 hover:brightness-110 transition-all uppercase tracking-wider"
        >
          Se connecter
        </button>

        <button
            @click="router.push('/register')"
            class="w-full h-14 lg:h-16 rounded-2xl bg-[#112220] text-[#00cba9] border border-[#1a3532] font-bold active:scale-95 hover:bg-[#162d2a] transition-all"
        >
          Créer un compte
        </button>

        <p class="text-center lg:text-right text-[10px] uppercase tracking-[0.2em] text-teal-500/50 pt-4 font-bold">
          L'aventure commence ici
        </p>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>