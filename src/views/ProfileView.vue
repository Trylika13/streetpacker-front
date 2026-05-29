<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'

const router = useRouter()
const activeTab = ref('spots') // 'spots', 'favorites', 'settings'
const user = ref({
  username: '',
  email: '',
})

const mySpots = ref([])
const myFavorites = ref([])
const loading = ref(true)
const isUpdating = ref(false)

const showDeleteModal = ref(false)

// --- NOUVEAU : Gestion de l'édition de spot ---
const showEditModal = ref(false)
const spotToEdit = ref({ id: '', title: '', description: '', imageUrl: '' })

// --------------------------------
// ACTIONS SUR LE COMPTE
// --------------------------------
const deleteAccount = async () => {
  try {
    await api.delete('/users/me')
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    router.push('/')
  } catch (err) {
    console.error("Erreur lors de la suppression du compte :", err)
    alert("Impossible de supprimer le compte pour le moment.")
  } finally {
    showDeleteModal.value = false
  }
}

const updateProfile = async () => {
  try {
    isUpdating.value = true
    await api.put('/users/update', {
      username: user.value.username,
      email: user.value.email })
    alert("Profil mis à jour, backpacker !")
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

// --------------------------------
// ACTIONS SUR LES SPOTS (NOUVEAU)
// --------------------------------
const deleteSpot = async (id: string) => {
  if (!confirm("Sûr de vouloir supprimer ce spot de la carte ?")) return;

  try {
    await api.delete(`/spots/${id}`)
    // On retire le spot de la liste locale direct
    mySpots.value = mySpots.value.filter(s => s.id !== id)
  } catch (error) {
    console.error("Erreur lors de la suppression du spot:", error)
  }
}

const openEditModal = (spot: any) => {
  // Copie propre pour ne pas modifier l'affichage en direct
  spotToEdit.value = { ...spot }
  showEditModal.value = true
}

const saveSpot = async () => {
  try {
    const payload = {
      title: spotToEdit.value.title,
      description: spotToEdit.value.description,
      imageUrl: spotToEdit.value.imageUrl || ''
    }

    await api.put(`/spots/${spotToEdit.value.id}`, payload)

    // Mise à jour de l'affichage
    const index = mySpots.value.findIndex(s => s.id === spotToEdit.value.id)
    if (index !== -1) {
      mySpots.value[index] = { ...spotToEdit.value }
    }

    showEditModal.value = false
  } catch (error) {
    console.error("Erreur lors de la modification du spot:", error)
  }
}

// --------------------------------
// CHARGEMENT INITIAL
// --------------------------------
const fetchProfileData = async () => {
  try {
    loading.value = true

    try {
      const userRes = await api.get('/users/me')
      user.value = userRes.data
    } catch (e) {
      console.warn("Route /users/me pas encore prête ou erreur.")
    }

    try {
      const spotsRes = await api.get('/spots/my-spots')
      mySpots.value = spotsRes.data
    } catch (e) {
      console.error("Erreur sur /spots/my-spots :", e)
    }

    /* try {
      const favsRes = await api.get('/favorites/my-favorites')
      myFavorites.value = favsRes.data
    } catch (e) {
      console.warn("Route favoris pas encore prête.")
    } */

  } catch (err) {
    console.error("Erreur générale profile:", err)
  } finally {
    loading.value = false
  }
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
      <button @click="activeTab = 'spots'" :class="activeTab === 'spots' ? 'text-[#00cba9] border-b-2 border-[#00cba9]' : 'text-white/30'" class="pb-4 text-[10px] font-black uppercase tracking-widest transition-all">Mes Spots</button>
      <button @click="activeTab = 'favorites'" :class="activeTab === 'favorites' ? 'text-[#00cba9] border-b-2 border-[#00cba9]' : 'text-white/30'" class="pb-4 text-[10px] font-black uppercase tracking-widest transition-all">Favoris</button>
      <button @click="activeTab = 'settings'" :class="activeTab === 'settings' ? 'text-[#00cba9] border-b-2 border-[#00cba9]' : 'text-white/30'" class="pb-4 text-[10px] font-black uppercase tracking-widest transition-all">Infos</button>
    </div>

    <div class="p-6">

      <div v-if="activeTab === 'spots'" class="space-y-4">
        <div v-if="mySpots.length === 0" class="text-center py-10 text-white/20 italic text-sm">Tu n'as pas encore partagé de spot.</div>

        <div v-for="spot in mySpots" :key="spot.id" class="bg-[#112220] p-4 rounded-2xl border border-white/5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-[#ff7e5f]/10 flex items-center justify-center text-[#ff7e5f] shrink-0">📍</div>

          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-sm truncate">{{ spot.title }}</h4>
            <p class="text-xs text-white/40 truncate">{{ spot.description }}</p>
          </div>

          <div class="flex gap-3 shrink-0">
            <button @click="openEditModal(spot)" class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-[#00cba9] hover:bg-[#00cba9]/10 transition-colors">
              ✏️
            </button>
            <button @click="deleteSpot(spot.id)" class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-red-500 hover:bg-red-500/10 transition-colors">
              🗑️
            </button>
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
            <label class="text-[9px] uppercase tracking-widest text-teal-500 font-black ml-1">Pseudo</label>
            <input v-model="user.username" type="text" class="w-full h-14 bg-[#112220] border border-[#1a3532] rounded-2xl px-5 text-sm" />
          </div>
          <div class="space-y-2">
            <label class="text-[9px] uppercase tracking-widest text-teal-500 font-black ml-1">Email</label>
            <input v-model="user.email" type="email" class="w-full h-14 bg-[#112220] border border-[#1a3532] rounded-2xl px-5 text-sm" />
          </div>
          <button @click="updateProfile" class="w-full py-4 bg-[#112220] text-[#00cba9] border border-[#00cba9]/30 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
            Mettre à jour mes infos
          </button>
        </div>

        <div class="mt-10 space-y-4">
          <button @click="logout" class="w-full py-4 bg-[#ff7e5f]/10 text-[#ff7e5f] border border-[#ff7e5f]/20 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
            Se déconnecter
          </button>
          <button @click="showDeleteModal = true" class="w-full py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d161c]/80 backdrop-blur-sm">
    <div class="w-full max-w-sm p-6 bg-[#112220] border border-red-500/30 rounded-3xl shadow-2xl shadow-red-500/10">
      <h3 class="text-xl font-black text-white mb-2 uppercase tracking-tight">Quitter l'aventure ?</h3>
      <p class="text-white/60 mb-8 text-sm leading-relaxed">Cette action est irréversible. Ton profil et l'intégralité de tes spots seront supprimés définitivement de la carte.</p>
      <div class="flex flex-col gap-3">
        <button @click="deleteAccount" class="w-full py-3 text-sm font-black text-white uppercase tracking-widest bg-red-500 rounded-xl hover:bg-red-600 transition-colors active:scale-95 shadow-lg shadow-red-500/20">Oui, tout supprimer</button>
        <button @click="showDeleteModal = false" class="w-full py-3 text-sm font-black text-white/60 uppercase tracking-widest bg-white/5 rounded-xl hover:bg-white/10 transition-colors">Annuler</button>
      </div>
    </div>
  </div>

  <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d161c]/80 backdrop-blur-sm">
    <div class="w-full max-w-sm p-6 bg-[#112220] border border-[#00cba9]/30 rounded-3xl shadow-2xl shadow-[#00cba9]/10">
      <h3 class="text-xl font-black text-white mb-6 uppercase tracking-tight">Modifier le spot</h3>

      <div class="space-y-4 mb-8">
        <div class="space-y-2">
          <label class="text-[9px] uppercase tracking-widest text-[#00cba9] font-black ml-1">Nom du spot</label>
          <input v-model="spotToEdit.title" type="text" class="w-full h-12 bg-[#0d161c] border border-[#1a3532] rounded-xl px-4 text-sm text-white focus:border-[#00cba9] outline-none transition-colors" />
        </div>

        <div class="space-y-2">
          <label class="text-[9px] uppercase tracking-widest text-[#00cba9] font-black ml-1">Description</label>
          <textarea v-model="spotToEdit.description" rows="3" class="w-full bg-[#0d161c] border border-[#1a3532] rounded-xl p-4 text-sm text-white focus:border-[#00cba9] outline-none transition-colors resize-none"></textarea>
        </div>

        <div class="space-y-2">
          <label class="text-[9px] uppercase tracking-widest text-[#00cba9] font-black ml-1">Lien de l'image</label>
          <input v-model="spotToEdit.imageUrl" type="text" class="w-full h-12 bg-[#0d161c] border border-[#1a3532] rounded-xl px-4 text-sm text-white focus:border-[#00cba9] outline-none transition-colors" />
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <button @click="saveSpot" class="w-full py-3 text-sm font-black text-[#0d161c] uppercase tracking-widest bg-[#00cba9] rounded-xl hover:bg-[#00e3bd] transition-colors active:scale-95 shadow-lg shadow-[#00cba9]/20">
          Sauvegarder
        </button>
        <button @click="showEditModal = false" class="w-full py-3 text-sm font-black text-white/60 uppercase tracking-widest bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>