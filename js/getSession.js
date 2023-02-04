

(function getSession() {
    return {
        curCookies: document.cookie,
        curSessionStorage: JSON.stringify(sessionStorage),
        curLocalStorage: JSON.stringify(localStorage)
    }
})()
