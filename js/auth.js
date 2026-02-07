// === AUTH FUNCTIONS ===
// This module handles all Supabase authentication logic
// and updating the user status UI.

import { supabaseClient } from './supabase.js';
import * as s from './selectors.js';
import { showNotification, openAuthModal, closeAuthModal } from './ui.js';
import { fetchData } from './data.js';

// --- Auth Functions ---

async function handleGitHubLogin() {
    const { error } = await supabaseClient.auth.signInWithOAuth({ provider: 'github' });
    if (error) {
        console.error('Error logging in with GitHub:', error);
        showNotification(`GitHub Error: ${error.message}`, 'error');
    }
}

async function handleEmailAuth(event) {
    event.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    // Try to sign in first
    const { error: signInError } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (signInError) {
        // If sign-in fails, try to sign up
        const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({ email, password });
        
        if (signUpError) {
            showNotification(`Error: ${signUpError.message}`, 'error');
        } else if (signUpData.user && signUpData.user.identities && signUpData.user.identities.length === 0) {
            showNotification("Sign-up successful! Please check your email to confirm your account.", "success");
            closeAuthModal();
        } else {
            showNotification("Login successful!", "success");
            closeAuthModal();
        }
    } else {
        // Sign-in was successful
        showNotification("Login successful!", "success");
        closeAuthModal();
    }
}

async function handleLogout() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        console.error('Error logging out:', error);
        showNotification(`Logout Error: ${error.message}`, 'error');
    }
    // Auth state change listener will handle the rest
}

export function updateUserStatus(user) {
    if (user) {
        s.userStatus.innerHTML = `
            <span>LOGGED IN: ${user.email}</span>
            <button id="logout-btn" class="btn-secondary">Logout</button>
        `;
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
             logoutBtn.removeEventListener('click', handleLogout);
             logoutBtn.addEventListener('click', handleLogout);
        }
    } else {
        s.userStatus.innerHTML = `<button id="login-btn" class="btn-primary">Login / Sign Up</button>`;
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
             loginBtn.removeEventListener('click', openAuthModal);
             loginBtn.addEventListener('click', openAuthModal);
        }
    }
}

// --- Auth State Change Listener ---

export function initializeAuthListener() {
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event);
        updateUserStatus(session?.user);
        if (session) {
            fetchData();
        } else {
            // User logged out — clear ALL state keys (FIX: was missing reconciliation_log & trips)
            const { setAppState } = await import('./state.js');
            const { renderAll } = await import('./grid.js');
            setAppState({ 
                incomes: [], expenses: [], transactions: [], accounts: [], 
                transfers: [], reconciliation_log: [], trips: [] 
            });
            renderAll();
        }
    });
}

// --- Event Listeners ---

export function addAuthEventListeners() {
    s.authModalCloseBtn.addEventListener('click', closeAuthModal);
    s.authModal.addEventListener('click', (event) => { 
        if (event.target === s.authModal) closeAuthModal(); 
    });
    s.emailAuthForm.addEventListener('submit', handleEmailAuth);
    s.githubLoginBtn.addEventListener('click', handleGitHubLogin);
}
