// Import Supabase client from CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Your Supabase URL and anon key
const SUPABASE_URL = 'https://szolqkxphqzhxbzzxarn.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6b2xxa3hwaHF6aHhienp4YXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNjA5MTUsImV4cCI6MjA2NTgzNjkxNX0.9d1kxdyXQRDeWddzTFFrdX064OngMnpmILHHrqMdksk'

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Get references to elements
const form = document.getElementById('signup-form')
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const messageDiv = document.getElementById('message')

// Email validation regex function
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email.toLowerCase())
}

// Show message helper
function showMessage(text, type) {
  messageDiv.textContent = text
  messageDiv.className = type // style with .error or .success in CSS
}

// Form submit handler
form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const email = emailInput.value.trim()
  const password = passwordInput.value.trim()

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

  // Call Supabase signUp
  const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: 'https://ziaadkn.github.io/mellow/welcome.html'
  }
  })
  if (error) {
    // Supabase error messages can be verbose, customize if you want
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
