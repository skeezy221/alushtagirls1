const firebaseConfig = {
  apiKey: "AIzaSyCCgqutrcFOHUycyFtsHgnDa01MqHj73sk",
  authDomain: "alushtagirlsbaze.firebaseapp.com",
  projectId: "alushtagirlsbaze",
  storageBucket: "alushtagirlsbaze.firebasestorage.app",
  messagingSenderId: "174038648705",
  appId: "1:174038648705:web:6775c6e4e7c14008364a80"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

function getCurrentUsername() {
    return localStorage.getItem('alushta_user');
}

async function fetchUserByUsername(username) {
    if (!username) return null;
    const doc = await db.collection('users').doc(username.toLowerCase()).get();
    return doc.exists ? doc.data() : null;
}

function logoutUser() {
    localStorage.removeItem('alushta_user');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', async () => {
    const header = document.querySelector('header');
    if (header) {
        // Превращаем логотип в кликабельную ссылку на главную страницу
        const logoDiv = header.querySelector('.site-logo');
        if (logoDiv && logoDiv.tagName !== 'A') {
            const logoLink = document.createElement('a');
            logoLink.href = 'index.html';
            logoLink.className = 'site-logo';
            logoLink.textContent = logoDiv.textContent;
            logoDiv.replaceWith(logoLink);
        }

        const userPanel = document.createElement('div');
        userPanel.className = 'user-top-bar';

        const currentUsername = getCurrentUsername();

        if (currentUsername) {
            userPanel.innerHTML = `
                <a href="profile.html" class="profile-link">👤 ${currentUsername}</a>
                <button type="button" class="logout-btn" onclick="logoutUser()">Выйти</button>
            `;
            header.appendChild(userPanel);

            try {
                const userData = await fetchUserByUsername(currentUsername);
                if (userData) {
                    const avatarHtml = userData.avatar 
                        ? `<img src="${userData.avatar}" alt="avatar" class="top-bar-avatar">` 
                        : '👤';
                    userPanel.querySelector('.profile-link').innerHTML = `${avatarHtml} ${userData.username}`;
                }
            } catch (err) {
                console.error('Ошибка загрузки профиля в шапке:', err);
            }
        } else {
            userPanel.innerHTML = `
                <a href="login.html" class="profile-link">Войти</a>
                <a href="registr.html" class="profile-link">Регистрация</a>
            `;
            header.appendChild(userPanel);
        }
    }

    // Оформляем навигацию (<nav>) в виде нумерованного списка 1) 2) 3)...
    const nav = document.querySelector('nav');
    if (nav) {
        const links = nav.querySelectorAll('a');
        links.forEach((link, index) => {
            if (!link.querySelector('.nav-num')) {
                const text = link.textContent.trim();
                link.innerHTML = `<span class="nav-num">${index + 1})</span> <span class="nav-label">${text}</span>`;
            }
        });
    }
});
