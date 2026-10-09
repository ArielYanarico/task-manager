<script setup>
import TaskItem from './TaskItem.vue';

defineProps({ tasks: Array, loading: Boolean });
defineEmits(['complete']);
</script>

<template>
  <section class="overflow-hidden rounded-lg border border-slate-200 bg-white">
    <div class="flex items-center justify-between border-b border-slate-200 p-4">
      <h2 class="font-semibold text-slate-900">My Tasks</h2>
      <span class="text-sm text-slate-500">{{ tasks.length }} tasks</span>
    </div>

    <p v-if="loading" class="p-6 text-sm text-slate-500">Loading tasks...</p>
    <p v-else-if="!tasks.length" class="p-8 text-center text-sm text-slate-500">
      No tasks found. Add your first task to get started.
    </p>

    <ul v-else>
      <TaskItem v-for="task in tasks" :key="task.id"
        :task="task" @complete="$emit('complete', $event)" />
    </ul>

  </section>
</template>
