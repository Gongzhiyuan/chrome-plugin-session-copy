
const button = document.getElementById('submit')
const input = document.getElementById('localUrl')

async function getWindowsAllTab() {
    let queryOptions = {};
    let tabs = await chrome.tabs.query(queryOptions);
    return tabs;
}

async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [currentTab] = await chrome.tabs.query(queryOptions);
    return currentTab;
}


button.onclick = async function () {
    if (!input.value) {
        alert('输入目标url')
        return
    }
    const allWindowsTab = await getWindowsAllTab()
    const targetUrl = allWindowsTab.find(item => item.url.indexOf(input.value) !== -1)
    if (!targetUrl) {
        alert('请确定已打开目标Url标签页')
        return
    }
    chrome.scripting.executeScript({
        target: { tabId: targetUrl.id },
        files: ['js/getSession.js']
    }, async ([{ result }]) => {
        const currentTab = await getCurrentTab()
        chrome.scripting.executeScript({
            args: [result],
            target: { tabId: currentTab.id },
            func: setSession
        })
    })
}

async function setSession(session) {
    const { curCookies, curLocalStorage, curSessionStorage } = session
    const curCookiesList = curCookies.split(';')
    const curLocalStorageList = JSON.parse(curLocalStorage)
    const curSessionStorageList = JSON.parse(curSessionStorage)
    // 清空所有cookie和storage
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
    localStorage.clear()
    sessionStorage.clear()


    // 重新赋值
    curCookiesList.forEach(cookieItem => {
        document.cookie = cookieItem
    });

    Object.keys(curLocalStorageList).forEach(key => {
        localStorage.setItem(key, curLocalStorageList[key])
    });
    Object.keys(curSessionStorageList).forEach(key => {
        sessionStorage.setItem(key, curSessionStorageList[key])
    });

    location.reload()
}


