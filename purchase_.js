const baseUrl = "https://60d2de12.r21.vip.cpolar.cn";

window.addEventListener('load', async () => {
    const turnForm = document.getElementById('turnForm');
    if (!turnForm) return;

    const params = new URLSearchParams(location.search);
    const from = params.get('from');
    const goodsId = params.get('goodsId');
    const count = parseInt(params.get('count')) || 1;
    const userId = localStorage.getItem('userId');

    let itemList = [];
    let totalPrice = 0;

    try {
        // 直接购买
        if (from === 'buy') {
            const res = await fetch(`${baseUrl}/goods/detail?goodsId=${goodsId}`);
            const data = await res.json();
            if (data.code !== 200) throw new Error('获取商品失败');

            const goods = data.data;
            itemList = [{
                goodsId: goodsId + '',
                goodsName: goods.goodsName,
                price: goods.price,
                num: 1
            }];
            totalPrice = goods.price * count;
        }

        // 购物车下单
        else if (from === 'cart') {
            const res = await fetch(`${baseUrl}/cart/list?userId=${userId}`);
            const data = await res.json();
            if (data.code !== 200) throw new Error('获取购物车失败');

            const cartList = data.data;
            itemList = cartList.map(item => ({
                'goodsId': item.goodsId + '',
                'price': item.price,
                'num': 1
            }));
            totalPrice = cartList.reduce((sum, item) => sum + item.price, 0);
        }
    } catch (e) {
        console.error(e);
        modal('加载商品信息失败');
        return;
    }

    turnForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const way = document.getElementById('way').value.trim();
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();

        if (!way || !name || !phone || !address) {
            modal("请填写完整信息");
            return;
        }
        if (!/^1[3-9]\d{9}$/.test(phone)) {
            modal("请输入正确的手机号");
            return;
        }

        try {
            const body = {
                order: {
                    'orderNo':'OD202607290001',
                    'status':1,
                    'userId':userId,
                    'totalPrice': 200,
                    'receiverName': name,
                    'receiverPhone': phone,
                    'receiverAddress': address,
                },
                itemList: itemList
            };

            const res = await fetch(baseUrl + "/order/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            if (data.code === 200) {
                toast("下单成功");
                setTimeout(() => {
                    location.href = './mine_feiyi.html';
                }, 2000);
            } else {
                modal("下单失败");
            }
        } catch (err) {
            console.error(err);
            modal("网络异常，请稍后再试");
        }
    });
});