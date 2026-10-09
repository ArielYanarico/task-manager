
<script setup>
  defineProps({ modelValue: String });
  defineEmits(['update:modelValue']);

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'created' },
    { label: 'Completed', value: 'done' },
  ];
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button v-for="item in filters" :key="item.value"
      @click="$emit('update:modelValue', item.value)"
      class="rounded-md px-4 py-2 text-sm font-medium"
      :class="modelValue === item.value
        ? 'bg-blue-600 text-white'
        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'">
      {{ item.label }}
    </button>
  </div>
</template>
