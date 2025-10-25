// 替换为你的Firebase配置
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// 初始化Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// 初始化用户状态
let currentUser = null;

auth.onAuthStateChanged((user) => {
    currentUser = user;
    updateUI();
});

function updateUI() {
    const loginLink = document.getElementById('loginLink');
    if (loginLink) {
        if (currentUser) {
            loginLink.innerHTML = `欢迎，${currentUser.email} | <a href="#" onclick="logout()">退出</a>`;
            
            // 如果是管理员，显示管理链接
            if (currentUser.email === 'admin@example.com') {
                const adminLink = document.createElement('a');
                adminLink.className = 'nav-link';
                adminLink.href = 'admin.html';
                adminLink.textContent = '管理后台';
                loginLink.parentNode.insertBefore(adminLink, loginLink);
            }
        } else {
            loginLink.innerHTML = '<a class="nav-link" href="login.html">登录</a>';
        }
    }
}

async function logout() {
    try {
        await auth.signOut();
        window.location.href = 'index.html';
    } catch (error) {
        console.error('退出登录失败:', error);
    }
}
