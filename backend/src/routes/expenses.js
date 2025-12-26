const express = require('express');
const { body, validationResult } = require('express-validator');
const { DatabaseService } = require('../shared/database');
const { requireAuth } = require('../shared/auth');

const router = express.Router();

// Get user expenses
router.get('/', requireAuth, async (req, res) => {
  try {
    const expenses = await DatabaseService.findByUserId('expenses', req.userId);
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new expense
router.post('/', [
  requireAuth,
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('category').isIn(['food', 'transport', 'books', 'entertainment', 'housing', 'other']).withMessage('Invalid category'),
  body('description').notEmpty().withMessage('Description is required'),
  body('expense_date').isISO8601().withMessage('Valid expense date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, category, description, expense_date } = req.body;
    
    const expenseData = {
      expense_id: `expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: req.userId,
      amount: parseFloat(amount),
      category,
      description: description.trim(),
      expense_date
    };

    const savedExpense = await DatabaseService.create('expenses', expenseData);
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update expense
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const expenseId = req.params.id;
    const { amount, category, description, expense_date } = req.body;
    
    const existingExpense = await DatabaseService.findById('expenses', expenseId, req.userId);
    if (!existingExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const updateData = {};
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description.trim();
    if (expense_date !== undefined) updateData.expense_date = expense_date;

    const savedExpense = await DatabaseService.update('expenses', expenseId, updateData, req.userId);
    res.json(savedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete expense
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const expenseId = req.params.id;
    
    const existingExpense = await DatabaseService.findById('expenses', expenseId, req.userId);
    if (!existingExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const deleted = await DatabaseService.delete('expenses', expenseId, req.userId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Expense not found' });
    }
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;