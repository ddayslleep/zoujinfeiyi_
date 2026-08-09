const baseUrl = 'https://60d2de12.r21.vip.cpolar.cn';

window.addEventListener('load',()=>{
    //照片
    const pic = document.getElementById('pic');
    const picInput = document.createElement('input');
    picInput.accept = 'image/*';
    picInput.type = 'file';
    picInput.style.display = 'none';
    document.body.appendChild(picInput);

    pic.addEventListener('click',()=>{
        picInput.click();
    });
    picInput.addEventListener('change',(e)=>{
        const file = e.target.files[0];
        if(!file){
            modal("请上传买家秀");
            return;
        };
        if(!file.type.startsWith('image/')){
            modal('请上传图片文件!');
            picInput.value = '';
            pic.src = "../img/image.png";
            return;
        }
        const url = URL.createObjectURL(file);
        pic.src = url;
    });

    //评价
    document.getElementById('upForm').addEventListener('submit',async (e)=>{
        e.preventDefault();
        const params = new URLSearchParams(location.search);
        const goodsId = params.get('goodsId');
        const content = document.getElementById('content').value.trim();
        const userId = localStorage.getItem('userId');

        if(!userId){
            modal("请先登录！");
            return;
        }
        if(!content){
            modal('请输入评价内容');
            return;
        }

        const sendData = {
            userId: Number(userId),
            postId: Number(goodsId),
            content: content
        };

        try{
            const res = await fetch(baseUrl + "/comment/add", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(sendData)
            });
        
            let result;
            try {
                result = JSON.parse(rawText);
            } catch(err){
                modal("服务器内部错误");
                return;
            }

            if(result.code === 200){
                toast('发布成功！');
                setTimeout(()=>{
                    location.href = './mine_normal.html';
                },2000);
            }
            else{
                modal(result.msg || "发布失败");
            }
        }catch(err){
            console.error(err);
            modal("网络异常，请稍后再试");
        }
    });
});