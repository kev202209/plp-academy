
const body = document.body;
const appContainer = document.getElementById('app-container');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const confirmPasswordError = document.getElementById('confirm-password-error');
const registrationForm = document.getElementById('registration-form');
const submissionMessage = document.getElementById('submission-message');

// Dark Mode Toggle
darkModeToggle.addEventListener('change', () => {
    body.classList.toggle('dark-mode');
    appContainer.classList.toggle('dark-mode');
    document.querySelectorAll('label').forEach(label => label.classList.toggle('dark-mode'));
    document.querySelectorAll('.form-control').forEach(input => input.classList.toggle('dark-mode'));
});

// --- Event Handling and Form Validation ---
function validateForm(event) {
    event.preventDefault();
    let isValid = true;

    // Name Validation (Required)
    if (nameInput.value.trim() === '') {
        nameError.textContent = 'Name is required';
        nameError.classList.add('visible');
        isValid = false;
    } else {
        nameError.textContent = '';
        nameError.classList.remove('visible');
    }

    // Email Validation
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (emailInput.value.trim() !== '' && !emailRegex.test(emailInput.value.trim())) {
        emailError.textContent = 'Invalid email format';
        emailError.classList.add('visible');
        isValid = false;
    } else {
        emailError.textContent = '';
        emailError.classList.remove('visible');
    }

    // Password Validation (Minimum 8 characters)
    if (passwordInput.value.length < 8) {
        passwordError.textContent = 'Password must be at least 8 characters';
        passwordError.classList.add('visible');
        isValid = false;
    } else {
        passwordError.textContent = '';
        passwordError.classList.remove('visible');
    }

        // Confirm Password
    if (confirmPasswordInput.value !== passwordInput.value) {
        confirmPasswordError.textContent = 'Passwords do not match';
        confirmPasswordError.classList.add('visible');
        isValid = false;
    } else {
        confirmPasswordError.textContent = '';
        confirmPasswordError.classList.remove('visible');
    }

    if (isValid) {
        submissionMessage.classList.add('show');
        registrationForm.reset();
        setTimeout(() => {
            submissionMessage.classList.remove('show');
        }, 3000);
    }
}

registrationForm.addEventListener('submit', validateForm);

// Real-time Validation Feedback
nameInput.addEventListener('input', () => {
    nameError.textContent = nameInput.value.trim() === '' ? 'Name is required' : '';
    nameError.classList.toggle('visible', nameInput.value.trim() === '');
});

emailInput.addEventListener('input', () => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    emailError.textContent = (emailInput.value.trim() !== '' && !emailRegex.test(emailInput.value.trim())) ? 'Invalid email format' : '';
    emailError.classList.toggle('visible', (emailInput.value.trim() !== '' && !emailRegex.test(emailInput.value.trim())));
});

passwordInput.addEventListener('input', () => {
    passwordError.textContent = passwordInput.value.length < 8 ? 'Password must be at least 8 characters' : '';
    passwordError.classList.toggle('visible', passwordInput.value.length < 8);
});

confirmPasswordInput.addEventListener('input', () => {
    confirmPasswordError.textContent = confirmPasswordInput.value !== passwordInput.value ? 'Passwords do not match' : '';
    confirmPasswordError.classList.toggle('visible', confirmPasswordInput.value !== passwordInput.value);
});
