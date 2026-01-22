<!-- pages/index.vue -->
<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-50">
    <UCard class="w-full max-w-lg text-center">
      <div class="py-8">
        <h1 class="text-3xl font-bold mb-4">Gestión de Tareas</h1>
        <p class="mb-8 text-gray-600">Organiza tus tareas de manera eficiente con nuestra aplicación.</p>
        
        <div class="flex justify-center gap-4">
          <UButton to="/login" color="primary">Iniciar Sesión</UButton>
          <UButton to="/register" color="gray">Registrarse</UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>