// 社区功能实现
let postsListener = null;

function showNewPostModal() {
    if (!currentUser) {
        alert('请先登录后再发帖');
        window.location.href = 'login.html';
        return;
    }
    const modal = new bootstrap.Modal(document.getElementById('newPostModal'));
    modal.show();
}

async function submitPost() {
    if (!currentUser) return;
    
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const tags = document.getElementById('postTags').value.split(',').map(tag => tag.trim());
    
    try {
        await db.collection('posts').add({
            title: title,
            content: content,
            tags: tags,
            author: currentUser.email,
            authorId: currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            likes: 0,
            comments: []
        });
        
        // 清空表单
        document.getElementById('newPostForm').reset();
        bootstrap.Modal.getInstance(document.getElementById('newPostModal')).hide();
        alert('帖子发布成功！');
    } catch (error) {
        console.error('发布帖子失败:', error);
        alert('发布失败，请重试');
    }
}

// 加载帖子列表
function loadPosts() {
    const postsContainer = document.getElementById('postsContainer');
    
    if (postsListener) postsListener(); // 移除旧的监听器
    
    postsListener = db.collection('posts')
        .orderBy('createdAt', 'desc')
        .onSnapshot((snapshot) => {
            postsContainer.innerHTML = '';
            
            if (snapshot.empty) {
                postsContainer.innerHTML = '<p class="text-muted">暂无帖子，快来发布第一个吧！</p>';
                return;
            }
            
            snapshot.forEach(doc => {
                const post = doc.data();
                const postElement = createPostElement(doc.id, post);
                postsContainer.appendChild(postElement);
            });
        }, (error) => {
            console.error('加载帖子失败:', error);
            postsContainer.innerHTML = '<p class="text-danger">加载失败，请刷新页面</p>';
        });
}

function createPostElement(postId, post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-item border-bottom pb-3 mb-3';
    
    const timeAgo = post.createdAt ? formatTimeAgo(post.createdAt.toDate()) : '刚刚';
    
    postDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-start mb-2">
            <h5><a href="post-detail.html?id=${postId}" class="text-decoration-none">${post.title}</a></h5>
            <small class="text-muted">${timeAgo}</small>
        </div>
        <p class="text-muted">${post.content.substring(0, 100)}...</p>
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <span class="badge bg-primary me-1">${post.author}</span>
                ${post.tags.map(tag => `<span class="badge bg-secondary me-1">${tag}</span>`).join('')}
            </div>
            <div>
                <button class="btn btn-sm btn-outline-primary" onclick="likePost('${postId}')">
                    👍 ${post.likes || 0}
                </button>
                <button class="btn btn-sm btn-outline-secondary" onclick="showComments('${postId}')">
                    💬 ${post.comments ? post.comments.length : 0}
                </button>
            </div>
        </div>
    `;
    
    return postDiv;
}

function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return '刚刚';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
    return `${Math.floor(diffInSeconds / 86400)}天前`;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
});
