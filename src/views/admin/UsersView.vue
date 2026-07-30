<script setup lang="ts">
import { ref } from 'vue'
import { UserCog, Plus, Shield, Edit, Trash2 } from 'lucide-vue-next'

const users = ref([
  { id: '1', name: 'H. Ahmad Suryadi', email: 'admin@desa.go.id', role: 'super_admin' },
  { id: '2', name: 'Siti Nurhaliza', email: 'siti@desa.go.id', role: 'admin' },
  { id: '3', name: 'Budi Santoso', email: 'budi@desa.go.id', role: 'admin' },
])

const roleColors: Record<string, string> = { super_admin: 'badge-warm', admin: 'badge-primary', warga: 'badge-neutral' }
const roleLabels: Record<string, string> = { super_admin: 'Super Admin', admin: 'Admin', warga: 'Warga' }
</script>

<template>
  <div class="space-y-6 animate-[fade-in_0.4s_ease-out]">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 flex items-center gap-2"><UserCog :size="24" /> Pengguna & Role</h1>
        <p class="text-sm text-surface-500 mt-1">Kelola akun dan hak akses pengguna.</p>
      </div>
      <button class="btn-primary"><Plus :size="16" /> Tambah Admin</button>
    </div>

    <div class="card p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-surface-200 bg-surface-50">
              <th class="text-left py-3 px-4 font-semibold text-surface-600">Pengguna</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-600">Email</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-600">Role</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in users" :key="u.id" class="border-b border-surface-50 hover:bg-surface-50/80 transition-colors">
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full gradient-primary flex items-center justify-center">
                    <span class="text-white text-xs font-bold">{{ u.name.slice(0, 2).toUpperCase() }}</span>
                  </div>
                  <span class="font-medium text-surface-800">{{ u.name }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-surface-500">{{ u.email }}</td>
              <td class="py-3 px-4">
                <span :class="roleColors[u.role]" class="inline-flex items-center gap-1">
                  <Shield :size="12" /> {{ roleLabels[u.role] }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center gap-1">
                  <button class="p-1.5 rounded-lg text-surface-400 hover:bg-primary-50 hover:text-primary-600"><Edit :size="16" /></button>
                  <button class="p-1.5 rounded-lg text-surface-400 hover:bg-red-50 hover:text-danger-500"><Trash2 :size="16" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
