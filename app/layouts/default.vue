<!-- layouts/default.vue -->
<template>
  <div>
    <header v-if="authStore.isAuthenticated" class="bg-white shadow">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <NuxtLink to="/tasks" class="text-xl font-bold">Task Manager</NuxtLink>
        
        <nav class="flex items-center gap-4">
          <NuxtLink to="/tasks" class="hover:text-primary">Tareas</NuxtLink>
          <UButton color="gray" variant="ghost" @click="logout">
            Cerrar sesión
          </UButton>
        </nav>
      </div>
    </header>
    
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
const router = useRouter()
const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>