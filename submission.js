const baseUrl = 'https://60d2de12.r21.vip.cpolar.cn';

window.addEventListener("load", () => {
  const getCodeBtn = document.getElementById("getCode");

  getCodeBtn.addEventListener("click", async () => {
    const phone = document.getElementById("phone").value.trim();
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      modal('请输入正确格式的手机号');
      return;
    }

    getCodeBtn.disabled = true;

    try {
      const params = new URLSearchParams();
      params.append("phone", phone);

      const res = await fetch(baseUrl + "/newheritage/user/getCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        credentials: "omit",
        body: params
      });

      const result = await res.json();
      if (result.code === 200) {
        let seconds = 60;
        getCodeBtn.innerText = seconds + "秒后重试";

        const timer = setInterval(() => {
          seconds--;
          getCodeBtn.innerText = seconds + "秒后重试";
          if (seconds <= 0) {
            clearInterval(timer);
            getCodeBtn.disabled = false;
            getCodeBtn.innerText = "获取验证码";
          }
        }, 1000);
      } else {
        modal(result.msg || '获取验证码失败');
        getCodeBtn.disabled = false;
        getCodeBtn.innerText = "获取验证码";
      }
    } catch (err) {
      modal("请求失败");
      console.error(err);
      getCodeBtn.disabled = false;
      getCodeBtn.innerText = "获取验证码";
    }
  });

  document.getElementById('loginForm').addEventListener("submit", async (e) => {
    e.preventDefault();

    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById("password").value.trim();
    const code = document.getElementById("code").value.trim();

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      modal("请输入正确格式的手机号");
      return;
    }
    if (!phone || !password || !code) {
      modal("手机号、密码与验证码不能为空");
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("phone", phone);
      params.append("password", password);
      params.append("code", code);
      params.append('userType',1)

      const res = await fetch(baseUrl + "/newheritage/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params
      });

      if (!res.ok) {
        modal("服务器异常 " + res.status);
        return;
      }

      const result = await res.json();
      if (result.code === 200) {
        toast("登录成功！");
        localStorage.setItem('userId', result.data.userId);
        localStorage.setItem('loginPhone', phone);
        setTimeout(()=>{
          location.href = "./select.html";
        },2000);
      } else {
        modal(result.msg || "登录失败");
      }
    } catch (err) {
      modal("网络异常，请稍后重试");
      console.error(err);
    }
  });
});