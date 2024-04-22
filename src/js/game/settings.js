let defaultSetting = {
    showGrid: true,
    showGridCoords: true,

    showVehicles: true,
    showRoads: true,
    showBuildings: true,
}

function initSettings() {
    for (let key in defaultSetting) {
        if (localStorage.getItem(key) === null || localStorage.getItem(key) === undefined) {
            localStorage.setItem(key, defaultSetting[key]);
        }
    }
}

export { initSettings };
