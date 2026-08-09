const baseUrl = 'https://60d2de12.r21.vip.cpolar.cn';

window.addEventListener('DOMContentLoaded', () => {
    const phone = localStorage.getItem('loginPhone');

    document.getElementById('feiyi').onclick = async () => {
        try {
            const res = await fetch(baseUrl + "/newheritage/user/updateUserType", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    userType: '2',
                    phone: phone
                }),
                credentials: 'omit'
            });

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error( text);
                modal("服务器异常");
                return;
            }

            if (data.code === 200) {
                location.href = './mine_feiyi.html';
            } else {
                modal(data.msg);
            }
        } catch (err) {
            console.error(err);
            modal("网络异常，设置身份失败");
        }
    };

    document.getElementById('normal').onclick = async () => {
        try {
            const res = await fetch(baseUrl + "/newheritage/user/updateUserType", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    userType: '1',
                    phone: phone
                }),
                credentials: 'omit'
            });

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error(text);
                modal("服务器异常");
                return;
            }

            if (data.code === 200) {
                location.href = './mine_normal.html';
            } else {
                modal( data.msg);
            }
        } catch (err) {
            console.error(err);
            modal("网络异常，设置身份失败");
        }
    };
});