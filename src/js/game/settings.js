let defaultSetting = {
    showGrid: true,
    showGridCoords: true,
    GridCoords: 'numeric', // alphaNumeric, numeric

    scale: 20,
    timeStep: 10, // ms
    timeSpeed: 1,

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
