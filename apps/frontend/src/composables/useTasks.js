
import { ref, computed } from 'vue';
import * as api from '../api/tasks';

export function useTasks() {
  const tasks = ref([]);
  const loading = ref(false);
  const error = ref('');
  const filter = ref('all');

  const filteredTasks = computed(() =>
    tasks.value.filter((task) =>
      filter.value === 'all' || task.status === filter.value
    )
  );

  const stats = computed(() => ({
    total: tasks.value.length,
    completed: tasks.value.filter(t => t.status === 'done').length,
    pending: tasks.value.filter(t => t.status === 'created').length,
  }));

  async function run(action) {
    error.value = '';
    loading.value = true;
    try {
      return await action();
    } catch (e) {
      error.value = e.message || 'Something went wrong';
    } finally {
      loading.value = false;
    }
  }

  const loadTasks = () => run(async () => {
    tasks.value = await api.getTasks();
  });

  const addTask = (title) => run(async () => {
    const task = await api.createTask(title);
    tasks.value.unshift(task);
  });

  const markCompleted = (id) => run(async () => {
    const updated = await api.completeTask(id);
    const index = tasks.value.findIndex(t => t._id === id);
    if (index !== -1) {
      tasks.value[index] = updated ?? {
        ...tasks.value[index], status: 'done',
      };
    }
  });

  return {
    tasks, loading, error, filter, filteredTasks, stats, loadTasks, addTask, markCompleted,
  };
}
