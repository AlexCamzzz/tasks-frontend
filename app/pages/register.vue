<!-- pages/register.vue -->
<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-50">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-xl font-bold">Registro</h1>
      </template>
      
      <UForm :state="form" @submit="register">
        <UFormGroup label="Nombre" name="name">
          <UInput v-model="form.name" placeholder="Tu nombre completo" />
        </UFormGroup>
        
        <UFormGroup label="Email" name="email">
          <UInput v-model="form.email" type="email" placeholder="tu@email.com" />
        </UFormGroup>
        
        <UFormGroup label="Contraseña" name="password">
          <UInput v-model="form.password" type="password" placeholder="Mínimo 6 caracteres" />
        </UFormGroup>
        
        <div v-if="error" class="my-4 text-red-500 text-sm">
          {{ error }}
        </div>
        
        <UButton type="submit" color="primary" block :loading="isLoading">
          {{ isLoading ? 'Registrando...' : 'Registrarse' }}
        </UButton>
      </UForm>
      
      <template #footer>
        <div class="text-center text-sm">
          ¿Ya tienes cuenta? <NuxtLink to="/login" class="text-blue-500 hover:underline">Inicia sesión</NuxtLink>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup>
const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: ''
})
const error = ref('')
const isLoading = ref(false)

const register = async () => {
  error.value = ''
  isLoading.value = true
  
  try {
    await authStore.register(form.value.email, form.value.password, form.value.name)
    // Redirigir a login después del registro exitoso
    router.push('/login')
  } catch (e) {
    error.value = e.message || 'Error al registrarse'
  } finally {
    isLoading.value = false
  }
}
</script>