import { Router } from 'express';

import Task from '../dataAccessLayer/models/task.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const tasks = await Task.find();
    return res.send(tasks);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    return res.send(task);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:taskId', async (req, res) => {
  try {
    const id = req.params.taskId;

    const updatedTask = await Task.findByIdAndUpdate(
      id, 
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json(updatedTask);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
