import { describe, it, expect, vi, beforeEach } from 'vitest'

import { mount, flushPromises } from '@vue/test-utils'
import App from '../App.vue'
import * as api from '../api/tasks'

vi.mock('../api/tasks')

function findButtonByText(wrapper, text) {
  return wrapper.findAll('button').find(button => button.text().includes(text))
}

describe('App', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders tasks loaded from the API', async () => {
    api.getTasks.mockResolvedValue([
      { _id: '1', title: 'Buy milk', status: 'created' },
    ])

    const wrapper = mount(App)
    await flushPromises()

    expect(wrapper.text()).toContain('Buy milk')
    expect(wrapper.text()).toContain('Pending')
  })

  it('adds a task submitted through the form', async () => {
    api.getTasks.mockResolvedValue([])
    api.createTask.mockResolvedValue({
      _id: '10',
      title: 'Write tests',
      status: 'created',
    })

    const wrapper = mount(App)
    await flushPromises()

    await wrapper.find('#task-title').setValue('Write tests')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(api.createTask).toHaveBeenCalledWith('Write tests')
    expect(wrapper.text()).toContain('Write tests')
  })

  it('updates the list when a task is marked as completed', async () => {
    api.getTasks.mockResolvedValue([
      { _id: '1', title: 'Buy milk', status: 'created' },
    ])
    api.completeTask.mockResolvedValue({
      _id: '1',
      title: 'Buy milk',
      status: 'done',
    })

    const wrapper = mount(App)
    await flushPromises()

    expect(findButtonByText(wrapper, 'Mark as completed')).toBeTruthy()

    await findButtonByText(wrapper, 'Mark as completed').trigger('click')
    await flushPromises()

    expect(api.completeTask).toHaveBeenCalledWith('1')
    expect(findButtonByText(wrapper, 'Mark as completed')).toBeUndefined()
    expect(wrapper.text()).toContain('✓ Done')
  })
})
