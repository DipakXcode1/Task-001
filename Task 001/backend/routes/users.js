const express = require('express');
const User = require('../models/User');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', requireRole(['admin']), async (req, res) => {
  try {
    const users = User.getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get user by ID (admin or own profile)
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user is requesting their own profile or is admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update user profile (own profile or admin)
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { email, role } = req.body;
    
    // Check if user is updating their own profile or is admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Only admins can change roles
    if (role && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can change roles' });
    }

    // Find user in the array and update
    const userIndex = User.getAllUsers().findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    if (email) {
      // Check if email is already taken by another user
      const existingUser = User.getAllUsers().find(u => u.email === email && u.id !== userId);
      if (existingUser) {
        return res.status(409).json({ error: 'Email already taken' });
      }
      User.getAllUsers()[userIndex].email = email;
    }

    if (role && req.user.role === 'admin') {
      User.getAllUsers()[userIndex].role = role;
    }

    const updatedUser = await User.findById(userId);
    res.json({ 
      message: 'User updated successfully',
      user: updatedUser 
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user (admin only)
router.delete('/:id', requireRole(['admin']), async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Prevent admin from deleting themselves
    if (req.user.id === userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const userIndex = User.getAllUsers().findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove user from array
    User.getAllUsers().splice(userIndex, 1);
    
    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get user statistics (admin only)
router.get('/stats/overview', requireRole(['admin']), async (req, res) => {
  try {
    const users = User.getAllUsers();
    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.lastLogin).length,
      userRoles: users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {}),
      recentRegistrations: users
        .filter(u => {
          const daysSinceCreation = (Date.now() - new Date(u.createdAt)) / (1000 * 60 * 60 * 24);
          return daysSinceCreation <= 7;
        })
        .length
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

module.exports = router; 