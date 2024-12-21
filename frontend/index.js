// // Navigation and Section Management
// document.addEventListener('DOMContentLoaded', function() {
//     // Handle navigation
//     const sections = document.querySelectorAll('.section');
//     const navLinks = document.querySelectorAll('.nav-links a');
//     const authLinks = document.querySelectorAll('.auth-links a');

//     function showSection(sectionId) {
//         sections.forEach(section => {
//             section.classList.add('hidden');
//         });
//         const targetSection = document.querySelector(sectionId);
//         if (targetSection) {
//             targetSection.classList.remove('hidden');
//         }
//     }

//     // Show home section by default
//     showSection('#home');

//     // Navigation click handlers
//     navLinks.forEach(link => {
//         link.addEventListener('click', (e) => {
//             e.preventDefault();
//             const targetId = link.getAttribute('href');
//             showSection(targetId);
            
//             // Update active nav link
//             navLinks.forEach(navLink => navLink.classList.remove('active'));
//             link.classList.add('active');
//         });
//     });

//     // Auth link click handlers
//     if (authLinks) {
//         authLinks.forEach(link => {
//             link.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 const targetId = link.getAttribute('href');
//                 showSection(targetId);
//             });
//         });
//     }

//     // Form handling
//     const loginForm = document.getElementById('loginForm');
//     const signupForm = document.getElementById('signupForm');

//     if (loginForm) {
//         loginForm.addEventListener('submit', handleLogin);
//     }

//     if (signupForm) {
//         signupForm.addEventListener('submit', handleSignup);
//     }

//     // Logout functionality
//     const logoutBtn = document.getElementById('logoutBtn');
//     if (logoutBtn) {
//         logoutBtn.addEventListener('click', () => {
//             const accountInfo = document.getElementById('accountInfo');
//             if (accountInfo) {
//                 accountInfo.style.display = 'none';
//             }
//             showMessage('Logged out successfully!', 'success');
//             showSection('#home');
//         });
//     }
// });

// // Form Handlers
// async function handleLogin(e) {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const loginData = {
//         email: formData.get('email'),
//         password: formData.get('password')
//     };

//     try {
//         const response = await fetch('http://localhost:5000/api/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(loginData)
//         });

//         if (response.ok) {
//             const data = await response.json();
//             const userName = document.getElementById('userName');
//             const accountInfo = document.getElementById('accountInfo');
            
//             if (userName) {
//                 userName.textContent = data.user.fullName;
//             }
//             if (accountInfo) {
//                 accountInfo.style.display = 'block';
//             }
            
//             showMessage('Login successful!', 'success');
//             showSection('#home');
            
//             // Store token in localStorage
//             localStorage.setItem('token', data.token);
//         } else {
//             const error = await response.json();
//             throw new Error(error.message || 'Login failed');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         showMessage(error.message, 'error');
//     }
// }

// async function handleSignup(e) {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const signupData = {
//         fullName: formData.get('fullName'),
//         email: formData.get('email'),
//         password: formData.get('password'),
//         phone: formData.get('phone')
//     };

//     try {
//         const response = await fetch('http://localhost:5000/api/signup', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(signupData)
//         });

//         if (response.ok) {
//             showMessage('Account created successfully! Please sign in.', 'success');
//             showSection('#login');
//         } else {
//             const error = await response.json();
//             throw new Error(error.message || 'Signup failed');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         showMessage(error.message, 'error');
//     }
// }

// // Utility function to show messages
// function showMessage(message, type) {
//     const messageBox = document.createElement('div');
//     messageBox.className = `message ${type}`;
//     messageBox.textContent = message;
//     document.body.appendChild(messageBox);
//     setTimeout(() => {
//         messageBox.remove();
//     }, 3000);
// }



// Navigation and Section Management
document.addEventListener('DOMContentLoaded', function() {
    // Handle navigation
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const authLinks = document.querySelectorAll('.auth-links a');

    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.add('hidden');
        });
        const targetSection = document.querySelector(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }

        // Update active nav link if it exists
        const correspondingNavLink = document.querySelector(`.nav-links a[href="${sectionId}"]`);
        if (correspondingNavLink) {
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            correspondingNavLink.classList.add('active');
        }
    }

    // Show home section by default
    showSection('#home');

    // Navigation click handlers
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            showSection(targetId);
        });
    });

    // Auth link click handlers
    if (authLinks) {
        authLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                showSection(targetId);
            });
        });
    }

    // Form handling
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const signupButton = document.getElementById('signupButton');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    if (signupButton) {
        signupButton.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('#login');
        });
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token'); // Clear the token
            const accountInfo = document.getElementById('accountInfo');
            if (accountInfo) {
                accountInfo.style.display = 'none';
            }
            showMessage('Logged out successfully!', 'success');
            showSection('#home');
        });
    }
});

// Form Handlers
async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            const data = await response.json();
            const userName = document.getElementById('userName');
            const accountInfo = document.getElementById('accountInfo');
            
            if (userName) {
                userName.textContent = data.user.fullName;
            }
            if (accountInfo) {
                accountInfo.style.display = 'block';
            }
            
            // Store token in localStorage
            localStorage.setItem('token', data.token);
            
            showMessage('Login successful!', 'success');
            
            // Redirect to Reports page after successful login
            setTimeout(() => {
                showSection('#reports');
            }, 1000); // Small delay to show the success message
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage(error.message, 'error');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const signupData = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        password: formData.get('password'),
        phone: formData.get('phone')
    };

    try {
        const response = await fetch('http://localhost:5000/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupData)
        });

        if (response.ok) {
            showMessage('Account created successfully! Please sign in.', 'success');
            // Reset the signup form
            e.target.reset();
            // Redirect to login page after successful signup
            setTimeout(() => {
                showSection('#login');
            }, 1000); // Small delay to show the success message
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Signup failed');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage(error.message, 'error');
    }
}

// Utility function to show messages
function showMessage(message, type) {
    const messageBox = document.createElement('div');
    messageBox.className = `message ${type}`;
    messageBox.textContent = message;
    document.body.appendChild(messageBox);
    setTimeout(() => {
        messageBox.remove();
    }, 3000);
}