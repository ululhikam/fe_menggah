<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { UserCog, Plus, Shield, Edit, Trash2, Mail, RefreshCw, X } from 'lucide-vue-next'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from '@/composables/useToast'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
}

// ─── State ────────────────────────────────────────────────────────────────────

const toast     = useToast()
const authStore = useAuthStore()
const loading   = ref(true)
const users     = ref<AdminUser[]>([])

// Invite modal
const showInviteModal = ref(false)
const inviteEmail     = ref('')
const inviteRole      = ref<'admin' | 'super_admin'>('admin')
const inviting        = ref(false)

// Edit role modal
const editTarget = ref<AdminUser | null>(null)
const editRole   = ref('')
const saving     = ref(false)

// Delete confirm
const deleteTarget = ref<AdminUser | null>(null)
const deleting     = ref(false)

const roleColors: Record<string, string> = {
  super_admin: 'badge-warm',
  admin: 'badge-primary',
}
const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  warga: 'Warga',
}

// ─── Methods ──────────────────────────────────────────────────────────────────

async function loadUsers() {
  loading.value = true
  try {
    // Coba ambil dari Supabase Auth admin API via backend
    // Fallback: ambil dari tabel profiles dengan role admin/super_admin
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, phone, created_at')
      .in('role', ['admin', 'super_admin'])
      .order('created_at', { ascending: false })

    if (error) throw error

    // Gabungkan dengan data email dari Supabase Auth (jika tersedia)
    // Pada production, ini sebaiknya dari API backend yang memanggil supabase.auth.admin.listUsers()
    users.value = (data || []).map((p: any) => ({
      id: p.id,
      email: p.id, // placeholder — akan diisi dari auth jika tersedia
      full_name: p.full_name || 'Tanpa Nama',
      role: p.role,
      created_at: p.created_at,
    }))

    // Coba dapatkan email dari user yang sedang login
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (currentUser) {
      users.value = users.value.map((u) =>
        u.id === currentUser.id ? { ...u, email: currentUser.email || u.email } : u
      )
    }
  } catch (err: any) {
    // Jika gagal (misal: mock session), gunakan data mock
    users.value = [
      { id: 'mock-super-admin-id', email: 'superadmin@katekan.desa.id', full_name: 'Supardi (Super Admin KKN)', role: 'super_admin', created_at: new Date().toISOString() },
      { id: 'mock-admin-id', email: 'admin@katekan.desa.id', full_name: 'Sarwono, S.Sos', role: 'admin', created_at: new Date().toISOString() },
    ]
    console.warn('[UsersView] Menggunakan data mock:', err?.message)
  } finally {
    loading.value = false
  }
}

async function inviteAdmin() {
  if (!inviteEmail.value.trim()) return
  inviting.value = true
  try {
    // Undang admin baru via Supabase Auth (admin harus punya service role key di backend)
    // Saat ini gunakan signUp sebagai alternatif
    const { error } = await supabase.auth.signUp({
      email: inviteEmail.value.trim(),
      password: Math.random().toString(36).slice(-12), // temporary password
      options: { data: { role: inviteRole.value, full_name: '' } },
    })
    if (error) throw error
    toast.success(`Undangan terkirim ke ${inviteEmail.value}`)
    showInviteModal.value = false
    inviteEmail.value = ''
    await loadUsers()
  } catch (err: any) {
    toast.error(err?.message || 'Gagal mengundang admin.')
  } finally {
    inviting.value = false
  }
}

function openEditRole(user: AdminUser) {
  editTarget.value = user
  editRole.value = user.role
}

async function saveRole() {
  if (!editTarget.value) return
  saving.value = true
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: editRole.value })
      .eq('id', editTarget.value.id)
    if (error) throw error
    toast.success('Role pengguna berhasil diperbarui.')
    editTarget.value = null
    await loadUsers()
  } catch (err: any) {
    toast.error(err?.message || 'Gagal mengubah role.')
  } finally {
    saving.value = false
  }
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  // Jangan hapus akun sendiri
  if (deleteTarget.value.id === authStore.user?.id) {
    toast.error('Anda tidak bisa menghapus akun Anda sendiri.')
    deleteTarget.value = null
    return
  }
  deleting.value = true
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'warga' })
      .eq('id', deleteTarget.value.id)
    if (error) throw error
    toast.success('Akses admin berhasil dicabut.')
    deleteTarget.value = null
    await loadUsers()
  } catch (err: any) {
    toast.error(err?.message || 'Gagal mencabut akses.')
  } finally {
    deleting.value = false
  }
}

onMounted(() => loadUsers())
</script>

<template>
  <div class="space-y-6 animate-[fade-in_0.4s_ease-out]">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 flex items-center gap-2">
          <UserCog :size="22" /> Pengguna & Role
        </h1>
        <p class="text-sm text-surface-500 mt-1">Kelola akun dan hak akses pengguna admin.</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="loadUsers"
          :class="loading ? 'animate-spin' : ''"
          class="p-2 rounded-xl border border-surface-200 text-surface-500 hover:text-surface-900 hover:bg-surface-50 transition-colors"
          title="Refresh"
        >
          <RefreshCw :size="15" />
        </button>
        <button
          @click="showInviteModal = true"
          class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm"
        >
          <Plus :size="16" /> Tambah Admin
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="card p-0 overflow-hidden">
      <div v-if="loading" class="p-10 flex justify-center">
        <div class="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-surface-200 bg-surface-50">
              <th class="text-left py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider">Pengguna</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider hidden sm:table-cell">Email / ID</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider">Role</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider hidden md:table-cell">Bergabung</th>
              <th class="text-right py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="users.length === 0">
              <td colspan="5" class="py-14 text-center text-surface-400">
                <UserCog :size="36" class="mx-auto mb-3 text-surface-200" />
                <p class="font-medium">Belum ada admin terdaftar.</p>
              </td>
            </tr>
            <tr
              v-for="u in users"
              :key="u.id"
              class="border-b border-surface-50 hover:bg-surface-50/80 transition-colors"
              :class="u.id === authStore.user?.id ? 'bg-green-50/30' : ''"
            >
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-gradient-to-br from-green-700 to-emerald-600 flex items-center justify-center shrink-0">
                    <span class="text-white text-xs font-bold">
                      {{ u.full_name.slice(0, 2).toUpperCase() }}
                    </span>
                  </div>
                  <div>
                    <span class="font-semibold text-surface-800">{{ u.full_name }}</span>
                    <span v-if="u.id === authStore.user?.id" class="ml-2 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">Anda</span>
                  </div>
                </div>
              </td>
              <td class="py-3.5 px-4 text-surface-500 text-xs hidden sm:table-cell font-mono truncate max-w-[160px]">
                {{ u.email.includes('@') ? u.email : u.id.slice(0, 16) + '...' }}
              </td>
              <td class="py-3.5 px-4">
                <span :class="roleColors[u.role] || 'badge-neutral'" class="inline-flex items-center gap-1">
                  <Shield :size="11" /> {{ roleLabels[u.role] || u.role }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-surface-400 text-xs hidden md:table-cell">
                {{ new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}
              </td>
              <td class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button
                    @click="openEditRole(u)"
                    class="p-1.5 rounded-lg text-surface-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    title="Ubah Role"
                  >
                    <Edit :size="15" />
                  </button>
                  <button
                    @click="deleteTarget = u"
                    :disabled="u.id === authStore.user?.id"
                    class="p-1.5 rounded-lg text-surface-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Cabut akses admin"
                  >
                    <Trash2 :size="15" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Info -->
    <div class="card bg-amber-50 border border-amber-100 text-amber-700 text-sm p-4">
      <p class="font-semibold mb-1">ℹ️ Catatan</p>
      <p class="text-xs leading-relaxed">Untuk undangan email penuh (reset password otomatis), pastikan backend dikonfigurasi dengan Supabase Service Role Key dan endpoint <code class="bg-amber-100 px-1 rounded">/cms/users</code> sudah tersedia.</p>
    </div>

    <!-- ─── Invite Admin Modal ─── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showInviteModal" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-[9997] p-4">
          <div class="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
            <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 class="text-base font-black text-slate-900">Undang Admin Baru</h2>
              <button @click="showInviteModal = false" class="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"><X :size="16" /></button>
            </div>
            <form @submit.prevent="inviteAdmin" class="p-6 space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Email *</label>
                <div class="relative">
                  <Mail :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    v-model="inviteEmail"
                    type="email"
                    required
                    class="w-full pl-9 pr-4 border border-slate-200 rounded-xl py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                    placeholder="email@contoh.com"
                  />
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Role</label>
                <select v-model="inviteRole" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500">
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div class="flex justify-end gap-3 pt-2">
                <button type="button" @click="showInviteModal = false" class="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100">Batal</button>
                <button type="submit" :disabled="inviting" class="px-6 py-2.5 rounded-xl text-sm font-semibold bg-green-600 hover:bg-green-700 text-white disabled:opacity-50">
                  {{ inviting ? 'Mengundang...' : 'Kirim Undangan' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ─── Edit Role Modal ─── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="editTarget" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-[9997] p-4">
          <div class="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4">
            <h2 class="text-base font-black text-slate-900">Ubah Role — {{ editTarget.full_name }}</h2>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Role Baru</label>
              <select v-model="editRole" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500">
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <div class="flex justify-end gap-3">
              <button @click="editTarget = null" class="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100">Batal</button>
              <button @click="saveRole" :disabled="saving" class="px-6 py-2.5 rounded-xl text-sm font-semibold bg-green-600 hover:bg-green-700 text-white disabled:opacity-50">
                {{ saving ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ─── Confirm Delete ─── -->
    <ConfirmModal
      :open="!!deleteTarget"
      title="Cabut Akses Admin"
      :description="`Role '${deleteTarget?.full_name}' akan diubah menjadi Warga biasa. Mereka tidak bisa lagi mengakses panel admin.`"
      confirm-label="Ya, Cabut Akses"
      variant="warning"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />

  </div>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
