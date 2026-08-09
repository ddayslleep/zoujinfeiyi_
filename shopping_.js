const baseUrl = "https://60d2de12.r21.vip.cpolar.cn";

window.addEventListener("load", async function () {
  let cartList = [];
  const userId = localStorage.getItem('userId');


  async function loadCart() {
  
    try {
      const res = await fetch(`${baseUrl}/cart/list?userId=${userId}`);
      if (!res.ok) {
        throw new Error(`接口请求失败，状态码：${res.status}`);
      }
      const data = await res.json();
      cartList = data.data || [];
      const totalPrice = data.totalPrice || 54;

      const totalEl = document.getElementById("total_num");
      totalEl.innerText = `合计：￥${totalPrice.toFixed(1)}`;

      const totalDiv = document.querySelector(".total");

      cartList.forEach(item => {
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `
          <div class="pic">
            <img src="${item.img}" alt="">
          </div>
          <div class="right">
            <div class="name">${item.goodsName}</div>
            <div class="price">价格：￥${item.price}</div>
          </div>
        `;
        document.body.insertBefore(div, totalDiv);
      });

    } catch (err) {
      console.error("加载购物车失败");
    }
  }

  document.querySelector(".total a").addEventListener("click", (e) => {
    e.preventDefault();
    if (cartList.length === 0) {
      modal("购物车为空");
      return;
    }
    location.href = "./purchase.html?from=cart";
  });

  await loadCart();
});