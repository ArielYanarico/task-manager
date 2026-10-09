import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useTasks } from '../composables/useTasks'
import * as api from '../api/tasks'

vi.mock('../api/tasks')

describe('useTasks', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('loads tasks from the API', async () => {
    const remote = [{ _id: '1', title: 'A', status: 'created' }]
    api.getTasks.mockResolvedValue(remote)

    const { tasks, loadTasks, loading } = useTasks()
    await loadTasks()

    expect(api.getTasks).toHaveBeenCalledOnce()
    expect(tasks.value).toEqual(remote)
    expect(loading.value).toBe(false)
  })

  it('adds a new task to the top of the list', async () => {
    const created = { _id: '2', title: 'New', status: 'created' }
    api.createTask.mockResolvedValue(created)

    const { tasks, addTask } = useTasks()
    await addTask('New')

    expect(api.createTask).toHaveBeenCalledWith('New')
    expect(tasks.value[0]).toEqual(created)
  })

  it('marks a task as completed using its _id', async () => {
    api.getTasks.mockResolvedValue([
      { _id: '1', title: 'A', status: 'created' },
      { _id: '2', title: 'B', status: 'created' },
    ])
    api.completeTask.mockResolvedValue({
      _id: '2',
      title: 'B',
      status: 'done',
    })

    const { tasks, loadTasks, markCompleted, stats } = useTasks()
    await loadTasks()
    await markCompleted('2')

    expect(api.completeTask).toHaveBeenCalledWith('2')
    expect(tasks.value.find(t => t._id === '2').status).toBe('done')
    expect(tasks.value.find(t => t._id === '1').status).toBe('created')
    expect(stats.value.completed).toBe(1)
  })

  it('falls back to a local status update when the API returns nothing', async () => {
    api.getTasks.mockResolvedValue([
      { _id: '1', title: 'A', status: 'created' },
    ])
    api.completeTask.mockResolvedValue(null)

    const { tasks, loadTasks, markCompleted } = useTasks()
    await loadTasks()
    await markCompleted('1')

    expect(tasks.value[0].status).toBe('done')
  })

  it('filters tasks by status and computes stats', async () => {
    api.getTasks.mockResolvedValue([
      { _id: '1', title: 'A', status: 'created' },
      { _id: '2', title: 'B', status: 'done' },
      { _id: '3', title: 'C', status: 'done' },
    ])

    const { loadTasks, filteredTasks, filter, stats } = useTasks()
    await loadTasks()

    expect(stats.value).toEqual({ total: 3, completed: 2, pending: 1 })

    filter.value = 'created'
    expect(filteredTasks.value.map(t => t._id)).toEqual(['1'])

    filter.value = 'done'
    expect(filteredTasks.value.map(t => t._id)).toEqual(['2', '3'])
  })

  it('exposes an error message when a request fails', async () => {
    api.getTasks.mockRejectedValue(new Error('boom'))

    const { loadTasks, error } = useTasks()
    await loadTasks()

    expect(error.value).toBe('boom')
  })
})
