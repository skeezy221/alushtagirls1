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

// Автоматически устанавливаем иконку вкладки (favicon) с логотипом skeezy
(function setSiteFavicon() {
    const svgFavicon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <defs>
                <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#181822"/>
                    <stop offset="100%" stop-color="#09090d"/>
                </linearGradient>
                <linearGradient id="rubyStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff2e55"/>
                    <stop offset="100%" stop-color="#9e0b28"/>
                </linearGradient>
            </defs>
            <rect width="64" height="64" rx="16" fill="url(#bgGrad)"/>
            <rect x="2.5" y="2.5" width="59" height="59" rx="13.5" fill="none" stroke="url(#rubyStroke)" stroke-width="3"/>
            <text x="32" y="36" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-weight="900" font-size="14.5" letter-spacing="0.5">skeezy</text>
            <line x1="16" y1="43" x2="48" y2="43" stroke="#dc143c" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
    `.trim();
    const encoded = 'data:image/svg+xml,' + encodeURIComponent(svgFavicon);

    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.type = 'image/svg+xml';
    link.href = encoded;
})();

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

    // Оформляем навигацию (<nav>): меняем «Сугубое мнение» на «Поддержка», убираем target="_blank" и ставим нумерацию
    const nav = document.querySelector('nav');
    if (nav) {
        const links = nav.querySelectorAll('a');
        links.forEach((link, index) => {
            link.removeAttribute('target');
            let text = link.textContent.trim();
            if (text.toLowerCase().includes('сугубое мнение') || link.getAttribute('href') === 'contacts.html') {
                text = 'Поддержка';
            }
            if (!link.querySelector('.nav-num')) {
                link.innerHTML = `<span class="nav-num">${index + 1})</span> <span class="nav-label">${text}</span>`;
            }
        });
    }
});
