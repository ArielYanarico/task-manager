
<script setup>
  defineProps({ stats: { type: Object, required: true } });
</script>

<template>
  <section class="grid grid-cols-1 gap-3 sm:grid-cols-3">
    <article v-for="item in [
      { label: 'Total tasks', value: stats.total },
      { label: 'Completed', value: stats.completed },
      { label: 'Pending', value: stats.pending },
    ]" :key="item.label" class="rounded-lg border border-slate-200 bg-white p-4">
      <p class="text-sm text-slate-500">{{ item.label }}</p>
      <p class="mt-1 text-2xl font-semibold text-slate-900">{{ item.value }}</p>
    </article>
  </section>
</template>
