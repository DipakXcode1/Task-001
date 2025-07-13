const bcrypt = require('bcryptjs');

// In-memory user storage (in production, use a database)
const users = [];

class User {
  constructor(email, password, role = 'user') {
    this.id = Date.now().toString();
    this.email = email;
    this.password = password;
    this.role = role;
    this.createdAt = new Date();
    this.lastLogin = null;
  }

  static async create(email, password, role = 'user') {
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User(email, hashedPassword, role);
    users.push(user);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async findByEmail(email) {
    return users.find(user => user.email === email);
  }

  static async findById(id) {
    const user = users.find(user => user.id === id);
    if (!user) return null;
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async validatePassword(user, password) {
    return bcrypt.compare(password, user.password);
  }

  static async updateLastLogin(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
      user.lastLogin = new Date();
    }
  }

  static getAllUsers() {
    return users.map(user => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}

module.exports = User; 