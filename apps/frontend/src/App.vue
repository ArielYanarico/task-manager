<script setup>
  import { onMounted } from 'vue';

  import { useTasks } from './composables/useTasks';
  import TaskStats from './components/TaskStats.vue';
  import TaskForm from './components/TaskForm.vue';
  import TaskFilters from './components/TaskFilters.vue';
  import TaskList from './components/TaskList.vue';

  const { loading, error, filter, filteredTasks, stats, loadTasks, addTask, markCompleted } = useTasks();

  onMounted(loadTasks);
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4">
        <span class="flex size-9 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white">✓</span>
        <span class="text-lg font-bold">TaskManager</span>
      </div>
    </header>

    <main class="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <section>
        <h1 class="text-2xl font-bold">My Tasks</h1>
        <p class="mt-1 text-sm text-slate-500">
          Stay organized and get things done!
        </p>
      </section>

      <TaskStats :stats="stats" />
      <TaskForm :loading="loading" @add="addTask" />

      <p v-if="error" role="alert"
        class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        {{ error }}
        <button @click="loadTasks" class="ml-2 font-semibold underline">
          Retry
        </button>
      </p>

      <TaskFilters v-model="filter" />
      <TaskList :tasks="filteredTasks" :loading="loading"
        @complete="markCompleted" />
    </main>
  </div>
</template>

<style scoped></style>
