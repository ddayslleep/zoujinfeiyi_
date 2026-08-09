const baseUrl = "https://60d2de12.r21.vip.cpolar.cn";

window.addEventListener('load', async () => {
    const phone = localStorage.getItem('loginPhone');
    if (!phone) {
        modal("请先登录", function () {
            location.href = "./submission.html";
        });
        return;
    }

    // 获取时间问候
    const clock = document.getElementById('clock');
    function getTime() {
        // 获取当前浏览器时间
        const now = new Date();
        const h = now.getHours();
        let greet = '';

        if (h >= 5 && h < 12) {
            greet = '早上好';
        } 
        else if (h >= 12 && h < 14) {
            greet = '中午好';
        } 
        else if (h >= 14 && h < 18) {
            greet = '下午好';
        } 
        else {
            greet = '晚上好';
        }

        clock.innerHTML = greet;
    }

    getTime();

    setInterval(getTime, 60000);

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

    //标记后端数据库里的内容
    const DYNAMIC_FLAG = 'dynamic-post';

    async function loadPostList() {
        try {
            //先删除之前动态加载的帖子，避免重复更新
            document.querySelectorAll('.eassy.' + DYNAMIC_FLAG).forEach(el => el.remove());

            const res = await fetch(baseUrl + "/project/list", {
                method: "GET",
                headers: {
                    "Cache-Control": "no-cache",
                    "Pragma": "no-cache"
                }
            });

            const data = await res.json();
            const list = data.data || [];

            // 拿到容器
            const container = document.getElementById('postContainer');

            list.forEach(item => {
            const div = document.createElement('div');
            div.className = 'eassy ' + DYNAMIC_FLAG; // 标记是动态加载的

            div.innerHTML = `
                <div class="infor">
                    <img src="${item.avatarFile || '../img/微信图片_20260707222152_1024_1.png'}">
                    <div class="myName">
                        <span>醒时方知秋月白</span>
                        <div class="infor_detail">
                            <span class="time">${timeAgo(item.timeText)}</span>
                            <span>*</span>
                            <span>西安</span>
                            <span>*</span>
                            <span>附近</span>
                        </div>
                    </div>
                </div>
                <p class="essay_">${item.content}</p>
                <div class="pic">
                    <img src="${item.img || '../img/image.png'}" class="pic_img">
                </div>
                <div class="interaction">
                    <div class="like">
                        <span class="iconfont icon-aixin"></span>
                        <span>300</span>
                    </div>
                    <div class="comment">
                        <span class="iconfont icon-pinglun"></span>
                        <span>40</span>
                    </div>
                    <div class="collection">
                        <span class="iconfont icon-xingxing"></span>
                        <span>${item.collectNum || 0}</span>
                    </div>
                    <span class="share iconfont icon-zhuanfa"></span>
                </div>
            `;

            div.addEventListener('click', () => {
                window.open(`./post_detail.html?id=${item.projectId}`, '_blank');
            });

            //从容器顶部插入
            container.prepend(div);
            });
        } catch (err) {
            console.error("帖子加载失败", err);
            }
    }

    // 首次加载
    loadPostList();

    // 刷新动态，不重复刷帖子
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            loadPostList();
        }
    });
});