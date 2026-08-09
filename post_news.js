const baseUrl = 'https://60d2de12.r21.vip.cpolar.cn';

window.addEventListener('load', () => {
    // 图片
    const pic = document.getElementById('pic');
    const picInput = document.createElement('input');
    picInput.type = 'file';
    picInput.accept = 'image/*';
    picInput.style.display = 'none';
    document.body.appendChild(picInput);

    pic.addEventListener('click', () => {
        picInput.click();
    });

    picInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            modal('请上传图片文件!');
            picInput.value = '';
            pic.src = "../img/image.png";
            return;
        }
        // 预览
        const url = URL.createObjectURL(file);
        pic.src = url;
    });

    // 提交资讯
    document.getElementById('upForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value.trim();
        const content = document.getElementById('content').value.trim();
        const file = picInput.files[0];
        const phone = localStorage.getItem('loginPhone') || '';

        if (!title || !content || !file) {
            modal("内容不得为空");
            return;
        }

        const data = new FormData();
        data.append('title', title);
        data.append('content', content);
        data.append('img', file);
        data.append('publishPhone', phone);


        try {
            const res = await fetch(baseUrl + "/post/publish", {
                method: "POST",
                body: data
            });

            const result = await res.json();
            if (result.code === 200) {
                toast('发布成功!');
                setTimeout(() => {
                    location.href = './mine_feiyi.html';
                }, 2000);
            } else {
                modal(result.msg || '发布失败');
            }
        } catch (err) {
            console.error(err);
            modal('网络异常，请稍后再试');
        }
    });
});