// stores/tasks.ts
import { defineStore } from 'pinia'

export interface Task {
  id: number
  title: string
  description?: string
  completed: boolean
  dueDate?: string
  category?: string
  userId: number
  createdAt: string
}

export interface TaskFilters {
  completed?: boolean
  category?: string
  search?: string
}

export const useTasksStore = defineStore('tasks', () => {
  // State
  const tasks = ref<Task[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // API client
  const apiClient = useApiClient()
  
  // Getters
  const completedTasks = computed(() => tasks.value.filter(task => task.completed))
  const pendingTasks = computed(() => tasks.value.filter(task => !task.completed))
  const getTasksByCategory = (category: string) => {
    return computed(() => tasks.value.filter(task => task.category === category))
  }
  
  // Actions
  async function fetchTasks(filters: TaskFilters = {}) {
    isLoading.value = true
    error.value = null
    
    try {
      const { data, error: apiError } = await apiClient.get<Task[]>('/tasks', filters)
      
      if (apiError.value) {
        throw createError({
          message: apiError.value.message || 'Error al cargar tareas',
          statusCode: apiError.value.statusCode || 500
        })
      }
      
      tasks.value = data.value || []
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }
  
  async function createTask(taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'completed'>) {
    isLoading.value = true
    error.value = null
    
    try {
      const { data, error: apiError } = await apiClient.post<Task>('/tasks', taskData)
      
      if (apiError.value) {
        throw createError({
          message: apiError.value.message || 'Error al crear tarea',
          statusCode: apiError.value.statusCode || 500
        })
      }
      
      if (data.value) {
        tasks.value.push(data.value)
      }
      
      return data.value
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  async function updateTask(id: number, taskData: Partial<Task>) {
    isLoading.value = true
    error.value = null
    
    try {
      const { data, error: apiError } = await apiClient.put<Task>(`/tasks/${id}`, taskData)
      
      if (apiError.value) {
        throw createError({
          message: apiError.value.message || 'Error al actualizar tarea',
          statusCode: apiError.value.statusCode || 500
        })
      }
      
      if (data.value) {
        const index = tasks.value.findIndex(t => t.id === id)
        if (index !== -1) {
          tasks.value[index] = data.value
        }
      }
      
      return data.value
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  async function completeTask(id: number) {
    error.value = null
    
    try {
      const { data, error: apiError } = await apiClient.patch<Task>(`/tasks/${id}/complete`)
      
      if (apiError.value) {
        throw createError({
          message: apiError.value.message || 'Error al completar tarea',
          statusCode: apiError.value.statusCode || 500
        })
      }
      
      if (data.value) {
        const index = tasks.value.findIndex(t => t.id === id)
        if (index !== -1) {
          tasks.value[index].completed = true
        }
      }
      
      return data.value
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }
  
  async function deleteTask(id: number) {
    error.value = null
    
    try {
      const { error: apiError } = await apiClient.delete<void>(`/tasks/${id}`)
      
      if (apiError.value) {
        throw createError({
          message: apiError.value.message || 'Error al eliminar tarea',
          statusCode: apiError.value.statusCode || 500
        })
      }
      
      tasks.value = tasks.value.filter(t => t.id !== id)
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }
  
  return {
    tasks,
    isLoading,
    error,
    completedTasks,
    pendingTasks,
    getTasksByCategory,
    fetchTasks,
    createTask,
    updateTask,
    completeTask,
    deleteTask
  }
})