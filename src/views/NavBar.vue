<template>
  <!--
    Sur mobile : fixed bottom-0 left-0 right-0 h-16 w-full border-t
    Sur laptop (lg:) : bottom-4 left-1/2 -translate-x-1/2 max-w-md rounded-2xl border
  -->
  <nav class="fixed bottom-0 lg:bottom-4 left-0 lg:left-1/2 right-0 lg:right-auto lg:-translate-x-1/2 h-16 w-full lg:w-[450px] bg-white/80 backdrop-blur-md border-t lg:border border-[#E4ECE9] lg:rounded-2xl z-[2000] px-6 shadow-sm">
    <div class="flex justify-between items-center h-full max-w-md mx-auto relative">

      <!-- SHOP / MARKETPLACE -->
      <router-link
          to="/marketplace"
          class="flex flex-col items-center justify-center w-16 text-[#5C756E]/50 transition-all hover:text-[#1E2E2A]"
          active-class="!text-[#00A896]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <span class="text-[9px] font-medium mt-1 uppercase tracking-wider">MarketPlace</span>
      </router-link>

      <!-- BOUTON CENTRAL : AJOUTER UN SPOT -->
      <div class="relative -top-4">
        <button
            @click="$emit('add-spot')"
            class="bg-[#00A896] p-3.5 rounded-full shadow-md shadow-[#00A896]/20 active:scale-90 transition-transform text-white border-4 border-[#F4F7F5]"
        >
          <!-- Remplace /xl par /svg juste ici -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <!-- PROFIL -->
      <router-link
          to="/profile"
          class="flex flex-col items-center justify-center w-16 text-[#5C756E]/50 transition-all hover:text-[#1E2E2A]"
          active-class="!text-[#00A896]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="text-[9px] font-medium mt-1 uppercase tracking-wider">Profil</span>
      </router-link>

    </div>
  </nav>
</template>

<style scoped>
.router-link-active svg {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}
</style>