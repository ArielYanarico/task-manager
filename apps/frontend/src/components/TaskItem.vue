
<script setup>
  defineProps({ task: { type: Object, required: true } });
  defineEmits(['complete']);
</script>

<template>
  <li class="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-4 last:border-0">
    <div class="min-w-0 flex-1 space-y-1">
      <p class="truncate text-sm font-medium text-slate-800">
        {{ task.title }}
      </p>

      <p
        class="text-xs font-medium"
        :class="task.status === 'done'
          ? 'text-emerald-700'
          : 'text-amber-600'"
      >
        {{ task.status === 'done' ? 'Completed' : 'Pending' }}
      </p>
    </div>

    <button
      v-if="task.status !== 'done'"
      @click="$emit('complete', task._id)"
      class="shrink-0 whitespace-nowrap rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
    >
      Mark as completed
    </button>

    <span
      v-else
      class="shrink-0 whitespace-nowrap text-sm font-medium text-emerald-700"
    >
      ✓ Done
    </span>
  </li>
</template>
