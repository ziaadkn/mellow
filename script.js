// Import Supabase client from CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Your Supabase URL and anon key
const SUPABASE_URL = 'https://szolqkxphqzhxbzzxarn.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6b2xxa3hwaHF6aHhienp4YXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNjA5MTUsImV4cCI6MjA2NTgzNjkxNX0.9d1kxdyXQRDeWddzTFFrdX064OngMnpmILHHrqMdksk'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Get form elements
const form = document.getElementById('signup-form')
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const confirmPasswordInput = document.getElementById('confirmPassword')
const displayNameInput = document.getElementById('displayName')
const birthdateInput = document.getElementById('birthdate')
const genderSelect = document.getElementById('gender')
const messageDiv = document.getElementById('message')

// Show message helper
function showMessage(text, type) {
  messageDiv.textContent = text
  messageDiv.className = ''
  void messageDiv.offsetWidth
  messageDiv.classList.add(type)
  return false
}

// Email validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email.toLowerCase())
}

// Age calculation
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

// Form submission
form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const email = emailInput.value.trim()
  const password = passwordInput.value.trim()
  const confirmPassword = confirmPasswordInput.value.trim()
  const displayName = displayNameInput.value.trim()
  const birthdate = birthdateInput.value
  const gender = genderSelect.value

  if (!displayName) return showMessage('Display name is required.', 'error')
  if (!birthdate) return showMessage('Birthdate is required.', 'error')
  if (calculateAge(birthdate) < 13) return showMessage('You must be at least 13 years old.', 'error')
  if (!gender) return showMessage('Please select a gender.', 'error')
  if (password !== confirmPassword) return showMessage("Passwords don't match.", 'error')
  if (!validateEmail(email)) return showMessage('Enter a valid email address.', 'error')
  if (password.length < 6) return showMessage('Password must be at least 6 characters.', 'error')

  console.log('✅ All validations passed.')

  // Attempt sign-up
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
        birthdate,
        gender,
      },
      emailRedirectTo: 'https://ziaadkn.github.io/mellow/welcome.html',
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return showMessage('This email is already in use.', 'error')
    } else {
      return showMessage(error.message, 'error')
    }
  }

  showMessage("Thanks for signing up! Check your email to confirm.", 'success')
  emailInput.value = ''
  passwordInput.value = ''
  confirmPasswordInput.value = ''
  displayNameInput.value = ''
  birthdateInput.value = ''
  genderSelect.value = ''
})
