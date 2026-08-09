const baseUrl = 'https://60d2de12.r21.vip.cpolar.cn';

window.addEventListener('load',function(){
    const clock = document.getElementById('clock');
    const swiper = document.querySelector('.swiper');
    const ul = swiper.querySelector('ul');
    const liList = swiper.querySelectorAll('ul>li');
    const dots = document.querySelectorAll('.dots li')

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

    let index = 0;
    const count = liList.length;
    let width = swiper.offsetWidth;
    let start = 0;

    function move() {
        ul.style.transform = `translateX(${-index * width}px)`;
        dots.forEach((dot,i)=>{
            dot.classList.toggle('active',i===index);
        });
    }
    dots.forEach((dot,i)=>{
        dot.addEventListener('click',()=>{
            index = i;
            move();
        });
    });
    window.addEventListener('resize',()=>{
        width = swiper.offsetWidth;
        move();
    });

    swiper.addEventListener('touchstart',(e)=>{
        start = e.touches[0].clientX;
    });
    swiper.addEventListener('touchend',(e)=>{
        let end = e.changedTouches[0].clientX;
        let diff = start - end;

        if(Math.abs(diff)>50){
            if(diff>0){
                index = (index+1)%count;
            }
            else {
                index = (index-1+count)%count;
            }
            move();
        }
    })

    let timer = setInterval(()=>{
        index = (index + 1) % count;
        move();
    },3000);
    swiper.addEventListener('mouseenter',()=>{
        clearInterval(timer);
    });
    swiper.addEventListener('mouseleave',()=>{
        timer = setInterval(() => {
            index = (index + 1) % count;
            move();
        },3000);
    });

    const indexSearchBtn = document.querySelector('.search button');
    const indexInput = document.querySelector('.search input');

    indexSearchBtn.addEventListener('click', () => {
        const kw = indexInput.value.trim();
        if(kw){
            location.href = `./search.html?kw=${encodeURIComponent(kw)}`;
        }else{
            location.href = './search.html';
        }
    });
    indexInput.addEventListener('keydown',(e)=>{
        if(e.key === 'Enter'){
            const kw = indexInput.value.trim();
            if(kw){
                location.href = `./search.html?kw=${encodeURIComponent(kw)}`;
            }else{
                location.href = './search.html';
            }
        }
    });
});