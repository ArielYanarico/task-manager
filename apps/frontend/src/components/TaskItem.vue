
<script setup>
defineProps({ task: { type: Object, required: true } });
defineEmits(['complete']);
</script>

<template>
  <li class="flex flex-col gap-3 border-b border-slate-100 p-4 last:border-0 sm:flex-row sm:items-center">
    <span class="min-w-0 flex-1 wrap-break-word text-sm font-medium text-slate-800">
      {{ task.title }}
    </span>

    <div class="flex items-center justify-between gap-3 sm:justify-end">
      <span class="rounded-full px-3 py-1 text-xs font-medium"
        :class="task.status === 'completed'
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-amber-100 text-amber-700'">
        {{ task.status === 'completed' ? 'Completed' : 'Pending' }}
      </span>

      <button v-if="task.status !== 'completed'"
        @click="$emit('complete', task._id)"
        class="rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700">
        Mark as completed
      </button>
      <span v-else class="text-sm text-emerald-700">✓ Done</span>
    </div>
  </li>
</template>
