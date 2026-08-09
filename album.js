window.addEventListener('load',()=>{
    // 获取时间问候
    const clock = document.getElementById('clock');
    function getTime() {
        // 获取当前浏览器时间
        const now = new Date();
        const h = now.getHours();
        let greet = '';

        if (h >= 5 && h < 12) {
            greet = '早上好';
        } 
        else if (h >= 12 && h < 14) {
            greet = '中午好';
        } 
        else if (h >= 14 && h < 18) {
            greet = '下午好';
        } 
        else {
            greet = '晚上好';
        }

        clock.innerHTML = greet;
    }

    getTime();

    setInterval(getTime, 60000);
});