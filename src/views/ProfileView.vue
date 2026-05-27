<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()
const activeTab = ref('spots') // 'spots', 'favorites', 'settings'
const user = ref({
  username: 'Backpacker',
  email: '',
})

const mySpots = ref([])
const myFavorites = ref([])
const loading = ref(true)
const isUpdating = ref(false)

const fetchProfileData = async () => {
  try {
    loading.value = true

    // 1. Récupérer les infos du User connecté
    try {
      const userRes = await api.get('/users/me')
      user.value = userRes.data
    } catch (e) {
      console.warn("Route /users/me pas encore prête ou erreur. On garde le profil par défaut.")
    }

    // 2. Ta nouvelle route C# Clean Archi !
    try {
      const spotsRes = await api.get('/spots/my-spots')
      mySpots.value = spotsRes.data
    } catch (e) {
      console.error("Erreur sur /spots/my-spots :", e)
    }

    // 3. Les favoris (Tu pourras décommenter quand ton back sera prêt)
    /* try {
      const favsRes = await api.get('/favorites/my-favorites')
      myFavorites.value = favsRes.data
    } catch (e) {
      console.warn("Route favoris pas encore prête.")
    }
    */

  } catch (err) {
    console.error("Erreur générale profile:", err)
  } finally {
    loading.value = false
  }
}

// Fonction pour modifier les infos (v-model relié à l'input email)
const updateProfile = async () => {
  try {
    isUpdating.value = true
    await api.put('/users/update', {
      email: user.value.email
    })
    alert("Profil mis à jour, backpacker ! 🎒")
  } catch (err) {
    console.error("Erreur update:", err)
    alert("Impossible de mettre à jour les infos.")
  } finally {
    isUpdating.value = false
  }
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  router.push('/login')
}

onMounted(fetchProfileData)
</script>

<template>
  <div class="min-h-screen bg-[#0d161c] text-white pb-32">
    <div class="p-8 pt-12 bg-gradient-to-b from-[#112220] to-[#0d161c] rounded-b-[3rem] border-b border-white/5">
      <div class="flex flex-col items-center">
        <div class="w-24 h-24 rounded-3xl bg-[#00cba9]/20 border-2 border-[#00cba9] flex items-center justify-center mb-4 shadow-xl shadow-[#00cba9]/10">
          <span class="text-4xl font-black text-[#00cba9]">{{ user.username.charAt(0).toUpperCase() }}</span>
        </div>
        <h2 class="text-2xl font-black tracking-tight uppercase">{{ user.username }}</h2>
        <p class="text-teal-500/60 text-sm font-bold tracking-widest uppercase mt-1">Backpacker Certifié</p>

        <div class="flex gap-8 mt-8 w-full max-w-xs">
          <div class="flex-1 text-center">
            <div class="text-xl font-black text-[#ff7e5f]">{{ mySpots.length }}</div>
            <div class="text-[10px] uppercase text-white/40 tracking-widest font-bold">Spots</div>
          </div>
          <div class="w-px h-8 bg-white/10 self-center"></div>
          <div class="flex-1 text-center">
            <div class="text-xl font-black text-[#ff7e5f]">{{ myFavorites.length }}</div>
            <div class="text-[10px] uppercase text-white/40 tracking-widest font-bold">Favoris</div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-around px-6 mt-8 border-b border-white/5">
      <button
          @click="activeTab = 'spots'"
          :class="activeTab === 'spots' ? 'text-[#00cba9] border-b-2 border-[#00cba9]' : 'text-white/30'"
          class="pb-4 text-[10px] font-black uppercase tracking-widest transition-all"
      >
        Mes Spots
      </button>
      <button
          @click="activeTab = 'favorites'"
          :class="activeTab === 'favorites' ? 'text-[#00cba9] border-b-2 border-[#00cba9]' : 'text-white/30'"
          class="pb-4 text-[10px] font-black uppercase tracking-widest transition-all"
      >
        Favoris
      </button>
      <button
          @click="activeTab = 'settings'"
          :class="activeTab === 'settings' ? 'text-[#00cba9] border-b-2 border-[#00cba9]' : 'text-white/30'"
          class="pb-4 text-[10px] font-black uppercase tracking-widest transition-all"
      >
        Infos
      </button>
    </div>

    <div class="p-6">
      <div v-if="activeTab === 'spots'" class="space-y-4">
        <div v-if="mySpots.length === 0" class="text-center py-10 text-white/20 italic text-sm">Tu n'as pas encore partagé de spot.</div>
        <div v-for="spot in mySpots" :key="spot.id" class="bg-[#112220] p-4 rounded-2xl border border-white/5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-[#ff7e5f]/10 flex items-center justify-center text-[#ff7e5f]">📍</div>
          <div class="flex-1">
            <h4 class="font-bold text-sm">{{ spot.title }}</h4>
            <p class="text-xs text-white/40 truncate max-w-[200px]">{{ spot.description }}</p>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'favorites'" class="space-y-4">
        <div v-if="myFavorites.length === 0" class="text-center py-10 text-white/20 italic text-sm">Aucun favori pour le moment.</div>
        <div v-for="fav in myFavorites" :key="fav.id" class="bg-[#112220] p-4 rounded-2xl border border-white/5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500">❤️</div>
          <div class="flex-1">
            <h4 class="font-bold text-sm">{{ fav.title }}</h4>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'settings'" class="space-y-6">
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-[9px] uppercase tracking-widest text-teal-500 font-black ml-1">Email</label>
            <input v-model="user.email" type="email" class="w-full h-14 bg-[#112220] border border-[#1a3532] rounded-2xl px-5 text-sm" />
          </div>
          <button class="w-full py-4 bg-[#112220] text-[#00cba9] border border-[#00cba9]/30 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
            Mettre à jour mes infos
          </button>
        </div>

        <button
            @click="logout"
            class="w-full py-4 bg-[#ff7e5f]/10 text-[#ff7e5f] border border-[#ff7e5f]/20 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all mt-10"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  </div>
</template>