<template>
  <nav class="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-100 z-[2000] px-6 pb-4">
    <div class="flex justify-between items-center h-full max-w-md mx-auto relative">

      <router-link
          to="/marketplace"
          class="flex flex-col items-center justify-center w-16 text-gray-400 transition-all"
          active-class="text-emerald-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <span class="text-[10px] font-bold mt-1 uppercase tracking-tighter">Boutique</span>
      </router-link>

      <div class="relative -top-5">
        <button
            @click="$emit('add-spot')"
            class="bg-emerald-600 p-4 rounded-2xl shadow-xl shadow-emerald-200 active:scale-90 transition-transform border-4 border-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <router-link
          to="/profile"
          class="flex flex-col items-center justify-center w-16 text-gray-400 transition-all"
          active-class="text-emerald-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="text-[10px] font-bold mt-1 uppercase tracking-tighter">Profil</span>
      </router-link>

    </div>
  </nav>
</template>