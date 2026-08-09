const baseUrl = "https://60d2de12.r21.vip.cpolar.cn";

window.addEventListener('load', async () => {
    const params = new URLSearchParams(location.search);
    const goodsId = params.get('goodsId');
    const userId = localStorage.getItem('userId');
    const phone = localStorage.getItem('loginPhone');
    const goodsImg = document.getElementById('goodsImg');
    const goodName = document.getElementById('goodName');
    const priceDom = document.getElementById('number');
    const commentWrap = document.getElementById('more');
    const buyBtn = document.getElementById('purchase');
    const cartBtn = document.getElementById('shopping');

    async function loadProductInfo() {
        try {
            const res = await fetch(`${baseUrl}/goods/detail?goodsId=${goodsId}`, {
                method: "GET",
                credentials: 'omit'
            });
            const data = await res.json();
            const product = data.data;
            goodsImg.src = product.img;
            goodName.innerText = product.goodsName;
            priceDom.innerText = `价格：￥${product.price}`;
        } catch (err) {
            console.error("商品信息加载失败", err);
        }
    }

    loadProductInfo();

    async function loadCommentList() {
        try {
            const params = new URLSearchParams({
                goodsId: goodsId,
                pageNum: 1,
                pageSize: 5
            })
            const res = await fetch(`${baseUrl}/comment/page?${params.toString()}`, {
             method: "GET",
                credentials: 'omit'
            });
             const data = await res.json();
            const list = data.pageInfo?.data || [];

            list.forEach(item => {
                const div = document.createElement('div');
                div.className = 'personal';
                div.innerHTML = `
                    <span class="number">${phone}:</span>
                    <span class="comment">${item.content}</span>
                `;
                commentWrap.appendChild(div);
            });
        } catch (err) {
            console.error("评论加载失败", err);
        }
    }
    loadCommentList();

    cartBtn.addEventListener('click', async (e)=>{
        e.preventDefault();
        try{
            const res = await fetch(`${baseUrl}/cart/add`,{
                method:"POST",
                headers:{
                "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    userId:userId,
                    goodsId: goodsId,
                    num: 1
            })
        });
        const data = await res.json();
        if(data.code === 200){
            toast("加入购物车成功");
            setTimeout(()=>{
                location.href = "./shopping.html";
            },1000);
        }else{
            modal("加入购物车失败");
        }
    }catch(err){
        console.error(err);
        modal("网络异常");
    }
})

    buyBtn.addEventListener('click',function(e){
        e.preventDefault();
        location.href = `./purchase.html?goodsId=${goodsId}`;
    })
});