<script setup>
  import { onMounted } from 'vue';
  
  import { useTasks } from './composables/useTasks';
  import TaskList from './components/TaskList.vue';

  const { loading, error, filter, filteredTasks, loadTasks, addTask, markCompleted, } = useTasks();

  onMounted(loadTasks);
</script>

<template>
  <header class="border-b border-slate-200 bg-white">
    <div class="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4">
      <span class="text-lg font-bold">TaskManager</span>
    </div>
  </header>
  <main class="mx-auto max-w-6xl space-y-6 px-4 py-8">
  <TaskList :tasks="filteredTasks" :loading="loading" @complete="markCompleted"/>
  </main>
</template>

<style scoped></style>
