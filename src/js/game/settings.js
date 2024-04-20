let settings = {
    showGrid: true
}

for (let key in settings) {
    if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, settings[key]);
    }
    else {
        settings[key] = (localStorage.getItem(key) == 'true');
    }
}