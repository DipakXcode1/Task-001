// Global variables
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// API base URL
const API_BASE = '/api';

// DOM elements
const sections = {
    welcome: document.getElementById('welcomeSection'),
    login: document.getElementById('loginSection'),
    register: document.getElementById('registerSection'),
    profile: document.getElementById('profileSection'),
    admin: document.getElementById('adminSection')
};

const navLinks = {
    home: document.getElementById('homeLink'),
    login: document.getElementById('loginLink'),
    register: document.getElementById('registerLink'),
    profile: document.getElementById('profileLink'),
    admin: document.getElementById('adminLink'),
    logout: document.getElementById('logoutLink')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
});

// Initialize the application
function initializeApp() {
    // Check if user is already logged in
    if (authToken) {
        fetchUserProfile();
    } else {
        showSection('welcome');
        updateNavigation(false);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    navLinks.home.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('welcome');
    });

    navLinks.login.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('login');
    });

    navLinks.register.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('register');
    });

    navLinks.profile.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('profile');
        loadUserProfile();
    });

    navLinks.admin.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('admin');
        loadAdminDashboard();
    });

    navLinks.logout.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });

    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);

    // Form switches
    document.getElementById('switchToRegister').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('register');
    });

    document.getElementById('switchToLogin').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('login');
    });
}

// Show specific section
function showSection(sectionName) {
    // Hide all sections
    Object.values(sections).forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    if (sections[sectionName]) {
        sections[sectionName].classList.add('active');
    }
}

// Update navigation based on auth status
function updateNavigation(isAuthenticated) {
    if (isAuthenticated) {
        navLinks.home.style.display = 'inline';
        navLinks.login.style.display = 'none';
        navLinks.register.style.display = 'none';
        navLinks.profile.style.display = 'inline';
        navLinks.logout.style.display = 'inline';
        
        // Show admin link only for admin users
        if (currentUser && currentUser.role === 'admin') {
            navLinks.admin.style.display = 'inline';
        } else {
            navLinks.admin.style.display = 'none';
        }
    } else {
        navLinks.home.style.display = 'inline';
        navLinks.login.style.display = 'inline';
        navLinks.register.style.display = 'inline';
        navLinks.profile.style.display = 'none';
        navLinks.admin.style.display = 'none';
        navLinks.logout.style.display = 'none';
    }
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store token and user data
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            
            showNotification('Login successful!', 'success');
            updateNavigation(true);
            showSection('profile');
            loadUserProfile();
        } else {
            showNotification(data.error || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Network error. Please try again.', 'error');
    }
}

// Handle register form submission
async function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('role');

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, role })
        });

        const data = await response.json();

        if (response.ok) {
            // Store token and user data
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            
            showNotification('Registration successful!', 'success');
            updateNavigation(true);
            showSection('profile');
            loadUserProfile();
        } else {
            if (data.details) {
                const errorMessage = data.details.map(detail => detail.msg).join(', ');
                showNotification(errorMessage, 'error');
            } else {
                showNotification(data.error || 'Registration failed', 'error');
            }
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Network error. Please try again.', 'error');
    }
}

// Fetch user profile
async function fetchUserProfile() {
    try {
        const response = await fetch(`${API_BASE}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            updateNavigation(true);
            showSection('profile');
            loadUserProfile();
        } else {
            // Token is invalid, clear it
            localStorage.removeItem('authToken');
            authToken = null;
            currentUser = null;
            updateNavigation(false);
            showSection('welcome');
        }
    } catch (error) {
        console.error('Profile fetch error:', error);
        showNotification('Failed to fetch profile', 'error');
    }
}

// Load user profile data
function loadUserProfile() {
    if (!currentUser) return;

    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profileRole').textContent = currentUser.role;
    document.getElementById('profileCreated').textContent = new Date(currentUser.createdAt).toLocaleDateString();
    document.getElementById('profileLastLogin').textContent = currentUser.lastLogin 
        ? new Date(currentUser.lastLogin).toLocaleDateString()
        : 'Never';
}

// Load admin dashboard
async function loadAdminDashboard() {
    if (!currentUser || currentUser.role !== 'admin') {
        showNotification('Access denied. Admin privileges required.', 'error');
        return;
    }

    try {
        // Fetch user statistics
        const statsResponse = await fetch(`${API_BASE}/users/stats/overview`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            displayUserStats(statsData.stats);
        }

        // Fetch user list
        const usersResponse = await fetch(`${API_BASE}/users`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            displayUserList(usersData.users);
        }
    } catch (error) {
        console.error('Admin dashboard error:', error);
        showNotification('Failed to load admin dashboard', 'error');
    }
}

// Display user statistics
function displayUserStats(stats) {
    const statsContainer = document.getElementById('userStats');
    statsContainer.innerHTML = `
        <div class="stat-item">
            <strong>Total Users:</strong> ${stats.totalUsers}
        </div>
        <div class="stat-item">
            <strong>Active Users:</strong> ${stats.activeUsers}
        </div>
        <div class="stat-item">
            <strong>Recent Registrations (7 days):</strong> ${stats.recentRegistrations}
        </div>
        <div class="stat-item">
            <strong>User Roles:</strong>
            <ul>
                ${Object.entries(stats.userRoles).map(([role, count]) => 
                    `<li>${role}: ${count}</li>`
                ).join('')}
            </ul>
        </div>
    `;
}

// Display user list
function displayUserList(users) {
    const userListContainer = document.getElementById('userList');
    userListContainer.innerHTML = users.map(user => `
        <div class="user-item">
            <div class="user-info">
                <div class="user-email">${user.email}</div>
                <div class="user-role">${user.role}</div>
            </div>
            <div class="user-actions">
                <button class="btn btn-small btn-secondary" onclick="editUser('${user.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-small btn-danger" onclick="deleteUser('${user.id}')" 
                        ${user.id === currentUser.id ? 'disabled' : ''}>
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Test protected route
async function testProtectedRoute() {
    try {
        const response = await fetch(`${API_BASE}/protected`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            showNotification(`Protected route accessed successfully! User: ${data.user.email}`, 'success');
        } else {
            const errorData = await response.json();
            showNotification(errorData.error || 'Access denied', 'error');
        }
    } catch (error) {
        console.error('Protected route error:', error);
        showNotification('Network error', 'error');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    authToken = null;
    currentUser = null;
    updateNavigation(false);
    showSection('welcome');
    showNotification('Logged out successfully', 'info');
}

// Check authentication status
function checkAuthStatus() {
    if (authToken) {
        fetchUserProfile();
    }
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.toggle-password i');
    
    if (input.type === 'password') {
        input.type = 'text';
        button.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        button.className = 'fas fa-eye';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' :
                 type === 'error' ? 'fas fa-exclamation-circle' :
                 'fas fa-info-circle';
    
    notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Edit user (placeholder function)
function editUser(userId) {
    showNotification('Edit user functionality would be implemented here', 'info');
}

// Delete user
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            showNotification('User deleted successfully', 'success');
            loadAdminDashboard(); // Refresh the dashboard
        } else {
            const errorData = await response.json();
            showNotification(errorData.error || 'Failed to delete user', 'error');
        }
    } catch (error) {
        console.error('Delete user error:', error);
        showNotification('Network error', 'error');
    }
} 