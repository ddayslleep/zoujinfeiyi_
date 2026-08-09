const baseUrl = 'https://60d2de12.r21.vip.cpolar.cn';

window.addEventListener('load', async () => {
    const phone = localStorage.getItem('loginPhone');
    if (!phone) {
        modal("请先登录", function () {
            location.href = "./submission.html";
        });
        return;
    }

    // 图片预览
    const pic = document.getElementById('pic');
    const picInput = document.createElement('input');
    picInput.type = 'file';
    picInput.accept = 'image/*';
    picInput.style.display = 'none';
    document.body.appendChild(picInput);

    pic.onclick = () => picInput.click();
    picInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) pic.src = URL.createObjectURL(file);
    }

    document.getElementById('upForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value.trim();
        const content = document.getElementById('content').value.trim();
        const file = picInput.files[0];

        if (!title) return modal("请输入标题");
        if (!content) return modal("请输入介绍");

        try {
            const res = await fetch(baseUrl + "/project/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    projectName: title,
                    introduce:'',//后端有此请求参数
                    content: content
                })
            });

            const data = await res.json();
            if (data.code === 200) {
                toast("发布成功");
                setTimeout(() => {
                    location.href = './mine_normal.html';
                }, 2000);
            } else {
                modal(data.msg || "发布失败");
            }
        } catch (err) {
            console.error(err);
            modal("网络异常");
        }
    });
});