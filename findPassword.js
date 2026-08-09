const baseUrl = "https://60d2de12.r21.vip.cpolar.cn";

window.addEventListener('load', async () => {
    const getCodeBtn = document.getElementById('getCode');
    const phoneInput = document.getElementById('phone');
    const codeInput = document.getElementById('code');
    const passwordInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirm");
    const submitBtn = document.querySelector('.submission');

    getCodeBtn.addEventListener('click',async ()=>{
        const phone = phoneInput.value.trim();
        if(!phone || !/^1[3-9]\d{9}$/.test(phone)){
            modal("请输入正确的手机号");
            return;
        }

        const btn = getCodeBtn;
        
        try {
            const params = new URLSearchParams();
            params.append("phone",phone);
            const res = await fetch(baseUrl + "/newheritage/user/getCode",{
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                credentials: "omit",
                body: params
            });
            const result = await res.json();
            if(result.code === 200){
                let seconds = 60;
                const timer = setInterval(()=>{
                    seconds--;
                    btn.innerText = seconds + '秒后重试';
                    if(seconds<=0){
                        clearInterval(timer);
                        btn.disabled = false;
                        btn.innerText = '获取验证码';
                    }
                },1000);
            }
            else {
                modal(result.msg || "获取验证码失败");
                btn.disabled = false;
                btn.innerText = "获取验证码";
            }
        }catch(err){
            modal("网络异常，请稍后再试");
            console.error(err);
            btn.disabled = false;
            btn.innerText = "获取验证码";
        }
    });

    submitBtn.addEventListener('click',async (e)=>{
        e.preventDefault(); 
        const phone = phoneInput.value.trim();
        const code = codeInput.value.trim();
        const newPwd = passwordInput.value.trim();
        const confirmPwd = confirmInput.value.trim();
        
        if(!phone||!code||!newPwd||!confirmPwd){
            modal("不能输入空信息");
            return ;
        }
        if(!/^1[3-9]\d{9}$/.test(phone)){
            modal("请输入正确格式的手机号");
            return;
        }
        if(newPwd!==confirmPwd){
            modal('两次输入的密码不一致');
            return;
        }

        try{
            const params = new URLSearchParams();
            params.append('phone', phone);
            params.append('code', code);
            params.append('newPwd', newPwd);
            params.append('confirmPwd', confirmPwd);

            const res = await fetch(baseUrl + '/newheritage/user/resetPwd',{
                method:"POST",
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params
            });

            const result = await res.json();
            if(result.code === 200){
                toast("密码重置成功！即将跳回登录页");
                setTimeout(() => {
                    location.href = './submission.html';
                }, 2000);
            }
            else {
                modal(result.msg || "重置失败");
            }
        }catch(err){
            modal("网络异常，请稍后再试");
            console.error(err);
        }
    });
});