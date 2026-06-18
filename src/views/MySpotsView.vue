<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'
import { compressImage, uploadImage } from '../api/mediaService'

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
const mySpots = ref<Spot[]>([])
const loading = ref(true)
const isUploadingSpotImage = ref(false)

const spotImageInput = ref<HTMLInputElement | null>(null)
const showEditModal = ref(false)
const spotToEdit = ref<Spot>({ id: '', title: '', description: '', imageUrl: '' })

const fetchMySpots = async () => {
  try {
    loading.value = true
    const res = await api.get('/Spots/my-spots')
    mySpots.value = res.data || []
  } catch (err) {
    console.error('Erreur lors de la récupération de tes spots:', err)
  } finally {
    loading.value = false
  }
}

const deleteSpot = async (id: string | number) => {
  if (!confirm('Sûr de vouloir supprimer ce spot de la carte ? 🌲')) return

  try {
    await api.delete('Spots/' + id)
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

const triggerSpotImageUpload = () => {
  spotImageInput.value?.click()
}

const handleSpotImageChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    isUploadingSpotImage.value = true
    const compressedFile = await compressImage(file)
    const { url } = await uploadImage(compressedFile)
    spotToEdit.value.imageUrl = url
    spotToEdit.value.ImageUrl = url
  } catch (err) {
    console.error('Erreur spot image upload:', err)
  } finally {
    isUploadingSpotImage.value = false
  }
}

const saveSpot = async () => {
  try {
    const payload = {
      title: spotToEdit.value.title,
      description: spotToEdit.value.description,
      imageUrl: spotToEdit.value.imageUrl || ''
    }

    await api.put('/Spots/' + spotToEdit.value.id, payload)

    const index = mySpots.value.findIndex(s => s.id === spotToEdit.value.id)
    if (index !== -1) {
      mySpots.value[index] = { ...spotToEdit.value }
    }
    showEditModal.value = false
  } catch (error) {
    console.error('Erreur lors de la modification du spot:', error)
  }
}

onMounted(fetchMySpots)
</script>

<template>
  <div class="min-h-screen bg-[#F4F7F5] text-[#1E2E2A] pb-16 font-sans">

    <div class="bg-white border-b border-[#E4ECE9] p-4 sticky top-0 z-50 shadow-[0_2px_15px_rgba(9,17,14,0.02)]">
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button @click="router.push('/profile')" class="group p-2.5 bg-[#F4F7F5] rounded-full text-[#5C756E]/60 hover:text-[#00A896] hover:bg-[#00A896]/5 transition-all flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-base font-semibold tracking-tight">Mes spots partagés</h1>
            <p class="text-[10px] text-[#5C756E]/60 uppercase tracking-widest font-bold mt-0.5">Exploration cartographique</p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-5xl mx-auto p-4 mt-6">
      <div v-if="loading" class="flex flex-col items-center justify-center py-24 space-y-3">
        <div class="w-6 h-6 border-2 border-[#00A896] border-t-transparent rounded-full animate-spin"></div>
        <p class="text-xs text-[#5C756E]/60 italic">Chargement de tes repères...</p>
      </div>

      <div v-else>
        <div v-if="mySpots.length === 0" class="text-center py-20 bg-white rounded-3xl border border-[#E4ECE9] p-8 max-w-md mx-auto">
          <div class="w-12 h-12 bg-[#F4F7F5] rounded-full flex items-center justify-center text-[#5C756E]/40 mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
          </div>
          <p class="text-sm font-medium text-[#1E2E2A]">Aucun spot partagé</p>
          <p class="text-xs text-[#5C756E]/70 mt-1 max-w-xs mx-auto">Tes découvertes apparaîtront ici dès que tu en ajouteras sur la carte globale.</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="spot in mySpots" :key="spot.id" class="group bg-white rounded-[2rem] border border-[#E4ECE9] overflow-hidden shadow-[0_8px_30px_rgba(9,17,14,0.015)] hover:shadow-[0_12px_40px_rgba(9,17,14,0.04)] hover:border-[#00A896]/20 transition-all flex flex-col h-72 relative">

            <div class="h-44 bg-[#E4ECE9] relative overflow-hidden shrink-0">
              <img v-if="spot.imageUrl || spot.ImageUrl" :src="spot.imageUrl || spot.ImageUrl" alt="Spot" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div v-else class="w-full h-full bg-gradient-to-br from-[#E4ECE9] to-[#F4F7F5] flex items-center justify-center text-[#5C756E]/30">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>

              <div class="absolute top-3 right-3 flex gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button @click="openEditModal(spot)" class="p-2 bg-white/90 backdrop-blur-md rounded-full text-[#5C756E] hover:text-[#00A896] hover:bg-white shadow-sm transition-all" title="Modifier">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button @click="deleteSpot(spot.id)" class="p-2 bg-white/90 backdrop-blur-md rounded-full text-[#5C756E] hover:text-[#FF6B6B] hover:bg-white shadow-sm transition-all" title="Supprimer">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>

            <div class="p-4 flex-1 flex flex-col justify-between min-w-0">
              <div class="min-w-0">
                <h4 class="font-medium text-sm text-[#1E2E2A] truncate group-hover:text-[#00A896] transition-colors">{{ spot.title || spot.Title }}</h4>
                <p class="text-xs text-[#5C756E]/80 line-clamp-2 mt-1 leading-relaxed">{{ spot.description || spot.Description }}</p>
              </div>
            </div>
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
      <div v-if="showEditModal" class="fixed inset-0 z-[3000] bg-[#09110E]/40 backdrop-blur-xs flex items-end lg:items-center lg:justify-center pointer-events-none p-0 lg:p-4">
        <div class="w-full max-w-md bg-white rounded-t-[2.5rem] lg:rounded-[2.5rem] p-6 pb-8 shadow-[0_-15px_50px_rgba(9,17,14,0.08)] lg:shadow-2xl pointer-events-auto mx-auto border border-[#E4ECE9]/50">
          <div class="w-10 h-1 bg-[#E4ECE9] rounded-full mx-auto mb-6 lg:hidden"></div>

          <h3 class="text-base font-semibold text-[#1E2E2A] mb-5 tracking-tight">Détails du spot sauvage</h3>

          <div class="space-y-6">
            <div class="h-36 w-full bg-[#F4F7F5] rounded-2xl relative overflow-hidden group/modal border border-[#E4ECE9] mb-2 flex items-center justify-center">
              <img v-if="spotToEdit.imageUrl" :src="spotToEdit.imageUrl" class="w-full h-full object-cover" />
              <div v-else class="text-xs text-[#5C756E]/40 italic">Aucun visuel associé</div>

              <button @click="triggerSpotImageUpload" type="button" class="absolute bottom-3 right-3 px-3 h-8 bg-white/90 backdrop-blur-md hover:bg-white text-xs font-medium text-[#1E2E2A] rounded-xl shadow-sm transition-all flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-[#5C756E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                {{ isUploadingSpotImage ? 'Traitement...' : 'Remplacer' }}
              </button>
              <input type="file" ref="spotImageInput" class="hidden" accept="image/*" @change="handleSpotImageChange" />
            </div>

            <div class="space-y-4">
              <div class="bg-[#F4F7F5] rounded-xl px-4 py-2.5 border border-transparent focus-within:border-[#00A896]/20 focus-within:bg-white transition-all">
                <label class="block text-[9px] uppercase tracking-wider text-[#5C756E]/70 font-bold mb-0.5">Nom du lieu</label>
                <input v-model="spotToEdit.title" type="text" class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none font-medium" />
              </div>

              <div class="bg-[#F4F7F5] rounded-xl px-4 py-2.5 border border-transparent focus-within:border-[#00A896]/20 focus-within:bg-white transition-all">
                <label class="block text-[9px] uppercase tracking-wider text-[#5C756E]/70 font-bold mb-0.5">Notes d'exploration</label>
                <textarea v-model="spotToEdit.description" rows="3" class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none resize-none leading-relaxed pt-0.5"></textarea>
              </div>
            </div>

            <div class="flex gap-2.5 pt-1">
              <button @click="saveSpot" type="button" class="flex-1 h-11 bg-[#00A896] text-white font-medium rounded-xl text-xs tracking-wider uppercase active:scale-[0.98] transition-all shadow-sm shadow-[#00A896]/10">Enregistrer</button>
              <button @click="showEditModal = false" type="button" class="px-5 h-11 bg-[#F4F7F5] text-[#5C756E] rounded-xl text-xs font-medium tracking-wider uppercase border border-[#E4ECE9] active:scale-[0.98] transition-all">Annuler</button>
            </div>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>