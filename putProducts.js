const baseUrl = "https://60d2de12.r21.vip.cpolar.cn";

window.addEventListener('load', () => {
    const phone = localStorage.getItem('loginPhone');
    //图片上传
    const pic = document.getElementById('pic');
    const picInput = document.createElement('input');
    picInput.type = 'file';
    picInput.accept = 'image/*';
    picInput.style.display = 'none';
    document.body.appendChild(picInput);
    if (pic) {
        pic.addEventListener('click', () => {
            picInput.click();
        });
    }

    // 预览图片
    picInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            modal('请上传图片文件!');
            if (pic) pic.src = "../img/image.png";
            return;
        }
        const url = URL.createObjectURL(file);
        if (pic) pic.src = url;
    });

    const form = document.getElementById('putForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const intro = document.getElementById('introduction').value.trim();
        const price = document.getElementById('price').value.trim();
        const file = picInput.files[0];
        const phone = localStorage.getItem('loginPhone') || '';

        if (!name || !intro || !price || !file) {
            modal("内容不能为空");
            return;
        }

        if (isNaN(price) || parseFloat(price) <= 0) {
            modal("请输入正确的价格");
            return;
        }

        // 提交数据
        const formData = new FormData();
        formData.append("goodsName", name);
        formData.append("introduce", intro);
        formData.append("price", price);
        formData.append("img", file);
        formData.append("sellerPhone", phone);

        try {
            const res = await fetch(baseUrl + "/goods/add", {
                method: "POST",
                body: formData,
                credentials: 'omit'
            });

            const data = await res.json();
            if (data.code === 200) {
                toast('上架成功！');
                const localGoods = {
                    goodsId: data.data?.goodsId,
                    goodsName: name,
                    price: price,
                    img: URL.createObjectURL(file)
                };
                localStorage.setItem("lastGoods", JSON.stringify(localGoods));
                setTimeout(() => {
                    location.href = './mine_feiyi.html';
                }, 2000);
            } else {
                modal(data.msg || "上架失败，请稍后重试");
            }
        } catch (err) {
            console.error(err);
            modal("网络异常，请稍后重试");
        }
    });
});