
# 校园同人文平台

基于 GitHub Pages + Firebase 的校园同人小说分享平台。

## 功能特性
- 📚 作品发布与阅读
- 👥 用户注册登录
- 💬 社区交流
- ⚡ 实时互动
- 🔒 管理员审核系统

## 部署步骤

### 1. 设置 Firebase
1. 创建 Firebase 项目
2. 启用 Authentication 和 Firestore Database
3. 复制配置到 `firebase-config.js`

### 2. 设置 GitHub Pages
1. 推送代码到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择主分支作为源

### 3. 配置安全规则
在 Firebase 控制台设置 Firestore 规则：
