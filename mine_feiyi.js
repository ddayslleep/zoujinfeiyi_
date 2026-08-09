const baseUrl = 'http://localhost:3000';

window.addEventListener('load', async () => {
    const clock = document.getElementById('clock');
    const userId = localStorage.getItem('userId');

    // 时间问候
    function getTime() {
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

        if (clock) clock.innerHTML = greet;
    }

    getTime();
    setInterval(getTime, 60000);

    //时间格式化
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

    /*渲染头像
    if (phone) {
        fetch(`${baseUrl}/heritage-web/heritage-web/user/info`, {
            method: "GET",
            credentials: 'omit'
        })
        .then(res => res.json())
        .then(data => {
            if (data.avatarFile) {
                document.querySelector('.self img').src = data.avatarFile;
            }
        })
        .catch(err => console.error(err));
    }*/

    // 资讯
    async function loadNews() {
    const wrapNews = document.querySelector('.wrap_news');
    if (!wrapNews) return;

    try {
        const res = await fetch(baseUrl + "/post/list", {
        method: "GET",
        credentials: 'omit'
        });
    const data = await res.json();
    let newsList = data.data || [];
    newsList = newsList.slice(0, 1);

    if (newsList.length === 0) return;

        newsList.forEach(item => {
            const newsBox = document.createElement('div');
            newsBox.className = 'news';
            newsBox.innerHTML = `
                <img src="${item.img || '../img/image.png'}" alt="资讯图片">
                <div class="infor">
                    <h2>${item.title || '无标题'}</h2>
                    <p>${item.content?.slice(0, 80) || ''}……</p>
                </div>
                <a href="./post_new.html">发布</a>
                `;
            newsBox.addEventListener('click', (e) => {
                if (e.target.closest('a')) return;
                    location.href = `./news.html?postId=${item.postId}`;
            });
            wrapNews.appendChild(newsBox);
        });
        } catch (err) {
            console.error('加载资讯失败：', err);
        }
    }

    // 商品
    async function loadMine() {
    const container = document.querySelector(".manageShopping");
    if (!container) return;

    try {
        const res = await fetch(baseUrl + '/goods/list', {
            method: "GET",
            credentials: 'omit'
        });
        const data = await res.json();
        let list = data.data || [];

        document.querySelectorAll(".manageShopping > .item").forEach(el => el.remove());

        list.forEach(item => {
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `
                <div class="pic">
                    <img src="${item.img || '../img/image.png'}" alt="">
                </div>
                <div class="right">
                    <a href="./detail.html?goodsId=${item.goodsId}" class="name">${item.goodsName || '无名称'}</a>
                    <div class="price">价格：￥${item.price || '0.00'}</div>
                </div>
                <a href="./putProductds.html">上架</a>
            `;
            container.appendChild(div);
        });

    } catch (err) {
        console.error('加载商品失败：', err);
    }
}

    // 收藏
    async function loadMyCollect() {
    const wrap = document.querySelector('.collect .wrap');
    if (!wrap) return;

    try {
        const res = await fetch(baseUrl + "/collect/my?userId=" + userId, {
            method: "GET",
            credentials: 'omit'
        });
        const data = await res.json();
        let collectList = data.data || [];
        wrap.querySelector('.collect_dynamic')?.remove();

        if (collectList.length === 0) return;
        const lastCollect = collectList.at(-1);

        const div = document.createElement('div');
        div.className = 'collect_detail collect_dynamic';
        div.innerHTML = `
            <div class="infor">
                <img src="${lastCollect.avatarFile || '../img/image.png'}" alt="">
                <div class="myName">
                    <span>醒时方知秋月白</span>
                    <div class="infor_detail">
                        <span class="time">${timeAgo(lastCollect.time)}</span>
                        <span>*</span>
                        <span>西安</span>
                        <span>*</span>
                        <span>附近</span>
                    </div>
                </div>
            </div>
            <p class="essay_">${lastCollect.title?.slice(0, 60) || ''}…</p>
            <div class="pic">
                <img src="${lastCollect.img || '../img/image.png'}" class="pic_img" alt="">
            </div>
        `;
        div.addEventListener('click', () => {
            window.open(`./post_detail.html?projectId=${lastCollect.projectId}`, '_blank');
        });
        wrap.appendChild(div);

    } catch (err) {
        console.error('加载收藏失败：', err);
    }
}

    // 订单
    async function loadSellerOrders() {
        const container = document.querySelector('.manage');
        if (!container) return;

        try {
            const res = await fetch(`${baseUrl}/order/userList?userId=${userId}`, {
                method: "GET",
                credentials: 'omit'
            });
            const data = await res.json();
            const list = data.data || [];

            if (list.length === 0) return;

            list.forEach(item => {
                const div = document.createElement('div');
                div.className = 'item';
                div.innerHTML = `
                    <div class="pic">
                        <img src="${item.img || '../img/image.png'}" alt="">
                    </div>
                    <div class="right">
                        <a href="./details.html?goodsId=${item.goodsId}" class="name">${item.goodsName || '无名称'}</a>
                        <p class="status_text">${item.status === 0 ? '待发货' : '运输中'}</p>
                    </div>
                    <p class="status ${item.status === 1 ? 'done' : ''}" data-id="${item.goodsId || item.orderId}">
                        ${item.status === 0 ? '发货' : '已发货'}
                    </p>
                `;
                container.appendChild(div);
            });

            document.querySelectorAll('.status:not(.done)').forEach(btn => {
                btn.addEventListener('click', async function () {
                    const orderId = this.dataset.id;
                    if (!orderId) return;

                    try {
                        const sendRes = await fetch(`${baseUrl}/order/send`, {
                            method: "PUT",
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ goodsId: orderId }),
                            credentials: 'omit'
                        });
                        const sendData = await sendRes.json();
                        if (sendData.code !== 200) return;

                        this.classList.add('done');
                        this.textContent = '已发货';
                        const statusText = this.closest('.item').querySelector('.status_text');
                        if (statusText) statusText.textContent = '运输中';
                    } catch (err) {
                        console.error('发货失败', err);
                    }
                });
            });
        } catch (err) {
            console.error('加载订单失败', err);
        }
    }

    await loadNews();
    await loadMine();
    await loadMyCollect();
    await loadSellerOrders();
});