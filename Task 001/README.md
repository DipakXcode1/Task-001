# Secure User Authentication System

A robust and secure user authentication system built with Node.js, Express, and modern web technologies. This system implements secure login/registration functionality with role-based access control and protected routes.

## Features

### 🔐 Security Features
- **Password Hashing**: Uses bcryptjs with 12 salt rounds for secure password storage
- **JWT Authentication**: JSON Web Tokens for stateless session management
- **Input Validation**: Comprehensive validation using express-validator
- **Rate Limiting**: Protection against brute force attacks
- **Security Headers**: Helmet.js for enhanced security
- **CORS Protection**: Cross-origin resource sharing protection

### 👥 User Management
- **User Registration**: Secure account creation with validation
- **User Login**: Secure authentication with JWT tokens
- **Role-Based Access Control**: User and Admin roles with different permissions
- **Profile Management**: View and update user profiles
- **Session Management**: Automatic token validation and refresh

### 🛡️ Protected Routes
- **Authentication Middleware**: JWT token verification
- **Role-Based Authorization**: Route protection based on user roles
- **API Security**: Protected endpoints with proper error handling

### 🎨 Modern UI
- **Responsive Design**: Works on desktop and mobile devices
- **Modern Interface**: Clean, professional design with animations
- **Real-time Notifications**: User feedback for all actions
- **Password Visibility Toggle**: Enhanced user experience

## Project Structure

```
├── server.js                 # Main server file
├── package.json             # Dependencies and scripts
├── README.md               # This file
├── backend/
│   ├── models/
│   │   └── User.js         # User model with password hashing
│   ├── middleware/
│   │   └── auth.js         # JWT authentication middleware
│   └── routes/
│       ├── auth.js         # Authentication routes
│       └── users.js        # User management routes
└── frontend/
    ├── index.html          # Main HTML file
    ├── styles.css          # CSS styles
    └── script.js           # Frontend JavaScript
```

## Installation

1. **Clone or download the project files**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /profile` - Get current user profile
- `POST /logout` - Logout user

### User Management Routes (`/api/users`)
- `GET /` - Get all users (admin only)
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user profile
- `DELETE /:id` - Delete user (admin only)
- `GET /stats/overview` - Get user statistics (admin only)

### Protected Routes
- `GET /api/protected` - Test protected route

## Usage

### Registration
1. Click "Register" in the navigation
2. Enter your email and password
3. Select your role (User or Admin)
4. Click "Register"

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Login
1. Click "Login" in the navigation
2. Enter your email and password
3. Click "Login"

### User Profile
- View your account information
- Test protected routes
- See your login history

### Admin Dashboard (Admin users only)
- View user statistics
- Manage all users
- Delete user accounts
- Monitor system activity

## Security Features Explained

### Password Security
- **Hashing**: Passwords are hashed using bcryptjs with 12 salt rounds
- **Validation**: Strong password requirements enforced
- **Storage**: Passwords are never stored in plain text

### JWT Token Security
- **Expiration**: Tokens expire after 24 hours
- **Verification**: All protected routes verify token validity
- **Storage**: Tokens stored securely in localStorage

### Input Validation
- **Email Validation**: Proper email format validation
- **Password Validation**: Strong password requirements
- **Role Validation**: Valid role selection enforcement

### Rate Limiting
- **API Protection**: 100 requests per 15 minutes per IP
- **Brute Force Protection**: Prevents automated attacks

## Development

### Adding New Features
1. **Backend**: Add routes in `backend/routes/`
2. **Frontend**: Add UI components in `frontend/`
3. **Middleware**: Add authentication logic in `backend/middleware/`

### Database Integration
Currently uses in-memory storage. To integrate with a database:
1. Replace the User model with database queries
2. Update the authentication middleware
3. Add database connection configuration

### Production Deployment
1. Change `JWT_SECRET` to a strong, unique key
2. Set `NODE_ENV=production`
3. Use HTTPS in production
4. Implement proper database storage
5. Add logging and monitoring

## Technologies Used

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT implementation
- **express-validator**: Input validation
- **helmet**: Security headers
- **express-rate-limit**: Rate limiting
- **cors**: Cross-origin resource sharing

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients and animations
- **JavaScript (ES6+)**: Modern JavaScript features
- **Font Awesome**: Icons
- **Local Storage**: Client-side token storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please create an issue in the repository or contact the development team.

---

**Note**: This is a demonstration project. For production use, ensure you:
- Use a strong, unique JWT secret
- Implement proper database storage
- Add comprehensive logging
- Use HTTPS in production
- Regularly update dependencies
- Implement proper error handling
- Add comprehensive testing 