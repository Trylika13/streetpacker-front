<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'
import { compressImage, uploadImage } from '../api/mediaService'

const router = useRouter()
const isSubmitting = ref(false)
const errorMessage = ref('')

const newAdImageUrl = ref('')
const isUploadingAdImage = ref(false)
const adImageInput = ref<HTMLInputElement | null>(null)

interface Tag {
  id: string;
  name: string;
  type: string;
}

const availableTags = ref<Tag[]>([])
const selectedTagIds = ref<string[]>([])

const form = ref({
  title: '',
  description: '',
  price: 0,
  locationArea: ''
})

const loadMarketplaceTags = async () => {
  try {
    const res = await api.get('/Ads/tags')
    availableTags.value = res.data
  } catch (err) {
    console.error("Erreur lors du chargement des tags marketplace :", err)
  }
}

const handleAdImageChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    isUploadingAdImage.value = true
    const compressedFile = await compressImage(file)
    const { url } = await uploadImage(compressedFile)
    newAdImageUrl.value = url
  } catch (err) {
    console.error("Erreur ad image upload:", err)
    errorMessage.value = "Impossible de charger la photo."
  } finally {
    isUploadingAdImage.value = false
  }
}

const triggerAdImageUpload = () => {
  adImageInput.value?.click()
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
    errorMessage.value = 'Remplis tous les champs obligatoires.'
    return
  }

  if (form.value.price < 0) {
    errorMessage.value = 'Le prix ne peut pas être négatif.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    await api.post('/Ads', {
      title: form.value.title,
      description: form.value.description,
      price: form.value.price,
      locationArea: form.value.locationArea,
      imageUrl: newAdImageUrl.value || null,
      tagIds: selectedTagIds.value
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
  <div class="min-h-screen bg-[#F4F7F5] text-[#1E2E2A] pb-12 font-sans relative flex items-center justify-center p-4">

    <div class="w-full max-w-md md:max-w-3xl bg-white border border-[#E4ECE9] rounded-[2.5rem] p-6 md:p-8 shadow-[0_10px_40px_rgba(9,17,14,0.04)] relative">

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

      <h2 class="text-xl font-medium text-[#1E2E2A] text-center mt-2 mb-1">Créer une annonce</h2>
      <p class="text-[10px] text-[#5C756E]/60 text-center uppercase tracking-wider mb-6">
        Ton contact de profil sera lié automatiquement
      </p>

      <div v-if="errorMessage" class="bg-red-50 border border-red-100 text-[#FF6B6B] p-3 rounded-xl text-xs text-center mb-5 shadow-sm">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">

          <div class="space-y-5">
            <div class="space-y-1">
              <label class="block text-[9px] uppercase tracking-wider text-[#5C756E]/70 font-bold mb-1">Photo de l'équipement</label>
              <div
                  @click="triggerAdImageUpload"
                  class="w-full h-36 md:h-52 bg-[#F4F7F5] border border-dashed border-[#E4ECE9] rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#00A896] transition-colors relative"
              >
                <img v-if="newAdImageUrl" :src="newAdImageUrl" class="w-full h-full object-cover" alt="Preview" />
                <div v-else class="flex flex-col items-center text-[#5C756E]/40">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                  </svg>
                  <span class="text-[9px] uppercase font-bold tracking-wider mt-1.5">Ajouter une photo</span>
                </div>

                <div v-if="isUploadingAdImage" class="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <div class="w-5 h-5 border-2 border-[#00A896] border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
              <input
                  type="file"
                  ref="adImageInput"
                  class="hidden"
                  accept="image/*"
                  @change="handleAdImageChange"
              />
            </div>

            <div class="space-y-2 pt-1">
              <label class="block text-[9px] uppercase tracking-wider text-[#5C756E]/70 font-bold">
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
          </div>

          <div class="space-y-4">
            <div class="bg-[#F4F7F5] rounded-xl px-4 py-2.5 border border-transparent focus-within:border-[#00A896]/20 focus-within:bg-white transition-all">
              <label class="block text-[9px] uppercase tracking-wider text-[#5C756E]/70 font-bold mb-0.5">Titre de l'annonce *</label>
              <input
                  v-model="form.title"
                  type="text"
                  placeholder="Ex: Sac à dos Osprey 55L"
                  class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none h-7 font-medium placeholder-[#5C756E]/30"
                  required
              />
            </div>

            <div class="bg-[#F4F7F5] rounded-xl px-4 py-2.5 border border-transparent focus-within:border-[#00A896]/20 focus-within:bg-white transition-all">
              <label class="block text-[9px] uppercase tracking-wider text-[#5C756E]/70 font-bold mb-0.5">Localisation / Zone *</label>
              <input
                  v-model="form.locationArea"
                  type="text"
                  placeholder="Ex: Bangkok / Khao San Road"
                  class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none h-7 font-medium placeholder-[#5C756E]/30"
                  required
              />
            </div>

            <div class="bg-[#F4F7F5] rounded-xl px-4 py-2.5 border border-transparent focus-within:border-[#00A896]/20 focus-within:bg-white transition-all">
              <label class="block text-[9px] uppercase tracking-wider text-[#5C756E]/70 font-bold mb-0.5">Prix ($) *</label>
              <input
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none h-7 font-medium"
                  required
              />
            </div>

            <div class="bg-[#F4F7F5] rounded-xl px-4 py-2.5 border border-transparent focus-within:border-[#00A896]/20 focus-within:bg-white transition-all">
              <label class="block text-[9px] uppercase tracking-wider text-[#5C756E]/70 font-bold mb-0.5">Description *</label>
              <textarea
                  v-model="form.description"
                  rows="4"
                  placeholder="Décris l'état de ton objet, les modalités pour le récupérer..."
                  class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none resize-none pt-0.5 font-medium placeholder-[#5C756E]/30"
                  required
              ></textarea>
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-4 border-t border-[#E4ECE9]/60">
          <button
              type="submit"
              :disabled="isSubmitting || isUploadingAdImage"
              class="flex-1 h-12 bg-[#00A896] text-white font-medium rounded-xl text-xs tracking-wider uppercase active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center shadow-sm shadow-[#00A896]/10"
          >
            <span v-if="isSubmitting" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span v-else>Publier l'annonce</span>
          </button>

          <button
              type="button"
              @click="router.push('/marketplace')"
              class="px-5 h-12 bg-[#F4F7F5] text-[#5C756E] border border-[#E4ECE9] rounded-xl text-xs font-medium tracking-wider uppercase active:scale-[0.98] transition-all"
          >
            Annuler
          </button>
        </div>

      </form>
    </div>

  </div>
</template>