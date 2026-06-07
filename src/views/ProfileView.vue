<template>
  <div class="min-h-screen bg-[#F4F7F5] text-[#1E2E2A] pb-24 lg:pb-0 font-sans relative overflow-x-hidden selection:bg-[#00A896]/20 lg:flex lg:items-stretch">

    <div class="p-6 pt-8 bg-white border-b lg:border-b-0 lg:border-r border-[#E4ECE9] relative lg:w-96 lg:shrink-0 lg:flex lg:flex-col lg:justify-between lg:h-screen lg:sticky lg:top-0 lg:pt-16">

      <div class="flex flex-col items-center mt-4 lg:mt-0 w-full">
        <div class="absolute top-6 left-6">
          <button
              @click="router.push('/dashboard')"
              class="group p-2 bg-[#F4F7F5] rounded-full text-[#5C756E]/60 hover:text-[#00A896] transition-colors flex items-center justify-center"
              title="Retour à la carte"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div class="relative group mb-3">
          <div
              @click="triggerAvatarUpload"
              class="w-20 h-20 lg:w-24 lg:h-24 rounded-full border border-[#E4ECE9] bg-[#F4F7F5] flex items-center justify-center shadow-sm overflow-hidden cursor-pointer hover:border-[#00A896] transition-colors relative"
          >
            <img v-if="user.avatarUrl || user.AvatarUrl" :src="user.avatarUrl || user.AvatarUrl" alt="Avatar" class="w-full h-full object-cover" />
            <span v-else class="text-2xl font-light text-[#5C756E]">{{ user.username ? user.username.charAt(0).toUpperCase() : '?' }}</span>

            <div v-if="isUploadingAvatar" class="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div class="w-5 h-5 border-2 border-[#00A896] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          <input type="file" ref="avatarInput" class="hidden" accept="image/*" @change="handleAvatarChange" />
        </div>

        <h2 class="text-xl lg:text-2xl font-medium tracking-tight text-[#1E2E2A] text-center">{{ user.username }}</h2>

        <p class="text-[10px] text-[#00A896] font-bold uppercase tracking-widest mt-1 flex items-center gap-1 justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Explorateur Nomade
        </p>

        <div class="flex gap-12 mt-6 w-full max-w-xs justify-center lg:mt-8">
          <div class="text-center">
            <div class="text-lg lg:text-xl font-medium text-[#1E2E2A]">{{ mySpots.length }}</div>
            <div class="text-[9px] uppercase text-[#5C756E]/60 tracking-wider">Spots</div>
          </div>
          <div class="w-px h-6 bg-[#E4ECE9] self-center"></div>
          <div class="text-center">
            <div class="text-lg lg:text-xl font-medium text-[#1E2E2A]">{{ myFavorites.length }}</div>
            <div class="text-[9px] uppercase text-[#5C756E]/60 tracking-wider">Favoris</div>
          </div>
        </div>
      </div>

      <div class="hidden lg:block w-full space-y-5 border-t border-[#E4ECE9] pt-6 mt-auto">
        <div class="relative border-b border-[#E4ECE9] focus-within:border-[#00A896] transition-colors pb-1">
          <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold mb-1">Pseudo</label>
          <input v-model="user.username" type="text" class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none h-8" />
        </div>

        <div class="relative border-b border-[#E4ECE9] focus-within:border-[#00A896] transition-colors pb-1">
          <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold mb-1">Email</label>
          <input v-model="user.email" type="email" class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none h-8" />
        </div>

        <button @click="updateProfile" class="w-full h-10 bg-[#00A896] text-white rounded-xl font-medium text-xs tracking-wider active:scale-95 transition-all">
          {{ isUpdating ? 'Mise à jour...' : 'Sauvegarder' }}
        </button>

        <div class="flex gap-2 pt-2">
          <button @click="logout" class="w-1/2 h-9 bg-[#F4F7F5] text-[#5C756E] border border-[#E4ECE9] rounded-xl font-medium text-[11px] active:scale-95 transition-all">Déconnexion</button>
          <button @click="showDeleteModal = true" class="w-1/2 h-9 bg-transparent text-[#FF6B6B] border border-[#FF6B6B]/20 rounded-xl font-medium text-[11px] active:scale-95 transition-all">Supprimer</button>
        </div>
      </div>

    </div>

    <div class="flex-1 lg:flex lg:flex-col lg:h-screen lg:overflow-hidden">

      <div class="flex justify-around lg:justify-start lg:gap-12 lg:px-12 bg-white border-b border-[#E4ECE9]">
        <button @click="activeTab = 'spots'" :class="activeTab === 'spots' ? 'text-[#00A896] border-b-2 border-[#00A896]' : 'text-[#5C756E]/40'" class="pb-3 pt-3 lg:pb-4 lg:pt-5 text-[10px] font-semibold uppercase tracking-wider transition-all outline-none">Mes Spots</button>
        <button @click="activeTab = 'favorites'" :class="activeTab === 'favorites' ? 'text-[#00A896] border-b-2 border-[#00A896]' : 'text-[#5C756E]/40'" class="pb-3 pt-3 lg:pb-4 lg:pt-5 text-[10px] font-semibold uppercase tracking-wider transition-all outline-none">Favoris</button>
        <button @click="activeTab = 'settings'" :class="activeTab === 'settings' ? 'text-[#00A896] border-b-2 border-[#00A896]' : 'text-[#5C756E]/40'" class="lg:hidden pb-3 pt-3 text-[10px] font-semibold uppercase tracking-wider transition-all outline-none">Configuration</button>
      </div>

      <div class="p-4 max-w-md lg:max-w-4xl lg:w-full mx-auto lg:mx-0 lg:p-8 lg:overflow-y-auto lg:flex-1 no-scrollbar">

        <div v-if="activeTab === 'spots'" class="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          <div v-if="mySpots.length === 0" class="text-center py-12 lg:col-span-2 text-[#5C756E]/40 italic text-xs">Aucun spot partagé pour le moment.</div>

          <div v-for="spot in mySpots" :key="spot.id" class="bg-white p-4 rounded-2xl border border-[#E4ECE9] flex items-center justify-between gap-4 shadow-sm hover:border-[#00A896]/30 transition-colors">
            <div class="flex-1 min-w-0">
              <h4 class="font-medium text-sm text-[#1E2E2A] truncate">{{ spot.title || spot.Title }}</h4>
              <p class="text-xs text-[#5C756E]/70 truncate mt-0.5">{{ spot.description || spot.Description }}</p>
            </div>
            <div class="flex gap-1 shrink-0">
              <button @click="openEditModal(spot)" class="p-2 text-[#5C756E]/60 hover:text-[#00A896] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button @click="deleteSpot(spot.id)" class="p-2 text-[#5C756E]/60 hover:text-[#FF6B6B] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'favorites'" class="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          <div v-if="myFavorites.length === 0" class="text-center py-12 lg:col-span-2 text-[#5C756E]/40 italic text-xs">Aucun favori enregistré.</div>

          <div v-for="fav in myFavorites" :key="fav.id" class="bg-white p-4 rounded-2xl border border-[#E4ECE9] flex items-center gap-3 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#FF6B6B]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <h4 class="font-medium text-sm text-[#1E2E2A] truncate">{{ fav.title || fav.Title }}</h4>
          </div>
        </div>

        <div v-if="activeTab === 'settings'" class="lg:hidden space-y-6 pt-2">
          <div class="space-y-5 bg-white p-6 rounded-2xl border border-[#E4ECE9] shadow-sm">
            <div class="relative border-b border-[#E4ECE9] focus-within:border-[#00A896] transition-colors pb-1">
              <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold mb-1">Pseudo</label>
              <input v-model="user.username" type="text" class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none h-8" />
            </div>

            <div class="relative border-b border-[#E4ECE9] focus-within:border-[#00A896] transition-colors pb-1">
              <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold mb-1">Email</label>
              <input v-model="user.email" type="email" class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none h-8" />
            </div>

            <button @click="updateProfile" class="w-full h-11 bg-[#00A896] text-white rounded-xl font-medium text-xs tracking-wider active:scale-95 transition-all mt-2">
              {{ isUpdating ? 'Mise à jour...' : 'Sauvegarder les modifications' }}
            </button>
          </div>

          <div class="space-y-2 pt-4">
            <button @click="logout" class="w-full h-11 bg-[#F4F7F5] text-[#5C756E] border border-[#E4ECE9] rounded-xl font-medium text-xs tracking-wider active:scale-95 transition-all">Se déconnecter</button>
            <button @click="showDeleteModal = true" class="w-full h-11 bg-transparent text-[#FF6B6B] border border-[#FF6B6B]/20 rounded-xl font-medium text-xs tracking-wider active:scale-95 transition-all">Supprimer le compte</button>
          </div>
        </div>

      </div>
    </div>

    <transition
        enter-active-class="transform transition ease-out duration-300"
        enter-from-class="translate-y-full lg:opacity-0 lg:scale-95 lg:translate-y-0"
        enter-to-class="translate-y-0 lg:opacity-100 lg:scale-100 lg:translate-y-0"
        leave-active-class="transform transition ease-in duration-200"
        leave-from-class="translate-y-0 lg:opacity-100 lg:scale-100 lg:translate-y-0"
        leave-to-class="translate-y-full lg:opacity-0 lg:scale-95 lg:translate-y-0"
    >
      <div v-if="showEditModal" class="fixed inset-0 z-[3000] bg-transparent lg:bg-[#09110E]/20 lg:backdrop-blur-sm flex items-end lg:items-center lg:justify-center pointer-events-none">
        <div class="w-full max-w-md bg-white border border-[#E4ECE9] rounded-t-[2.5rem] lg:rounded-[2.5rem] p-6 pb-8 shadow-[0_-10px_40px_rgba(9,17,14,0.06)] lg:shadow-2xl pointer-events-auto mx-auto">
          <div class="w-12 h-1 bg-[#E4ECE9] rounded-full mx-auto mb-5 lg:hidden"></div>

          <h3 class="text-lg font-medium text-[#1E2E2A] mb-5">Modifier mon spot</h3>

          <div class="space-y-5">
            <div class="flex items-center justify-between bg-[#F4F7F5] p-3 rounded-xl border border-[#E4ECE9]">
              <div class="flex items-center gap-2 text-[#5C756E]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-xs">Photo du spot sauvage</span>
              </div>
              <button @click="triggerSpotImageUpload" class="text-xs text-[#00A896] font-medium underline underline-offset-2">
                {{ isUploadingSpotImage ? 'Upload...' : 'Changer' }}
              </button>
              <input type="file" ref="spotImageInput" class="hidden" accept="image/*" @change="handleSpotImageChange" />
            </div>

            <div class="relative border-b border-[#E4ECE9] focus-within:border-[#00A896] transition-colors pb-1">
              <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold mb-1">Nom du spot</label>
              <input v-model="spotToEdit.title" type="text" class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none h-8" />
            </div>

            <div class="relative border-b border-[#E4ECE9] focus-within:border-[#00A896] transition-colors pb-1">
              <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold mb-1">Description</label>
              <textarea v-model="spotToEdit.description" rows="2" class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none resize-none pt-1"></textarea>
            </div>

            <div class="flex gap-3 pt-2">
              <button @click="saveSpot" class="flex-1 h-12 bg-[#00A896] text-white font-medium rounded-xl text-sm active:scale-95 transition-all">Enregistrer</button>
              <button @click="showEditModal = false" class="px-5 h-12 bg-[#F4F7F5] text-[#5C756E] border border-[#E4ECE9] rounded-xl text-sm active:scale-95 transition-all">Annuler</button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div v-if="showDeleteModal" class="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-[#09110E]/40 backdrop-blur-sm">
      <div class="w-full max-w-sm p-6 bg-white border border-[#E4ECE9] rounded-[2rem] shadow-xl">
        <h3 class="text-lg font-medium text-[#1E2E2A] mb-1">Quitter l'aventure ?</h3>
        <p class="text-xs text-[#5C756E] mb-6 leading-relaxed">Cette action est irréversible. Ton profil et l'intégralité de tes spots seront supprimés de la carte.</p>
        <div class="flex flex-col gap-2">
          <button @click="deleteAccount" class="w-full h-11 bg-[#FF6B6B] text-white rounded-xl text-xs font-medium tracking-wide active:scale-95 transition-all">Oui, supprimer définitivement</button>
          <button @click="showDeleteModal = false" class="w-full h-11 bg-[#F4F7F5] text-[#5C756E] rounded-xl text-xs font-medium active:scale-95 transition-all">Annuler</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang='ts'>
// Ton script TypeScript d'origine est conservé tel quel à 100%
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'
import { compressImage, uploadImage } from '../api/mediaService'

interface User {
  username: string;
  email: string;
  avatarUrl: string;
  AvatarUrl?: string;
}

interface Spot {
  id: string | number;
  title: string;
  description: string;
  imageUrl: string;
  ImageUrl?: string;
  Title?: string;
  Description?: string;
}

const router = useRouter()
const activeTab = ref('spots')

const user = ref<User>({
  username: '',
  email: '',
  avatarUrl: ''
})

const mySpots = ref<Spot[]>([])
const myFavorites = ref<any[]>([])
const loading = ref(true)
const isUpdating = ref(false)
const isUploadingAvatar = ref(false)
const isUploadingSpotImage = ref(false)

const showDeleteModal = ref(false)
const avatarInput = ref<HTMLInputElement | null>(null)
const spotImageInput = ref<HTMLInputElement | null>(null)

const showEditModal = ref(false)
const spotToEdit = ref<Spot>({ id: '', title: '', description: '', imageUrl: '' })

const handleAvatarChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    isUploadingAvatar.value = true;
    const compressedFile = await compressImage(file);
    const { url } = await uploadImage(compressedFile);
    user.value.avatarUrl = url;

    await api.put('/users/update', {
      username: user.value.username,
      email: user.value.email,
      avatarUrl: user.value.avatarUrl
    });
  } catch (err) {
    console.error('Erreur avatar upload:', err);
  } finally {
    isUploadingAvatar.value = false;
  }
}

const triggerAvatarUpload = () => {
  avatarInput.value?.click();
}

const deleteAccount = async () => {
  try {
    await api.delete('/users/me')
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    router.push('/')
  } catch (err) {
    console.error('Erreur lors de la suppression du compte :', err)
  } finally {
    showDeleteModal.value = false
  }
}

const updateProfile = async () => {
  try {
    isUpdating.value = true
    await api.put('/users/update', {
      username: user.value.username,
      email: user.value.email,
      avatarUrl: user.value.avatarUrl || user.value.AvatarUrl
    })
  } catch (err) {
    console.error('Erreur update:', err)
  } finally {
    isUpdating.value = false
  }
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  router.push('/login')
}

const handleSpotImageChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    isUploadingSpotImage.value = true;
    const compressedFile = await compressImage(file);
    const { url } = await uploadImage(compressedFile);
    spotToEdit.value.imageUrl = url;
    spotToEdit.value.ImageUrl = url;
  } catch (err) {
    console.error('Erreur spot image upload:', err);
  } finally {
    isUploadingSpotImage.value = false;
  }
}

const triggerSpotImageUpload = () => {
  spotImageInput.value?.click();
}

const deleteSpot = async (id: string | number) => {
  if (!confirm('Sûr de vouloir supprimer ce spot de la carte ?')) return;

  try {
    await api.delete('/spots/' + id)
    mySpots.value = mySpots.value.filter(s => s.id !== id)
  } catch (error) {
    console.error('Erreur lors de la suppression du spot:', error)
  }
}

const openEditModal = (spot: Spot) => {
  spotToEdit.value = {
    id: spot.id,
    title: spot.title || spot.Title || '',
    description: spot.description || spot.Description || '',
    imageUrl: spot.imageUrl || spot.ImageUrl || ''
  }
  showEditModal.value = true
}

const saveSpot = async () => {
  try {
    const payload = {
      title: spotToEdit.value.title,
      description: spotToEdit.value.description,
      imageUrl: spotToEdit.value.imageUrl || ''
    }

    await api.put('/spots/' + spotToEdit.value.id, payload)

    const index = mySpots.value.findIndex(s => s.id === spotToEdit.value.id)
    if (index !== -1) {
      mySpots.value[index] = { ...spotToEdit.value }
    }
    showEditModal.value = false
  } catch (error) {
    console.error('Erreur lors de la modification du spot:', error)
  }
}

const fetchProfileData = async () => {
  try {
    loading.value = true
    const [userRes, spotsRes] = await Promise.all([
      api.get('/users/me'),
      api.get('/spots/my-spots')
    ])
    user.value = userRes.data
    mySpots.value = spotsRes.data
  } catch (err) {
    console.error('Erreur profile data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchProfileData)
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>