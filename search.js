const baseUrl = 'https://60d2de12.r21.vip.cpolar.cn';
const HISTORY_KEY = "search_history";
const MAX_HISTORY = 6;

window.addEventListener('load', function () {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const suggestBox = document.getElementById('suggestBox');
    const historyWrap = document.getElementById('historyWrap');
    const resultWrap = document.getElementById('resultWrap');
    const resultTitle = document.getElementById('resultTitle');
    const userId = localStorage.getItem('userId');
    let timer = null;

    searchInput.addEventListener('input', function () {
        const keyword = this.value.trim();
        clearTimeout(timer);
        if (!keyword) {
            suggestBox.style.display = 'none';
            return;
        }
        timer = setTimeout(() => getSuggest(keyword), 350);
    });

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestBox.contains(e.target)) {
            suggestBox.style.display = 'none';
        }
    });

    searchBtn.addEventListener('click', () => {
        const keyword = searchInput.value.trim();
        doSearch(keyword);
    });
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            doSearch(searchInput.value.trim());
        }
    });

    async function loadSearchHistoryFromApi() {
        try {
            const res = await fetch(`${baseUrl}/search/history`, {
                credentials: 'omit'
            });
            const data = await res.json();
            const list = data.data || [];

            const showList = list.slice(-MAX_HISTORY);

            historyWrap.innerHTML = '';
            showList.forEach(item => {
                const word = item.keyword || item;
                const a = document.createElement('a');
                a.innerText = word;
                a.href = "javascript:;";
                a.addEventListener('click', () => {
                    searchInput.value = word;
                    doSearch(word);
                });
                historyWrap.appendChild(a);
            });
        } catch (err) {
            console.log(err);
        }
    }

    async function getSuggest(keyword) {
        try {
            const res = await fetch(`${baseUrl}/search/suggest?keyword=${encodeURIComponent(keyword)}`, {
                credentials: 'omit'
            });
            const data = await res.json();
            const list = data.data || [];
            if (list.length === 0) {
                suggestBox.style.display = 'none';
                return;
            }
            suggestBox.innerHTML = '';
            list.forEach(item => {
                const div = document.createElement('div');
                div.className = 'suggest-item';
                div.innerText = item.title;
                div.addEventListener('click', () => {
                    searchInput.value = item.title;
                    suggestBox.style.display = 'none';
                    doSearch(item.title);
                });
                suggestBox.appendChild(div);
            });
            suggestBox.style.display = 'block';
        } catch (err) {
            suggestBox.style.display = 'none';
        }
    }

    async function doSearch(keyword) {
        if (!keyword) {
            modal("请输入搜索关键词");
            return;
        }

        try {
            await fetch(baseUrl + '/search/history', {
                method: 'POST',
                credentials: 'omit',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    userId:userId,
                    keyword: keyword })
            });
        } catch (err) { }

        suggestBox.style.display = 'none';

        try {
            const res = await fetch(`${baseUrl}/search/result?keyword=${encodeURIComponent(keyword)}`, {
                credentials: 'omit'
            });
            const data = await res.json();
            const list = data.data || [];
            resultWrap.innerHTML = '';
            if (list.length === 0) {
                resultWrap.innerHTML = `<a href="#">暂无匹配相关资讯</a>`;
            } else {
                list.forEach(item => {
                    const a = document.createElement('a');
                    a.href = `./news.html?postId=${item.postId}`;
                    a.innerText = item.title;
                    resultWrap.appendChild(a);
                });
            }
            resultTitle.style.display = 'block';

            loadSearchHistoryFromApi();
        } catch (err) {
            modal('搜索失败，请稍后重试');
        }
    }
});