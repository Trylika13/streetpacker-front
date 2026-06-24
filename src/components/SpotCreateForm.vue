<template>
  <div class="absolute bottom-0 left-0 right-0 lg:top-0 lg:bottom-auto lg:right-auto z-[3000] bg-white border-t lg:border-t-0 lg:border-r border-[#E4ECE9] text-[#1E2E2A] rounded-t-[2.5rem] lg:rounded-t-none lg:rounded-r-[2.5rem] p-6 pb-8 lg:pt-24 shadow-[0_-10px_40px_rgba(9,17,14,0.08)] lg:shadow-[10px_0_40px_rgba(9,17,14,0.05)] w-full max-w-md mx-auto overflow-y-auto max-h-[75vh] lg:max-h-full lg:h-full no-scrollbar">
    <div class="w-12 h-1 bg-[#E4ECE9] rounded-full mx-auto mb-5 lg:hidden"></div>

    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-xl font-medium tracking-tight text-[#1E2E2A]">Nouveau Spot</h3>
        <p class="text-[9px] text-[#5C756E]/60 font-mono mt-0.5">
          LAT: {{ coords.lat.toFixed(5) }} | LNG: {{ coords.lng.toFixed(5) }}
        </p>
      </div>
      <button type="button" @click="emit('close')" class="text-[#5C756E]/60 font-medium text-xs tracking-wide hover:text-[#FF6B6B] transition-colors">Annuler</button>
    </div>

    <form @submit.prevent="submitForm" class="space-y-5">
      <div class="space-y-1">
        <div @click="triggerImageUpload" class="w-full h-28 lg:h-36 bg-[#F4F7F5] border border-dashed border-[#E4ECE9] rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#00A896] transition-colors relative">
          <img v-if="imageUrl" :src="imageUrl" class="w-full h-full object-cover" alt="Preview" />
          <div v-else class="flex flex-col items-center text-[#5C756E]/40">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
            <span class="text-[9px] uppercase font-bold tracking-wider mt-1.5">Ajouter une photo</span>
          </div>

          <div v-if="isUploadingImage" class="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div class="w-5 h-5 border-2 border-[#00A896] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        <input type="file" ref="imageInput" class="hidden" accept="image/*" @change="handleImageChange" />
      </div>

      <div class="relative border-b border-[#E4ECE9] focus-within:border-[#00A896] transition-colors pb-1">
        <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold mb-1">Nom du spot</label>
        <input v-model="title" type="text" placeholder="Ex: Source d'eau ou Bivouac sauvage" class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none placeholder:text-[#1E2E2A]/20 h-8" required />
      </div>

      <div class="relative border-b border-[#E4ECE9] focus-within:border-[#00A896] transition-colors pb-1">
        <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold mb-1">Description</label>
        <textarea v-model="description" placeholder="Donne des infos utiles (accès, sécurité...)" rows="2" class="w-full bg-transparent text-sm text-[#1E2E2A] outline-none placeholder:text-[#1E2E2A]/20 resize-none pt-1" required></textarea>
      </div>

      <div class="space-y-2 pt-1">
        <label class="block text-[10px] uppercase tracking-[0.2em] text-[#5C756E] font-semibold">Caractéristiques du lieu</label>
        <div class="flex flex-wrap gap-2">
          <button v-for="tag in availableTags" :key="tag.id" type="button" @click="toggleTag(tag.id)" :class="selectedTagIds.includes(tag.id) ? 'bg-[#00A896] text-white border-[#00A896]' : 'bg-[#F4F7F5] text-[#5C756E] border-[#E4ECE9] hover:border-[#00A896]/40'" class="px-3 py-1.5 border text-xs font-medium rounded-xl transition-all active:scale-95 flex items-center gap-1">
            {{ tag.name }}
          </button>
        </div>
      </div>

      <button type="submit" :disabled="isSubmitting || isUploadingImage" class="w-full h-12 bg-[#00A896] text-white font-medium rounded-xl text-sm tracking-wide active:scale-95 transition-all mt-4 disabled:opacity-40">
        {{ isSubmitting ? 'Enregistrement...' : 'Partager le spot' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { compressImage, uploadImage } from '../api/mediaService'

interface Tag { id: string; name: string; }

const props = defineProps<{
  coords: { lat: number; lng: number };
  availableTags: Tag[];
  isSubmitting: boolean;
}>()

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', data: { title: string; description: string; imageUrl: string; tagIds: string[] }): void;
}>()

const title = ref('')
const description = ref('')
const imageUrl = ref('')
const isUploadingImage = ref(false)
const imageInput = ref<HTMLInputElement | null>(null)
const selectedTagIds = ref<string[]>([])

// Reset si les coordonnées changent (fermeture/réouverture)
watch(() => props.coords, () => {
  title.value = ''
  description.value = ''
  imageUrl.value = ''
  selectedTagIds.value = []
}, { immediate: true })

const triggerImageUpload = () => imageInput.value?.click()

const handleImageChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  try {
    isUploadingImage.value = true
    const compressedFile = await compressImage(file)
    const { url } = await uploadImage(compressedFile)
    imageUrl.value = url
  } catch (err) {
    console.error("Erreur upload:", err)
  } finally {
    isUploadingImage.value = false
  }
}

const toggleTag = (tagId: string) => {
  const index = selectedTagIds.value.indexOf(tagId)
  if (index === -1) selectedTagIds.value.push(tagId)
  else selectedTagIds.value.splice(index, 1)
}

const submitForm = () => {
  emit('submit', {
    title: title.value,
    description: description.value,
    imageUrl: imageUrl.value,
    tagIds: selectedTagIds.value
  })
}
</script>