<template>
  <div class="min-h-screen bg-[#F4F7F5] text-[#1E2E2A] pb-12 font-sans selection:bg-[#00A896]/10">

    <div class="bg-white border-b border-[#E4ECE9] pb-4 pt-[calc(12px+env(safe-area-inset-top))] px-4 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
      <div class="max-w-5xl mx-auto flex items-center gap-4">
        <button @click="$router.back()" class="group p-2 bg-[#F4F7F5] rounded-full text-[#5C756E]/60 hover:text-[#00A896] transition-colors flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 class="text-base font-medium">Détails du Matériel</h1>
          <p class="text-[9px] text-[#5C756E]/60 uppercase tracking-wider">Marketplace nomade</p>
        </div>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-4 mt-6">
      <div v-if="loading" class="text-center py-12 text-xs italic text-[#5C756E]/60">
        Chargement de l'annonce...
      </div>

      <div v-else-if="ad" class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-[#E4ECE9] rounded-[2rem] md:rounded-[3rem] p-5 md:p-8 shadow-sm items-stretch">

        <div v-if="ad.imageUrl" class="w-full h-64 md:h-full min-h-[300px] md:min-h-[450px] lg:max-h-[calc(100vh-160px)] rounded-2xl md:rounded-[2rem] overflow-hidden border border-[#E4ECE9] bg-[#F4F7F5]">
          <img :src="ad.imageUrl" class="w-full h-full object-cover" alt="Article" />
        </div>

        <div class="flex flex-col justify-between space-y-5 pt-2 md:pt-0">
          <div class="space-y-5">

            <div class="flex justify-between items-start gap-4 border-b border-[#E4ECE9]/60 pb-4">
              <div class="min-w-0 flex-1">
                <h2 class="text-xl md:text-2xl font-semibold tracking-tight text-[#1E2E2A] leading-tight truncate">
                  {{ ad.title }}
                </h2>
                <p class="text-xs md:text-sm text-[#5C756E]/70 mt-1 flex items-center gap-1 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-[#00A896] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ ad.locationArea }}
                </p>
              </div>
              <span class="text-lg md:text-xl font-bold text-[#00A896] bg-[#00A896]/10 px-3 py-1.5 rounded-xl whitespace-nowrap border border-[#00A896]/10">
                {{ ad.price }} €
              </span>
            </div>

            <div v-if="ad.user" class="flex items-center gap-3 bg-[#F4F7F5]/60 border border-[#E4ECE9] rounded-2xl p-3">
              <img
                  :src="ad.user.avatarUrl || 'https://rqphrrxbnyeatnlxdsqs.supabase.co/storage/v1/object/public/images/avatar-placeholder.png'"
                  class="w-9 h-9 rounded-full object-cover border border-[#E4ECE9]"
                  alt="Vendeur"
              />
              <div>
                <p class="text-[9px] text-[#5C756E]/60 uppercase tracking-wider font-bold">Vendeur</p>
                <p class="text-xs md:text-sm font-semibold text-[#1E2E2A]">{{ ad.user.username }}</p>
              </div>
            </div>

            <div class="space-y-1.5">
              <span class="text-[10px] uppercase tracking-[0.15em] text-[#5C756E]/60 font-bold block">Description du produit</span>
              <p class="text-xs md:text-sm text-[#5C756E] leading-relaxed bg-[#F4F7F5]/30 p-3.5 rounded-xl border border-[#E4ECE9]/60 whitespace-pre-line">
                {{ ad.description || 'Pas de détails complémentaires disponibles.' }}
              </p>
            </div>
          </div>

          <a
              :href="generateContactLink(ad.contactLink, ad.title)"
              target="_blank"
              class="w-full h-12 bg-[#00A896] hover:bg-[#009485] text-white rounded-xl flex items-center justify-center text-xs font-medium active:scale-[0.98] transition-all shadow-sm gap-2 mt-4 md:mt-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12.001c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Contacter et lancer la discussion
          </a>
        </div>

      </div>

      <div v-else class="text-center py-12 text-xs italic text-[#FF6B6B] bg-white border border-[#E4ECE9] rounded-[2rem]">
        Désolé, cette annonce a expiré ou n'est plus en ligne.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/axios'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const ad = ref<any>(null)

// Récupération de l'ID utilisateur connecté au besoin
const currentUserId = localStorage.getItem('userId')
console.log('Utilisateur actuel connecté :', currentUserId)

const fetchAdDetail = async () => {
  try {
    loading.value = true
    const adId = route.params.id
    const res = await api.get(`/Ads/${adId}`)
    ad.value = res.data
  } catch (err) {
    console.error("Erreur lors de la récupération des détails de l'annonce :", err)
  } finally {
    loading.value = false
  }
}

const generateContactLink = (link: string, title: string) => {
  if (!link) return '#'
  const message = encodeURIComponent(`Salut ! Je suis intéressé par ton annonce "${title}" sur StreetPacker. Est-elle toujours disponible ?`)

  if (link.includes('wa.me') && !link.includes('text=')) {
    return link.includes('?') ? `${link}&text=${message}` : `${link}?text=${message}`
  }
  return link
}

onMounted(() => {
  fetchAdDetail()
})
</script>