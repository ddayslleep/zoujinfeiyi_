const baseUrl = 'https://60d2de12.r21.vip.cpolar.cn';

window.addEventListener('load', function () {
  const form = document.getElementById('loginForm');
  const pic = document.getElementById('pic');
  const phoneInput = document.getElementById('phone');
  const pwdInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirm');

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
    const url = URL.createObjectURL(file);
    pic.src = url;
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const phone = phoneInput.value.trim();
    const pwd = pwdInput.value.trim();
    const confirm = confirmInput.value.trim();
    const avatarFile = picInput.files[0];

    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      modal('请输入正确格式的手机号');
      phoneInput.focus();
      return;
    }
    if (pwd.length < 6) {
      modal('密码至少需要6位');
      pwdInput.focus();
      return;
    }
    if (pwd !== confirm) {
      modal('两次密码不一致');
      confirmInput.focus();
      return;
    }
    if (!avatarFile) {
      modal('请上传头像');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('phone', phone);
      formData.append('password', pwd);
      formData.append('userType', 1);
      // formData.append('avatarFile',avatarFile)

      const res = await fetch(baseUrl + "/newheritage/user/register", {
        method: 'POST',
        body: formData
      });

      let result;
      try {
        result = await res.json();
      } catch (e) {
        modal('返回错误，请稍后再试');
        return;
      }

      if (res.ok && result.code === 200) {
        toast('注册成功！');
        localStorage.setItem('loginPhone', phone);
        setTimeout(() => {
          location.href = './select.html';
        }, 2000);
      } else {
        modal('注册失败：' + (result.msg || '未知错误'));
      }

    } catch (err) {
      console.error(err);
      modal('请求异常，请稍后再试');
    }
  });
});