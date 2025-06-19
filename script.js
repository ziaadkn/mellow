// Import Supabase client from CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Your Supabase URL and anon key
const SUPABASE_URL = 'https://szolqkxphqzhxbzzxarn.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Get references to elements
const form = document.getElementById('signup-form')
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const messageDiv = document.getElementById('message')
const displayNameInput = document.getElementById('displayName')
const birthdateInput = document.getElementById('birthdate')
const genderSelect = document.getElementById('gender')
const confirmPasswordInput = document.getElementById('confirmPassword')

// Email validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email.toLowerCase())
}

// Show message helper
function showMessage(text, type) {
  messageDiv.textContent = text
  messageDiv.className = type
}

// Calculate age from birthdate (YYYY-MM-DD)
function calculateAge(birthDate) {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

// Form submit handler
form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const email = emailInput.value.trim()
  const password = passwordInput.value.trim()
  const displayName = displayNameInput.value.trim()
  const birthdate = birthdateInput.value
  const gender = genderSelect.value
  const confirmPassword = confirmPasswordInput.value.trim()

  if (!displayName) {
    showMessage('Display name is required.', 'error')
    return
  }

  if (!birthdate) {
    showMessage('Birthdate is required.', 'error')
    return
  }

  const age = calculateAge(birthdate)
  if (age < 13) {
    showMessage('Sorry, you must be at least 13 years old to sign up.', 'error')
    return
  }

  if (!gender) {
    showMessage('Please select a gender.', 'error')
    return
  }

  if (password !== confirmPassword) {
    showMessage("Passwords don't match.", 'error')
    return
  }

  if (!validateEmail(email)) {
    showMessage('Please enter a valid email address.', 'error')
    emailInput.focus()
    return
  }

  if (password.length < 6) {
    showMessage('Password must be at least 6 characters.', 'error')
    passwordInput.focus()
    return
  }

  // Supabase sign up
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      display_name: displayName,
      birthdate,
      gender,
    },
    emailRedirectTo: 'https://ziaadkn.github.io/mellow/welcome.html'
  }
});

  if (error) {
    if (error.message.includes('already registered')) {
      showMessage('This email is already in use.', 'error')
    } else {
      showMessage(error.message, 'error')
    }
  } else {
    showMessage("Thanks for signing up! Please check your email's inbox (or spam) to confirm.", 'success')
    emailInput.value = ''
    passwordInput.value = ''
  }
})
