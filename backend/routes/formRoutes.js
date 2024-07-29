const express = require('express');
const Form = require('../models/Form');

const router = express.Router();

// Get all forms
router.get('/', async (req, res) => {
    try {
      const forms = await Form.find();
      res.json(forms);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Create a new form
router.post('/', async (req, res) => {
    const { title, inputs } = req.body;
    const newForm = new Form({ title, inputs });
    try {
      const savedForm = await newForm.save();
      res.status(201).json(savedForm);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (form == null) {
      return res.status(404).json({ message: 'Cannot find form' });
    }
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  const { title, inputs } = req.body;

  try {
    const form = await Form.findById(req.params.id);
    if (form == null) {
      return res.status(404).json({ message: 'Cannot find form' });
    }

    if (title != null) {
      form.title = title;
    }
    if (inputs != null) {
      form.inputs = inputs;
    }

    const updatedForm = await form.save();
    res.json(updatedForm);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a form
router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await Form.findByIdAndDelete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
module.exports = router;
