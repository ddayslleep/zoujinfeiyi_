const baseUrl = "http://60d2de12.r21.vip.cpolar.cn";

window.addEventListener('load', async () => {
    let timer = null;
    let loading = false;
    let hasCollected = false;

    const params = new URLSearchParams(location.search);
    const projectId = params.get('id');
    const userId = localStorage.getItem('userId')
    const toastBox = document.querySelector('.collect');
    const collectIcon = document.querySelector('.collection');
    const collectNumDom = document.getElementById('collectNum');
    const avatarImg = document.getElementById('avatarImg');
    const timeDom = document.getElementById('time');
    const postTitle = document.getElementById('postTitle');
    const postMainImg = document.getElementById('postMainImg');
    const postContent = document.getElementById('postContent');

    // 时间格式化
    function timeAgo(time) {
        const now = Date.now();
        let target = new Date(time).getTime();
        if (isNaN(target)) {
            target = Number(time);
        }
        if (isNaN(target)) return "未知时间";
        const diff = Math.floor((now - target) / 1000);
        if (diff < 60) return "刚刚";
        const min = Math.floor(diff / 60);
        if (min >= 1 && min < 60) return `${min}分钟前`;
        const hour = Math.floor(diff / 3600);
        if (hour >= 1 && hour < 24) return `${hour}小时前`;
        const day = Math.floor(diff / 86400);
        return `${day}天前`;
    }

    async function loadPostDetail() {
        if (!projectId) {
            console.error("没有获取到帖子ID");
            return;
        }
        try {
            const res = await fetch(`${baseUrl}/project/detail?projectId=${projectId}`);
            const data = await res.json();
            const post = data.data;

            postTitle.innerText = post.projectName;
            postMainImg.src = post.img || '../img/image.png';
            postContent.innerText = post.content;
            avatarImg.src = post.avatar || '../img/image.png';
            timeDom.innerText = timeAgo(post.createTime);
            collectNumDom.innerText = post.collectNum || 0;
            // 判断是否已收藏
            if (post.collectId) {
                hasCollected = true;
                collectIcon.classList.add('active');
            } else {
                hasCollected = false;
                collectIcon.classList.remove('active');
            }
        } catch (err) {
            console.error("加载失败", err);
        }
    }

    loadPostDetail();

    // 收藏点击事件
    collectIcon.addEventListener('click', async () => {
        if (loading) return;
        loading = true;
        try {
            let res;
            if (!hasCollected) {
                // 添加收藏
                res = await fetch(`${baseUrl}/collect/add?userId=${userId}&projectId=${projectId}`, {
                    method: "POST"
                });
            } else {
                // 取消收藏
                res = await fetch(`${baseUrl}/collect/cancel?userId=${userId}&projectId=${projectId}`, {
                    method: "POST"
                });
            }
            const responseText = await res.text();//先读取文本，防止异常返回html
            const data = JSON.parse(responseText);

            toastBox.querySelector('span').innerText = data.msg;
            toastBox.classList.add('show');

            if (data.code === 200) {
                if (!hasCollected) {
                    collectNumDom.innerText = +collectNumDom.innerText + 1;
                    hasCollected = true;
                    collectIcon.classList.add('active');
                } else {
                    collectNumDom.innerText = +collectNumDom.innerText - 1;
                    hasCollected = false;
                    collectIcon.classList.remove('active');
                }
            }
            clearTimeout(timer);
            timer = setTimeout(() => toastBox.classList.remove('show'), 2000);
        } catch (err) {
            console.error("收藏请求异常：", err);
        } finally {
            loading = false;
        }
    });
});