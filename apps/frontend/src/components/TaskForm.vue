
<script setup>
  import { ref } from 'vue';

  defineProps({ loading: Boolean });
  const emit = defineEmits(['add']);
  const title = ref('');

  function submit() {
    const value = title.value.trim();
    if (!value) return;
    emit('add', value);
    title.value = '';
  }
</script>

<template>
  <form @submit.prevent="submit"
    class="rounded-lg border border-slate-200 bg-white p-4">
    <label for="task-title" class="mb-2 block text-sm font-semibold">
      Add a new task
    </label>
    <div class="flex flex-col gap-3 sm:flex-row">
      <input id="task-title" v-model="title" required maxlength="200"
        placeholder="Enter task title..."
        class="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-600" />
      <button :disabled="loading"
        class="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
        {{ loading ? 'Adding...' : '+ Add Task' }}
      </button>
    </div>
  </form>
</template>
