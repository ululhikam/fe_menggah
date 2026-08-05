<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Edit2, Trash2, Users } from 'lucide-vue-next'
import api from '@/lib/api'

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
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">Manajemen Kepengurusan</h1>
        <p class="text-sm text-surface-500 mt-1">Kelola anggota pengurus Dusun Menggah.</p>
      </div>
      <button @click="openCreate" class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm">
        <Plus :size="16" /> Tambah Anggota
      </button>
    </div>

    <!-- Filter by org -->
    <div class="flex gap-1.5 overflow-x-auto pb-1">
      <button
        v-for="f in orgFilters()"
        :key="f.value"
        @click="activeFilter = f.value"
        class="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
        :class="activeFilter === f.value ? 'bg-green-600 text-white' : 'bg-white border border-surface-200 text-surface-500 hover:text-surface-900'"
      >{{ f.label }}</button>
    </div>

    <!-- Members Grid -->
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div v-for="i in 8" :key="i" class="card animate-pulse text-center">
        <div class="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-3"></div>
        <div class="h-3 bg-gray-200 rounded-full w-3/4 mx-auto"></div>
      </div>
    </div>
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div
        v-for="member in filteredMembers()"
        :key="member.id"
        class="card group text-center relative"
      >
        <div class="w-16 h-16 rounded-full mx-auto mb-3 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center overflow-hidden border-2 border-green-100">
          <img v-if="member.photo_url" :src="member.photo_url" :alt="member.name" class="w-full h-full object-cover" />
          <span v-else class="text-white font-black text-lg">{{ getInitials(member.name) }}</span>
        </div>
        <h3 class="font-black text-surface-900 text-sm leading-tight mb-0.5">{{ member.name }}</h3>
        <p class="text-green-600 text-xs font-semibold mb-1">{{ member.position }}</p>
        <p v-if="member.organizations?.name" class="text-surface-400 text-[10px]">{{ member.organizations.name }}</p>

        <!-- Actions (hover) -->
        <div class="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button @click="openEdit(member)" class="p-1 rounded-lg bg-white shadow text-surface-400 hover:text-green-600 transition-colors"><Edit2 :size="12" /></button>
          <button @click="deleteItem(member.id)" :disabled="deleting === member.id" class="p-1 rounded-lg bg-white shadow text-surface-400 hover:text-red-600 transition-colors"><Trash2 :size="12" /></button>
        </div>
      </div>
      <div v-if="!loading && filteredMembers().length === 0" class="col-span-4 py-12 text-center text-surface-400">
        <Users :size="32" class="mx-auto mb-3 text-surface-300" />
        <p>Belum ada anggota</p>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-lg font-black text-gray-900">{{ editingItem ? 'Edit Anggota' : 'Tambah Anggota' }}</h2>
          </div>
          <form @submit.prevent="save" class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div class="col-span-2">
                <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Nama Lengkap</label>
                <input v-model="form.name" type="text" required class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500" />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Jabatan</label>
                <input v-model="form.position" type="text" required class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500" />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Organisasi</label>
                <select v-model="form.organization_id" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500">
                  <option value="">— Pilih Organisasi —</option>
                  <option v-for="org in organizations" :key="org.id" :value="org.id">{{ org.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">No. HP (opsional)</label>
                <input v-model="form.phone" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500" placeholder="08xx..." />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Foto URL</label>
                <input v-model="form.photo_url" type="url" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500" placeholder="https://..." />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Masa Jabatan Mulai</label>
                <input v-model="form.period_start" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500" placeholder="2023" />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Masa Jabatan Selesai</label>
                <input v-model="form.period_end" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500" placeholder="2026 / sekarang" />
              </div>
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="showModal = false" class="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100">Batal</button>
              <button type="submit" :disabled="saving" class="px-6 py-2.5 rounded-xl text-sm font-semibold bg-green-600 hover:bg-green-700 text-white disabled:opacity-50">
                {{ saving ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
