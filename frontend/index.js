// Modified index.js (updating your existing file)
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

    // Auth form handlers
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const loginData = {
                email: formData.get('email'),
                password: formData.get('password')
            };

            try {
                const response = await fetch('http://127.0.0.1:27017/Code/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginData)
                });

                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('userId', data.user.id);
                    localStorage.setItem('userName', data.user.fullName);
                    window.location.href = 'reports.html';
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                showMessage(error.message, 'error');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(signupForm);
            const signupData = {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                password: formData.get('password'),
                phone: formData.get('phone')
            };

            try {
                const response = await fetch('http://127.0.0.1:27017/Code/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(signupData)
                });

                const data = await response.json();
                if (response.ok) {
                    showMessage('Registration successful! Please login.', 'success');
                    showSection('#login');
                    signupForm.reset();
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                showMessage(error.message, 'error');
            }
        });
    }
});

function showMessage(message, type) {
    const messageBox = document.createElement('div');
    messageBox.className = `message ${type}`;
    messageBox.textContent = message;
    document.body.appendChild(messageBox);
    setTimeout(() => messageBox.remove(), 3000);
}

// Existing map and doctor search functionality
async function searchDoctors() {
    const locationInput = document.getElementById('locationSearch');
    const doctorsList = document.getElementById('doctorsList');

    try {
        const response = await fetch(`http://127.0.0.1:27017/Code/api/doctors/search?location=${encodeURIComponent(locationInput.value)}`);
        const doctors = await response.json();

        doctorsList.innerHTML = '';
        doctors.forEach(doctor => {
            const doctorCard = document.createElement('div');
            doctorCard.className = 'doctor-card';
            doctorCard.innerHTML = `
                <h3>${doctor.name}</h3>
                <p><strong>Specialization:</strong> ${doctor.specialization}</p>
                <p><strong>Hospital:</strong> ${doctor.hospital}</p>
                <p><strong>Location:</strong> ${doctor.location.address}</p>
                <p><strong>Contact:</strong> ${doctor.contact}</p>
            `;
            doctorsList.appendChild(doctorCard);
        });

        if (doctors.length > 0) {
            initializeMap(doctors);
        } else {
            showMessage('No doctors found in this location', 'error');
        }
    } catch (error) {
        showMessage('Error searching doctors', 'error');
    }
}
document.getElementById('reportsLink').addEventListener('click', () => {
    window.location.href = 'reports.html'; // Replace with your desired page
});
