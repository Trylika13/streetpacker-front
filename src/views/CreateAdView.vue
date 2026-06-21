<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'

const router = useRouter()
const isSubmitting = ref(false)
const errorMessage = ref('')

// Structure pour typer un tag
interface Tag {
  id: string;
  name: string;
  type: string;
}

// Liste des tags récupérés du Back et les IDs sélectionnés
const availableTags = ref<Tag[]>([])
const selectedTagIds = ref<string[]>([])

// Formulaire épuré
const form = ref({
  title: '',
  description: '',
  price: 0,
  locationArea: ''
})

const loadMarketplaceTags = async () => {
  try {
    const res = await api.get('/Ads/tags') // Mets l'URL exacte de ton contrôleur Ads
    availableTags.value = res.data // Plus besoin de filtrer en JS, le Back donne le produit brut clean !
  } catch (err) {
    console.error("Erreur lors du chargement des tags marketplace :", err)
  }
}

const toggleTagSelection = (tagId: string) => {
  const index = selectedTagIds.value.indexOf(tagId)
  if (index === -1) {
    selectedTagIds.value.push(tagId)
  } else {
    selectedTagIds.value.splice(index, 1)
  }
}

const handleSubmit = async () => {
  if (!form.value.title || !form.value.description || !form.value.locationArea) {
    errorMessage.value = 'Remplis tous les champs obligatoires, l\'ami ! '
    return
  }

  if (form.value.price < 0) {
    errorMessage.value = 'Le prix ne peut pas être négatif.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    // 👑 On envoie maintenant le payload complet avec le tableau de TagIds mis à jour !
    await api.post('/Ads', {
      title: form.value.title,
      description: form.value.description,
      price: form.value.price,
      locationArea: form.value.locationArea,
      tagIds: selectedTagIds.value // 👑 Transmis proprement à ton CreateAdDto C# !
    })

    router.push('/marketplace')
  } catch (error: any) {
    console.error('Erreur lors de la création de l\'annonce:', error)
    errorMessage.value = 'Impossible de publier l\'annonce. Vérifie les données transmises.'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadMarketplaceTags()
})
</script>

<template>
  <div class="min-h-screen bg-[#F4F7F5] text-[#1E2E2A] pb-24 lg:pb-12 font-sans relative flex items-center justify-center p-4">

    <div class="w-full max-w-md bg-white border border-[#E4ECE9] rounded-[2.5rem] p-6 lg:p-8 shadow-[0_10px_40px_rgba(9,17,14,0.04)] relative">

      <div class="absolute top-6 left-6">
        <button
            type="button"
            @click="router.push('/marketplace')"
            class="group p-2 bg-[#F4F7F5] rounded-full text-[#5C756E]/60 hover:text-[#00A896] transition-colors flex items-center justify-center"
            title="Retour au Marketplace"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <h2 class="text-xl font-medium text-[#1E2E2A] text-center mt-2 mb-2">Créer une annonce</h2>
      <p class="text-[10px] text-[#5C756E]/60 text-center uppercase tracking-wider mb-6">
        Ton contact de profil sera lié automatiquement
      </p>

      <div v-if="errorMessage" class="bg-red-50 border border-red-100 text-[#FF6B6B] p-3 rounded-xl text-xs text-center mb-5 shadow-sm">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">

        <div class="relative border-b border-[#E4ECE9] focus-within:border-[#00A896] transition-colors pb-1">
          <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold mb-1">Titre de l'annonce *</label>
          <input
              v-model="form.title"
              type="text"
              placeholder="Ex: Sac à dos Osprey 55L"
              class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none h-8 placeholder-[#5C756E]/30"
              required
          />
        </div>

        <div class="relative border-b border-[#E4ECE9] focus-within:border-[#00A896] transition-colors pb-1">
          <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold mb-1">Localisation / Zone *</label>
          <input
              v-model="form.locationArea"
              type="text"
              placeholder="Ex: Bangkok / Khao San Road"
              class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none h-8 placeholder-[#5C756E]/30"
              required
          />
        </div>

        <div class="relative border-b border-[#E4ECE9] focus-within:border-[#00A896] transition-colors pb-1">
          <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold mb-1">Prix ($) *</label>
          <input
              v-model.number="form.price"
              type="number"
              min="0"
              class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none h-8"
              required
          />
        </div>

        <div class="relative border-b border-[#E4ECE9] focus-within:border-[#00A896] transition-colors pb-1">
          <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold mb-1">Description *</label>
          <textarea
              v-model="form.description"
              rows="3"
              placeholder="Décris l'état de ton objet, les modalités pour le récupérer..."
              class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none resize-none pt-1 placeholder-[#5C756E]/30"
              required
          ></textarea>
        </div>

        <div class="space-y-2 pt-1">
          <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold">
            Catégorie de matériel
          </label>
          <div class="flex flex-wrap gap-2">
            <button
                v-for="tag in availableTags"
                :key="tag.id"
                type="button"
                @click="toggleTagSelection(tag.id)"
                :class="selectedTagIds.includes(tag.id)
        ? 'bg-[#00A896] text-white border-[#00A896]'
        : 'bg-[#F4F7F5] text-[#5C756E] border-[#E4ECE9] hover:border-[#00A896]/40'"
                class="px-3 py-1.5 border text-xs font-medium rounded-xl transition-all active:scale-95 flex items-center gap-1"
            >
              {{ tag.name }}
            </button>
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 h-12 bg-[#00A896] text-white font-medium rounded-xl text-sm active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center"
          >
            <span v-if="isSubmitting" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span v-else>Publier l'annonce</span>
          </button>

          <button
              type="button"
              @click="router.push('/marketplace')"
              class="px-5 h-12 bg-[#F4F7F5] text-[#5C756E] border border-[#E4ECE9] rounded-xl text-sm active:scale-95 transition-all"
          >
            Annuler
          </button>
        </div>

      </form>
    </div>

  </div>
</template>