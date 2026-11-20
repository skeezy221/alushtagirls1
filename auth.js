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

// =========================================================================
// КАТАЛОГ МИНИ-МАГАЗИНА (Титулы и Рамки аватара за очки активности)
// =========================================================================
const SHOP_CATALOG = {
    titles: [
        {
            id: 'title_newbie',
            name: 'Новичок',
            price: 10,
            desc: 'Аккуратный стартовый бейдж рядом с ником',
            style: 'background: rgba(255,255,255,0.12); color: #e0e0e0; border: 1px solid rgba(255,255,255,0.3);'
        },
        {
            id: 'title_local',
            name: 'Местный',
            price: 30,
            desc: 'Изумрудный статус жителя побережья',
            style: 'background: linear-gradient(135deg, #11998e, #2ee59d); color: #051b14; border: 1px solid #2ee59d; box-shadow: 0 0 8px rgba(46,229,157,0.5);'
        },
        {
            id: 'title_alushta',
            name: 'Душа Алушты',
            price: 60,
            desc: 'Яркий морской градиент для активных участников',
            style: 'background: linear-gradient(135deg, #0072ff, #00c6ff); color: #ffffff; border: 1px solid #66d9ff; box-shadow: 0 0 9px rgba(0,198,255,0.55);'
        },
        {
            id: 'title_vip',
            name: 'VIP',
            price: 120,
            desc: 'Золотой премиум-статус, выделяющий вас в поиске',
            style: 'background: linear-gradient(135deg, #f5b041, #d4ac0d); color: #000000; border: 1px solid #ffe082; box-shadow: 0 0 10px rgba(245,176,65,0.65);'
        },
        {
            id: 'title_legend',
            name: 'Легенда',
            price: 250,
            desc: 'Рубиновый неоновый титул для топовых участников',
            style: 'background: linear-gradient(135deg, #ff2e55, #9e0b28); color: #ffffff; border: 1px solid #ff758f; box-shadow: 0 0 12px rgba(255,46,85,0.75);'
        },
        {
            id: 'title_staff',
            name: 'Staff',
            price: 500,
            desc: 'Элитный статус команды проекта AlushtaGirls',
            style: 'background: linear-gradient(135deg, #1a1a24, #dc143c); color: #ffffff; border: 1px solid #ffffff; box-shadow: 0 0 12px rgba(220,20,60,0.85);'
        }
    ],
    frames: [
        {
            id: 'frame_ruby',
            name: 'Рубиновый неон',
            price: 25,
            desc: 'Яркая алая обводка с мягким свечением',
            cssClass: 'avatar-frame-ruby'
        },
        {
            id: 'frame_gold',
            name: 'Золотое сияние',
            price: 75,
            desc: 'Роскошная золотая рамка вокруг аватара',
            cssClass: 'avatar-frame-gold'
        },
        {
            id: 'frame_cyber',
            name: 'Киберпанк',
            price: 150,
            desc: 'Неоновый бирюзово-розовый контур',
            cssClass: 'avatar-frame-cyber'
        },
        {
            id: 'frame_flame',
            name: 'Липовый',
            price: 300,
            desc: 'Пульсирующая огненно-рубиновая аура',
            cssClass: 'avatar-frame-flame'
        }
    ]
};

(function injectShopFrameStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .avatar-frame-ruby {
            border: 3px solid #ff2e55 !important;
            box-shadow: 0 0 16px rgba(255, 46, 85, 0.85), inset 0 0 8px rgba(255, 46, 85, 0.5) !important;
        }
        .avatar-frame-gold {
            border: 3px solid #f5b041 !important;
            box-shadow: 0 0 18px rgba(245, 176, 65, 0.9), inset 0 0 8px rgba(255, 224, 130, 0.5) !important;
        }
        .avatar-frame-cyber {
            border: 3px solid #00f2fe !important;
            box-shadow: 0 0 16px rgba(0, 242, 254, 0.85), 0 0 24px rgba(255, 46, 85, 0.65) !important;
        }
        .avatar-frame-flame {
            border: 3px solid #ff4d6d !important;
            animation: flameFramePulse 1.8s infinite alternate ease-in-out !important;
        }
        @keyframes flameFramePulse {
            0% { box-shadow: 0 0 12px #dc143c, 0 0 22px #ff2e55; }
            100% { box-shadow: 0 0 22px #ff758f, 0 0 36px #f5b041; }
        }

        /* Всплывающие уведомления (Toast) */
        .site-toast-container {
            position: fixed;
            bottom: 22px;
            right: 22px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 340px;
            pointer-events: none;
        }
        .site-toast-item {
            pointer-events: auto;
            background: rgba(14, 14, 22, 0.96);
            backdrop-filter: blur(12px);
            border: 1px solid #dc143c;
            box-shadow: 0 10px 28px rgba(0, 0, 0, 0.85), 0 0 18px rgba(220, 20, 60, 0.45);
            color: #ffffff;
            padding: 13px 16px;
            border-radius: 14px;
            font-size: 13.5px;
            line-height: 1.4;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: toastSlideIn 0.28s ease;
            cursor: pointer;
        }
        @keyframes toastSlideIn {
            from { opacity: 0; transform: translateY(14px) scale(0.96); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
    `;
    document.head.appendChild(style);
})();

// Глобальная функция показа красивого всплывающего уведомления
function showSiteToast(message, href = '') {
    let container = document.getElementById('site-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'site-toast-container';
        container.className = 'site-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'site-toast-item';
    toast.innerHTML = `<span style="font-size: 18px;">♥</span><div>${message}</div>`;
    if (href) {
        toast.onclick = () => { window.location.href = href; };
    }
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        toast.style.transition = 'all 0.25s ease';
        setTimeout(() => toast.remove(), 260);
    }, 4200);
}

// Возвращает основное имя пользователя (если не заполнено — возвращает username)
function getPublicDisplayName(userData) {
    if (!userData) return 'Участник';
    const custom = (userData.displayName || '').trim();
    return custom !== '' ? custom : (userData.username || 'Участник');
}

function renderUserTitleBadge(userData, isSmall = false) {
    if (!userData || !userData.equippedTitle) return '';
    const titleObj = SHOP_CATALOG.titles.find(t => t.id === userData.equippedTitle);
    if (!titleObj) return '';
    const sizeStyle = isSmall
        ? 'font-size: 9.5px; padding: 1px 6px; border-radius: 5px; margin-left: 5px;'
        : 'font-size: 11px; padding: 2px 8px; border-radius: 6px; margin-left: 6px;';
    return `<span style="${titleObj.style} ${sizeStyle} font-weight: 800; letter-spacing: 0.4px; vertical-align: middle; display: inline-block;">${titleObj.name}</span>`;
}

function getAvatarFrameClass(userData) {
    if (!userData || !userData.equippedFrame) return '';
    const frameObj = SHOP_CATALOG.frames.find(f => f.id === userData.equippedFrame);
    return frameObj ? frameObj.cssClass : '';
}

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

async function addUserActivityPoints(username, pointsToAdd) {
    if (!username || !pointsToAdd) return;
    try {
        await db.collection('users').doc(username.trim().toLowerCase()).update({
            activityPoints: firebase.firestore.FieldValue.increment(pointsToAdd)
        });
    } catch (err) {
        console.error('Ошибка начисления очков:', err);
    }
}

function formatTimeSpent(totalMinutes) {
    const mins = Math.max(0, Math.floor(totalMinutes || 0));
    if (mins < 60) return `${mins} мин`;
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return remMins > 0 ? `${hours} ч ${remMins} мин` : `${hours} ч`;
}

(function startOnlineTimeTracker() {
    const user = getCurrentUsername();
    if (!user) return;

    let sessionMinutes = 0;
    setInterval(async () => {
        if (document.visibilityState !== 'visible') return;
        sessionMinutes++;
        try {
            const updates = {
                timeSpentMinutes: firebase.firestore.FieldValue.increment(1)
            };
            if (sessionMinutes % 5 === 0) {
                updates.activityPoints = firebase.firestore.FieldValue.increment(1);
            }
            await db.collection('users').doc(user.toLowerCase()).update(updates);
        } catch (e) {
            console.error('Ошибка обновления времени на сайте:', e);
        }
    }, 60000);
})();

// Фоновый слушатель входящих лайков для авторизованного пользователя
(function listenIncomingLikes() {
    const me = getCurrentUsername();
    if (!me) return;
    let knownLikers = null;

    db.collection('users').doc(me.toLowerCase()).onSnapshot(async doc => {
        if (!doc.exists) return;
        const data = doc.data();
        const currentLikers = Array.isArray(data.likedByUsers) ? data.likedByUsers : [];

        if (knownLikers === null) {
            knownLikers = new Set(currentLikers);
            return;
        }

        for (const liker of currentLikers) {
            if (!knownLikers.has(liker)) {
                knownLikers.add(liker);
                const likerProfile = await fetchUserByUsername(liker);
                const senderName = likerProfile ? getPublicDisplayName(likerProfile) : liker;
                showSiteToast(
                    `<strong>${senderName}</strong> лайкнул(а) ваш профиль! Нажмите, чтобы ответить.`,
                    'profile.html'
                );
            }
        }
        knownLikers = new Set(currentLikers);
    });
})();

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
                    const mainName = getPublicDisplayName(userData);
                    const refreshedBadge = isAdminUser() ? redAdminBadge : '';
                    const titleBadge = renderUserTitleBadge(userData, true);
                    const frameClass = getAvatarFrameClass(userData);
                    const avatarHtml = userData.avatar 
                        ? `<img src="${userData.avatar}" alt="avatar" class="top-bar-avatar ${frameClass}">` 
                        : '👤';
                    userPanel.querySelector('.profile-link').innerHTML = `${avatarHtml} ${mainName}${refreshedBadge}${titleBadge}`;
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
