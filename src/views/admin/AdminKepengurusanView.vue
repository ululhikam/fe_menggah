<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Edit2, Trash2, Users } from 'lucide-vue-next'
import api from '@/lib/api'
import { useToast } from '@/composables/useToast'
import ImageUpload from '@/components/ui/ImageUpload.vue'

interface Member {
  id: string
  name: string
  position: string
  photo_url?: string
  phone?: string
  period_start?: string
  period_end?: string
  group_type?: string
  organizations?: { name: string; slug: string }
  organization_id?: string
}

interface Org { id: string; name: string }

const toast = useToast()
const loading = ref(true)
const members = ref<Member[]>([])
const organizations = ref<Org[]>([])
const showModal = ref(false)
const editingItem = ref<Member | null>(null)
const saving = ref(false)
const deleting = ref<string | null>(null)
const activeFilter = ref('all')

const form = ref({
  name: '', position: '', photo_url: '', phone: '', organization_id: '', group_type: '', period_start: '', period_end: '', order_index: 0
})

onMounted(async () => {
  await Promise.all([loadMembers(), loadOrgs()])
})

async function loadMembers() {
  loading.value = true
  try {
    const res = await api.get('/cms/members')
    if (res.data?.success) members.value = res.data.data || []
  } catch { members.value = [] }
  finally { loading.value = false }
}

async function loadOrgs() {
  try {
    const res = await api.get('/cms/organisations')
    if (res.data?.success) organizations.value = res.data.data || []
  } catch {}
}

function openCreate() {
  editingItem.value = null
  form.value = { name: '', position: '', photo_url: '', phone: '', organization_id: organizations.value[0]?.id || '', group_type: '', period_start: '', period_end: '', order_index: members.value.length }
  showModal.value = true
}

function openEdit(item: Member) {
  editingItem.value = item
  form.value = { name: item.name, position: item.position, photo_url: item.photo_url || '', phone: item.phone || '', organization_id: item.organization_id || '', group_type: item.group_type || '', period_start: item.period_start || '', period_end: item.period_end || '', order_index: 0 }
  showModal.value = true
}

async function save() {
  saving.value = true
  try {
    const payload: Record<string, unknown> = { ...form.value }
    if (!payload.organization_id) delete payload.organization_id
    if (editingItem.value) {
      await api.patch(`/cms/members/${editingItem.value.id}`, payload)
    } else {
      await api.post('/cms/members', payload)
    }
    showModal.value = false
    await loadMembers()
  } finally { saving.value = false }
}

async function deleteItem(id: string) {
  if (!confirm('Hapus anggota ini?')) return
  deleting.value = id
  try { await api.delete(`/cms/members/${id}`); await loadMembers() }
  finally { deleting.value = null }
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

const filteredMembers = () => {
  if (activeFilter.value === 'all') return members.value
  return members.value.filter(m => m.organizations?.slug === activeFilter.value || m.group_type === activeFilter.value)
}

const orgFilters = () => {
  const seen = new Set()
  const filters: { label: string; value: string }[] = [{ label: 'Semua', value: 'all' }]
  for (const m of members.value) {
    const key = m.organizations?.slug || m.group_type || ''
    const label = m.organizations?.name || m.group_type || ''
    if (key && !seen.has(key)) { seen.add(key); filters.push({ label, value: key }) }
  }
  return filters
}
</script>

<template>
  <div class="space-y-6 animate-[fade-in_0.4s_ease-out]">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 flex items-center gap-2">
          <Users :size="24" class="text-green-600" /> Manajemen Kepengurusan
        </h1>
        <p class="text-sm text-surface-500 mt-1">Kelola anggota pengurus Dusun Menggah.</p>
      </div>
      <button 
        @click="openCreate" 
        class="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm active:scale-95"
      >
        <Plus :size="16" /> Tambah Anggota
      </button>
    </div>

    <!-- Filter by org -->
    <div class="flex gap-1.5 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
      <button
        v-for="f in orgFilters()"
        :key="f.value"
        @click="activeFilter = f.value"
        class="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border"
        :class="activeFilter === f.value ? 'bg-green-600 border-green-600 text-white shadow-sm' : 'bg-white border-surface-200 text-surface-500 hover:text-surface-900 hover:bg-surface-50'"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- Members Grid -->
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2.5">
      <div v-for="i in 14" :key="i" class="card animate-pulse text-center p-2.5">
        <div class="w-10 h-10 rounded-full bg-surface-200 mx-auto mb-2"></div>
        <div class="h-2.5 bg-surface-200 rounded-full w-3/4 mx-auto mb-1.5"></div>
        <div class="h-2 bg-surface-200 rounded-full w-1/2 mx-auto"></div>
      </div>
    </div>
    
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2.5">
      <div
        v-for="member in filteredMembers()"
        :key="member.id"
        class="card text-center p-2.5 flex flex-col justify-between hover:border-green-200 hover:shadow-sm transition-all duration-300 min-h-[145px]"
      >
        <!-- Top Section (Avatar & Details) -->
        <div class="flex flex-col items-center">
          <!-- Member Photo / Initials -->
          <div class="w-10 h-10 rounded-full mx-auto mb-2 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center overflow-hidden border border-green-100 shadow-inner">
            <img v-if="member.photo_url" :src="member.photo_url" :alt="member.name" class="w-full h-full object-cover" />
            <span v-else class="text-white font-black text-xs">{{ getInitials(member.name) }}</span>
          </div>

          <h3 class="font-bold text-surface-900 text-[11px] leading-snug mb-0.5 line-clamp-2 px-0.5" :title="member.name">
            {{ member.name }}
          </h3>
          <p class="text-green-600 text-[9px] font-semibold truncate w-full px-0.5" :title="member.position">
            {{ member.position }}
          </p>
          <p v-if="member.organizations?.name" class="text-surface-400 text-[8px] truncate w-full px-0.5" :title="member.organizations.name">
            {{ member.organizations.name }}
          </p>
        </div>

        <!-- Bottom Action Row (Symmetric, centered, compact) -->
        <div class="mt-2 pt-1.5 border-t border-surface-100 flex items-center justify-center gap-2">
          <button 
            @click="openEdit(member)" 
            class="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-colors flex items-center justify-center active:scale-95"
            title="Edit Anggota"
          >
            <Edit2 :size="11" />
          </button>
          <button 
            @click="deleteItem(member.id)" 
            :disabled="deleting === member.id" 
            class="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors flex items-center justify-center active:scale-95 disabled:opacity-50"
            title="Hapus Anggota"
          >
            <Trash2 :size="11" />
          </button>
        </div>
      </div>

      <div v-if="!loading && filteredMembers().length === 0" class="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-6 xl:col-span-7 py-12 text-center text-surface-400 card">
        <Users :size="32" class="mx-auto mb-3 text-surface-300" />
        <p class="font-medium text-xs">Belum ada anggota kepengurusan.</p>
      </div>
    </div>

    <!-- Modal Form -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-[fade-in_0.2s_ease-out]">
          <div class="p-6 border-b border-surface-100 flex items-center justify-between">
            <h2 class="text-base font-black text-surface-900">{{ editingItem ? 'Edit Anggota' : 'Tambah Anggota' }}</h2>
            <button 
              @click="showModal = false" 
              class="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="2 2 20 20" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form @submit.prevent="save" class="p-6 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-xs font-bold text-surface-600 mb-1.5 uppercase tracking-wide">Nama Lengkap *</label>
                <input 
                  v-model="form.name" 
                  type="text" 
                  required 
                  class="w-full border border-surface-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white" 
                />
              </div>
              
              <div>
                <label class="block text-xs font-bold text-surface-600 mb-1.5 uppercase tracking-wide">Jabatan *</label>
                <input 
                  v-model="form.position" 
                  type="text" 
                  required 
                  class="w-full border border-surface-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white" 
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-surface-600 mb-1.5 uppercase tracking-wide">Organisasi</label>
                <select 
                  v-model="form.organization_id" 
                  class="w-full border border-surface-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white"
                >
                  <option value="">— Pilih Organisasi —</option>
                  <option v-for="org in organizations" :key="org.id" :value="org.id">{{ org.name }}</option>
                </select>
              </div>

              <div class="sm:col-span-2">
                <label class="block text-xs font-bold text-surface-600 mb-1.5 uppercase tracking-wide">No. HP (opsional)</label>
                <input 
                  v-model="form.phone" 
                  type="text" 
                  class="w-full border border-surface-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white" 
                  placeholder="Contoh: 08123456789" 
                />
              </div>

              <div class="sm:col-span-2">
                <label class="block text-xs font-bold text-surface-600 mb-1.5 uppercase tracking-wide">Foto (opsional)</label>
                <ImageUpload
                  v-model="form.photo_url"
                  bucket="media"
                  folder="kepengurusan"
                  placeholder="Upload foto (opsional)"
                  @error="toast.error($event)"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-surface-600 mb-1.5 uppercase tracking-wide">Masa Jabatan Mulai</label>
                <input 
                  v-model="form.period_start" 
                  type="text" 
                  class="w-full border border-surface-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white" 
                  placeholder="Contoh: 2023" 
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-surface-600 mb-1.5 uppercase tracking-wide">Masa Jabatan Selesai</label>
                <input 
                  v-model="form.period_end" 
                  type="text" 
                  class="w-full border border-surface-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white" 
                  placeholder="Contoh: 2026 atau Sekarang" 
                />
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-surface-100">
              <button 
                type="button" 
                @click="showModal = false" 
                class="px-4 py-2.5 rounded-xl text-sm font-semibold text-surface-600 hover:bg-surface-100 transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit" 
                :disabled="saving" 
                class="px-6 py-2.5 rounded-xl text-sm font-semibold bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 transition-colors shadow-sm active:scale-95"
              >
                {{ saving ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

