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
const auth = typeof firebase.auth === 'function' ? firebase.auth() : null;

// Логины и Email с полными правами администратора
const ADMIN_USERS = ['admin'];
const ADMIN_EMAILS = ['weekmaga@gmail.com'];

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

function isAdminUser() {
    const user = (getCurrentUsername() || '').trim().toLowerCase();
    const email = (localStorage.getItem('alushta_email') || '').trim().toLowerCase();
    return Boolean((user && ADMIN_USERS.includes(user)) || (email && ADMIN_EMAILS.includes(email)));
}

async function fetchUserByUsername(username) {
    if (!username) return null;
    const doc = await db.collection('users').doc(username.toLowerCase()).get();
    return doc.exists ? doc.data() : null;
}

async function logoutUser() {
    if (auth) {
        try {
            await auth.signOut();
        } catch (e) {
            console.error(e);
        }
    }
    localStorage.removeItem('alushta_user');
    localStorage.removeItem('alushta_email');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', async () => {
    const header = document.querySelector('header');
    if (header) {
        let leftCol = header.querySelector('.header-left-stack');
        if (!leftCol) {
            leftCol = document.createElement('div');
            leftCol.className = 'header-left-stack';
            header.prepend(leftCol);
        }

        const logoDiv = header.querySelector('.site-logo');
        if (logoDiv) {
            if (logoDiv.tagName !== 'A') {
                const logoLink = document.createElement('a');
                logoLink.href = 'index.html';
                logoLink.className = 'site-logo';
                logoLink.textContent = logoDiv.textContent;
                logoDiv.remove();
                leftCol.appendChild(logoLink);
            } else {
                leftCol.appendChild(logoDiv);
            }
        }

        // Выпадающее меню «Навигация»
        const oldNav = document.querySelector('nav');
        if (oldNav) {
            const links = Array.from(oldNav.querySelectorAll('a'));

            const dropdown = document.createElement('div');
            dropdown.className = 'nav-dropdown';

            const toggleBtn = document.createElement('button');
            toggleBtn.type = 'button';
            toggleBtn.className = 'nav-dropdown-btn';
            toggleBtn.innerHTML = '<span>☰ Навигация</span> <span class="nav-arrow">▾</span>';

            const menuList = document.createElement('div');
            menuList.className = 'nav-dropdown-menu';

            links.forEach((link, index) => {
                link.removeAttribute('target');
                const labelEl = link.querySelector('.nav-label');
                let text = labelEl ? labelEl.textContent.trim() : link.textContent.replace(/^\d+\)\s*/, '').trim();

                if (text.toLowerCase().includes('сугубое мнение') || link.getAttribute('href') === 'contacts.html') {
                    text = 'Поддержка';
                }

                const newLink = document.createElement('a');
                newLink.href = link.getAttribute('href');
                newLink.className = 'nav-dropdown-item';
                newLink.innerHTML = `<span class="nav-num">${index + 1})</span> <span>${text}</span>`;
                menuList.appendChild(newLink);
            });

            dropdown.appendChild(toggleBtn);
            dropdown.appendChild(menuList);
            leftCol.appendChild(dropdown);
            oldNav.remove();

            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('open');
            });

            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('open');
                }
            });
        }

        // Правая панель пользователя
        const userPanel = document.createElement('div');
        userPanel.className = 'user-top-bar';

        const currentUsername = getCurrentUsername();
        const redAdminBadge = '<span style="background: linear-gradient(135deg, #dc143c, #9e0b28); color: #ffffff; border: 1px solid #ff4d6d; box-shadow: 0 0 10px rgba(220, 20, 60, 0.7); font-size: 11px; font-weight: 800; padding: 2px 7px; border-radius: 6px; margin-left: 6px; letter-spacing: 0.5px;">ADMIN</span>';

        if (currentUsername) {
            const initialBadge = isAdminUser() ? redAdminBadge : '';

            userPanel.innerHTML = `
                <a href="profile.html" class="profile-link">👤 ${currentUsername}${initialBadge}</a>
                <button type="button" class="logout-btn" onclick="logoutUser()">Выйти</button>
            `;
            header.appendChild(userPanel);

            try {
                const userData = await fetchUserByUsername(currentUsername);
                if (userData) {
                    if (userData.email) {
                        localStorage.setItem('alushta_email', userData.email.toLowerCase());
                    }
                    const refreshedBadge = isAdminUser() ? redAdminBadge : '';
                    const avatarHtml = userData.avatar 
                        ? `<img src="${userData.avatar}" alt="avatar" class="top-bar-avatar">` 
                        : '👤';
                    userPanel.querySelector('.profile-link').innerHTML = `${avatarHtml} ${userData.username}${refreshedBadge}`;
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
});
