const baseUrl = "https://60d2de12.r21.vip.cpolar.cn";

window.addEventListener('load', async () => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('postId');
    
    try {
        const res = await fetch(`${baseUrl}/post/detail?postId=${postId}`, {
            method: "GET"
        });

        const data = await res.json();

        //渲染页面
        if (data.code === 200 && data.data) {
            const info = data.data;
            document.getElementById('newsTitle').innerText = info.title;
            document.getElementById('newsImg').src = info.img || '../img/image.png';
            document.getElementById("newsContent").innerText = info.content;
        }
    } catch (err) {
        console.error(err);
    }
});