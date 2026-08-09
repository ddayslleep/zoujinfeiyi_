const baseUrl = 'https://60d2de12.r21.vip.cpolar.cn';

window.addEventListener('load', async () => {
    const phone = localStorage.getItem('loginPhone');
    // 时间问候
    const clock = document.getElementById('clock');
    const userId = localStorage.getItem('userId');

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

    // 加载商品列表
   async function loadGoods() {
    const manage = document.querySelector('.manage');
    const goodsTitle = document.getElementById('sell');
    if (!manage || !goodsTitle) {
        console.log("找不到非遗商品");
        return;
    }

    // 清除上一次动态生成的商品
    document.querySelectorAll('.manage > .item[data-dynamic]').forEach(el => el.remove());

    try {
        const res = await fetch(baseUrl + "/goods/list", {
            method: "GET",
            credentials: 'omit'
        });
        const data = await res.json();
        const list = data.data || [];

        list.forEach(item => {
            const div = document.createElement('div');
            div.className = 'item';
            div.setAttribute('data-dynamic', '1'); //标记动态生成
            div.innerHTML = `
                <div class="pic">
                    <img src="${item.img || '../img/image.png'}">
                </div>
                <div class="right">
                    <a href="./details.html?goodsId=${item.goodsId}" class="name">${item.goodsName || '暂无商品名称'}</a>
                    <div class="price">
                        <p class="number">价格：￥${item.price}</p>
                    </div>
                </div>
            `;
            goodsTitle.after(div); 
        });
    } catch (err) {
        console.error('加载非遗商品失败：', err);
    }
}

    // 订单列表
    async function loadMyOrders() {
        if (!phone) return;
        const manage = document.querySelector('.manage');
        const titles = manage.querySelectorAll('.title');
        let orderTitle = null;
        for (let t of titles) {
            if (t.textContent.trim() === '待收货') {
                orderTitle = t;
                break;
            }
        }
        if (!orderTitle) return;

        try {
            const res = await fetch(`${baseUrl}/order/userList?userId=${userId}`, {
            credentials: 'omit'
            });

        const data = await res.json();
        const list = data.data || [];

        let next = orderTitle.nextElementSibling;
        while (next && !next.classList.contains('title')) {
        const toRemove = next;
        next = next.nextElementSibling;
        // toRemove.remove();
    }

    list.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
            <div class="pic">
                <img src="${item.img}">
            </div>
            <div class="right">
                <p class="name">${item.name}</p>
                <p class="status_">${item.status === 0 ? '待发货' : item.status === 1 ? '运输中……' : '已完成'}</p>
            </div>
            <div class="btn-groups">
                <p class="confirm" data-id="${item.goodsId}" data-status="${item.status}">
                    ${item.status >= 1 ? (item.status >= 2 ? '已收货' : '确认收货') : '未发货'}
                </p>
                <a href="./comment.html?goodsId=${item.goodsId}">商品反馈</a>
            </div>
        `;
        const nextTitle = orderTitle.nextElementSibling;
        if (nextTitle && nextTitle.classList.contains('title')) {
            manage.insertBefore(div, nextTitle);
        } else {
            manage.appendChild(div);
        }
    });
} catch (e) {
    console.error(e);
}
    }

    // 确认收货
    const container = document.querySelector('.manage');
    container.addEventListener('click', async function (e) {
        const btn = e.target.closest('.confirm');
        if (!btn) return;
        if (!phone) {
            modal("请先登录");
            return;
        }

        const orderId = btn.dataset.id;
        const status = parseInt(btn.dataset.status);
        const statusText = btn.closest('.item').querySelector('.status_');

        if (status === 0) {
            modal('待发货');
            return;
        }
        if (status >= 2) {
            modal('已收货');
            return;
        }

        try {
            const res = await fetch(baseUrl + '/order/buyer/receive', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ goodsId: orderId })
            });

            const data = await res.json();
            if (data.code !== 200) return;

            const detailRes = await fetch(`${baseUrl}/order/detail?goodsId=${orderId}`, {
                credentials: 'omit'
            });

            const detailData = await detailRes.json();
            const realStatus = detailData.data?.status;

            if (realStatus >= 2) {
                btn.innerText = '已收货';
                statusText.innerText = '已完成';
                loadMyOrders();
            }
        } catch (err) {
            console.error(err);
        }
    });

    // 购物车预览
    async function loadCartPreview() {
        if (!phone) return;
        const manage = document.querySelector('.manage');
        const titles = manage.querySelectorAll('.title');
        let cartTitle = null;
        for (let t of titles) {
            if (t.textContent.trim() === '购物车') {
            cartTitle = t;
            break;
            }
        }
        if (!cartTitle) return;

    try {
    const res = await fetch(`${baseUrl}/cart/list?userId=${userId}`, {
      credentials: 'omit'
    });
    const data = await res.json();
    const list = data.data || [];

    if (list.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'item';
      emptyDiv.innerHTML = `<p>购物车为空</p>`;
      cartTitle.after(emptyDiv);
      return;
    }

    const item = list[0];
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <div class="pic">
        <img src="${item.img || '../img/image.png'}">
      </div>
      <div class="right">
        <p class="name">${item.goodsName || item.name}</p>
        <div class="price">
          <p class="number">价格：￥${item.price}</p>
        </div>
      </div>
    `;

    cartTitle.after(div);

  } catch (err) {
    console.error(err);
  }
}

    // 收藏
    async function loadMyCollect() {
    const wrap = document.querySelector('.collect .wrap');
    if (!wrap) return;
    const userId = localStorage.getItem('userId');

    try {
        const res = await fetch(baseUrl + "/collect/my?userId=" + userId, {
            method: "GET",
            credentials: 'omit'
        });
        const data = await res.json();
        let collectList = data.data || [];

        if (collectList.length === 0) return;
        collectList = collectList.slice(-3);
        collectList.forEach(item => {
            const div = document.createElement('div');
            div.className = 'collect_detail';
            div.innerHTML = `
                <div class="infor">
                    <img src="${item.avatarFile || '../img/image.png'}" alt="">
                    <div class="myName">
                        <span>醒时方知秋月白</span>
                        <div class="infor_detail">
                            <span class="time">${timeAgo(item.time)}</span>
                            <span>*</span>
                            <span>西安</span>
                            <span>*</span>
                            <span>附近</span>
                        </div>
                    </div>
                </div>
                <p class="essay_">${item.title?.slice(0, 60) || ''}…</p>
                <div class="pic">
                    <img src="${item.img || '../img/image.png'}" class="pic_img" alt="">
                </div>
            `;
            div.addEventListener('click', () => {
                window.open(`./post_detail.html?projectId=${item.projectId}`, '_blank');
            });
            wrap.appendChild(div);
        });
    } catch (err) {
        console.error('加载收藏失败：', err);
    }
}

    // 初始化
    loadGoods();
    loadMyOrders();
    loadCartPreview();
    loadMyCollect();
});