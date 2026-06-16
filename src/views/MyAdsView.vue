<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'

interface Ad {
  adId: string | number;
  title: string;
  description: string;
  price: number;
  locationArea: string;
  userId: string;
}

const router = useRouter()
const myAds = ref<Ad[]>([])
const loading = ref(true)

// Gestion du Modal de modification
const showEditModal = ref(false)
const adToEdit = ref<Ad>({ adId: '', title: '', description: '', price: 0, locationArea: '', userId: '' })

// Charger uniquement les annonces de l'utilisateur connecté
const fetchMyAds = async () => {
  try {
    loading.value = true
    const res = await api.get('/Ads/my-ads')
    myAds.value = res.data || []
  } catch (err) {
    console.error('Erreur lors de la récupération de tes annonces:', err)
  } finally {
    loading.value = false
  }
}

// Ouvrir le modal avec les données pré-remplies
const openEditModal = (ad: Ad) => {
  adToEdit.value = { ...ad }
  showEditModal.value = true
}

// Sauvegarder les modifications (Appel PUT)
const saveAd = async () => {
  if (adToEdit.value.price < 0) {
    alert('Le prix ne peut pas être négatif, l\'ami !')
    return
  }

  try {
    const payload = {
      title: adToEdit.value.title,
      description: adToEdit.value.description,
      price: adToEdit.value.price,
      locationArea: adToEdit.value.locationArea,
      contactLink: (adToEdit.value as any).contactLink || '',
      isActive: true
    }

    await api.put('/Ads/' + adToEdit.value.adId, payload)

    // Mise à jour de la liste locale
    const index = myAds.value.findIndex(a => a.adId === adToEdit.value.adId)
    if (index !== -1) {
      myAds.value[index] = { ...adToEdit.value }
    }

    showEditModal.value = false
  } catch (error) {
    console.error('Erreur lors de la modification de l\'annonce:', error)
    alert('Impossible de modifier l\'annonce.')
  }
}

// Supprimer une annonce
const deleteAd = async (adId: string | number) => {
  if (!confirm('Es-tu sûr de vouloir retirer cette annonce du marché ? 🎒')) return

  try {
    await api.delete('/Ads/' + adId)
    myAds.value = myAds.value.filter(ad => ad.adId !== adId)
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'annonce:', error)
  }
}

onMounted(fetchMyAds)
</script>

<template>
  <div class="min-h-screen bg-[#F4F7F5] text-[#1E2E2A] pb-16 font-sans">

    <!-- HEADER -->
    <div class="bg-white border-b border-[#E4ECE9] p-4 sticky top-0 z-50 shadow-[0_2px_15px_rgba(9,17,14,0.02)]">
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button @click="router.push('/profile')" class="group p-2.5 bg-[#F4F7F5] rounded-full text-[#5C756E]/60 hover:text-[#00A896] hover:bg-[#00A896]/5 transition-all flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-base font-semibold tracking-tight">Mes annonces matériel</h1>
            <p class="text-[10px] text-[#5C756E]/60 uppercase tracking-widest font-bold mt-0.5">Gestion Marketplace</p>
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="max-w-5xl mx-auto p-4 mt-6">
      <div v-if="loading" class="flex flex-col items-center justify-center py-24 space-y-3">
        <div class="w-6 h-6 border-2 border-[#00A896] border-t-transparent rounded-full animate-spin"></div>
        <p class="text-xs text-[#5C756E]/60 italic">Chargement de ton inventaire...</p>
      </div>

      <div v-else>
        <div v-if="myAds.length === 0" class="text-center py-20 bg-white rounded-3xl border border-[#E4ECE9] p-8 max-w-md mx-auto">
          <div class="w-12 h-12 bg-[#F4F7F5] rounded-full flex items-center justify-center text-[#5C756E]/40 mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <p class="text-sm font-medium text-[#1E2E2A]">Aucune annonce en ligne</p>
          <p class="text-xs text-[#5C756E]/70 mt-1 max-w-xs mx-auto">Tu n'as pas encore mis d'équipement ou d'objets en vente sur le marketplace.</p>
        </div>

        <!-- Grille de cartes de vente -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="ad in myAds" :key="ad.adId" class="group bg-white rounded-[2rem] border border-[#E4ECE9] p-5 shadow-[0_8px_30px_rgba(9,17,14,0.015)] hover:shadow-[0_12px_40px_rgba(9,17,14,0.03)] hover:border-[#00A896]/20 transition-all flex flex-col justify-between h-48 relative overflow-hidden">

            <div>
              <!-- Badge de prix supérieur & Actions -->
              <div class="flex items-start justify-between gap-2 mb-3">
                <span class="text-xs font-bold text-[#00A896] bg-[#00A896]/10 px-2.5 py-1 rounded-xl">
                  {{ ad.price }} $
                </span>

                <div class="flex gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button @click="openEditModal(ad)" class="p-2 hover:bg-[#F4F7F5] rounded-full text-[#5C756E] hover:text-[#00A896] transition-all" title="Modifier">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button @click="deleteAd(ad.adId)" class="p-2 hover:bg-red-50 rounded-full text-[#5C756E] hover:text-[#FF6B6B] transition-all" title="Supprimer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>

              <!-- Titre et description de l'objet -->
              <h4 class="font-semibold text-sm text-[#1E2E2A] truncate group-hover:text-[#00A896] transition-colors mb-1">{{ ad.title }}</h4>
              <p class="text-xs text-[#5C756E]/80 line-clamp-2 leading-relaxed">{{ ad.description }}</p>
            </div>

            <!-- Pied de carte : Localisation -->
            <div class="pt-3 border-t border-[#E4ECE9]/60 flex items-center justify-between text-[11px] font-medium text-[#5C756E]/60">
              <span class="flex items-center gap-1 text-[#00A896]/90 font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-[#00A896]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                {{ ad.locationArea }}
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- MODAL DE MODIFICATION ÉPURÉ -->
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

          <h3 class="text-base font-semibold text-[#1E2E2A] mb-5 tracking-tight">Détails de l'annonce</h3>

          <form @submit.prevent="saveAd" class="space-y-4">

            <div class="bg-[#F4F7F5] rounded-xl px-4 py-2.5 border border-transparent focus-within:border-[#00A896]/20 focus-within:bg-white transition-all">
              <label class="block text-[9px] uppercase tracking-wider text-[#5C756E]/70 font-bold mb-0.5">Titre de l'objet</label>
              <input v-model="adToEdit.title" type="text" class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none font-medium" required />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="bg-[#F4F7F5] rounded-xl px-4 py-2.5 border border-transparent focus-within:border-[#00A896]/20 focus-within:bg-white transition-all">
                <label class="block text-[9px] uppercase tracking-wider text-[#5C756E]/70 font-bold mb-0.5">Localisation</label>
                <input v-model="adToEdit.locationArea" type="text" class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none font-medium" required />
              </div>

              <div class="bg-[#F4F7F5] rounded-xl px-4 py-2.5 border border-transparent focus-within:border-[#00A896]/20 focus-within:bg-white transition-all">
                <label class="block text-[9px] uppercase tracking-wider text-[#5C756E]/70 font-bold mb-0.5">Prix demandé ($)</label>
                <input v-model.number="adToEdit.price" type="number" min="0" class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none font-medium" required />
              </div>
            </div>

            <div class="bg-[#F4F7F5] rounded-xl px-4 py-2.5 border border-transparent focus-within:border-[#00A896]/20 focus-within:bg-white transition-all">
              <label class="block text-[9px] uppercase tracking-wider text-[#5C756E]/70 font-bold mb-0.5">Description du matériel</label>
              <textarea v-model="adToEdit.description" rows="3" class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none resize-none leading-relaxed pt-0.5" required></textarea>
            </div>

            <!-- Actions -->
            <div class="flex gap-2.5 pt-3">
              <button type="submit" class="flex-1 h-11 bg-[#00A896] text-white font-medium rounded-xl text-xs tracking-wider uppercase active:scale-[0.98] transition-all shadow-sm shadow-[#00A896]/10">Enregistrer</button>
              <button type="button" @click="showEditModal = false" class="px-5 h-11 bg-[#F4F7F5] text-[#5C756E] rounded-xl text-xs font-medium tracking-wider uppercase border border-[#E4ECE9] active:scale-[0.98] transition-all">Annuler</button>
            </div>
          </form>
        </div>
      </div>
    </transition>

  </div>
</template>

<style scoped>
</style>