import { playground } from './main.js';

/* -------------------------------------------------------------------------- */
/*                               Loading screen                               */
/* -------------------------------------------------------------------------- */

const loadingScreen = document.getElementById('loading-screen');

window.addEventListener('load', () => {
    loadingScreen.classList.add('hidden');
});

/* -------------------------------------------------------------------------- */
/*                                   Hotbar                                   */
/* -------------------------------------------------------------------------- */

const hotbar = document.getElementById('hotbar');

const pauseButton = hotbar.querySelector('.pause-button');
const timeSpeedButton = hotbar.querySelector('.time-speed-button');

if (localStorage.getItem('timeSpeed') == 0) {
    pauseButton.classList.add('active');
    timeSpeedButton.classList.remove('level-2', 'level-3');
    timeSpeedButton.classList.add('level-1');
}

/* ------------------------------ Pause Button ------------------------------ */
pauseButton.addEventListener('click', () => {
    if (pauseButton.classList.contains('active')) {
        localStorage.setItem('timeSpeed', timeSpeedButton.classList.value.split(/level-/)[1]);
        window.dispatchEvent(new Event('storage'));
        pauseButton.classList.remove('active');
    }
    else {
        localStorage.setItem('timeSpeed', 0);
        window.dispatchEvent(new Event('storage'));
        pauseButton.classList.add('active');
    }
});

/* ---------------------------- Time Speed Button --------------------------- */
timeSpeedButton.addEventListener('click', () => {
    if (localStorage.getItem('timeSpeed') == 0) {
        localStorage.setItem('timeSpeed', timeSpeedButton.classList.value.split(/level-/)[1]);
        window.dispatchEvent(new Event('storage'));
        pauseButton.classList.remove('active');
    }
    if (localStorage.getItem('timeSpeed') >= 3) {
        localStorage.setItem('timeSpeed', 0);
    }
    localStorage.setItem('timeSpeed', Number(localStorage.getItem('timeSpeed'))+1);
    window.dispatchEvent(new Event('storage'));
    timeSpeedButton.classList.remove('level-1', 'level-2', 'level-3');
    timeSpeedButton.classList.add(`level-${localStorage.getItem('timeSpeed')}`);
});

// Set the time speed button to the correct level at load
if (localStorage.getItem('timeSpeed') == 0) {
    timeSpeedButton.classList.add(`level-1`);
} else {
    timeSpeedButton.classList.add(`level-${localStorage.getItem('timeSpeed')}`);
}

/* ------------------------------- Menu Button ------------------------------ */
hotbar.querySelector('.menu-button').addEventListener('click', () => {
    document.getElementById('menu').classList.add('active');
});

/* -------------------------------------------------------------------------- */
/*                                  Main menu                                 */
/* -------------------------------------------------------------------------- */

/* ------------------------------- Play Button ------------------------------ */
document.querySelector('#menu .play-button').addEventListener('click', () => {
    console.log(document.querySelectorAll('#menu > *'));
    document.getElementById('menu').classList.remove('active');
    document.querySelectorAll('#menu > *').forEach(e => e.classList.remove('active'));
});

/* ----------------------------- Settings Button ---------------------------- */
menu.querySelector('.settings-button').addEventListener('click', () => {
    if (document.querySelector('#menu .settings').classList.contains('active')) {
        document.querySelector('#menu .settings').classList.remove('active');
    }
    else {
        document.querySelector('#menu .settings').classList.add('active');
        settings.querySelector('#setting-coords').checked = localStorage.getItem('showGridCoords') == 'true';
        settings.querySelector('#setting-grid').checked = localStorage.getItem('showGrid') == 'true';
    }
});


/* -------------------------------------------------------------------------- */
/*                                Settins menu                                */
/* -------------------------------------------------------------------------- */

const settings = document.querySelector('#menu .settings');

settings.querySelector('#setting-coords').addEventListener('click', () => {
    localStorage.setItem('showGridCoords', settings.querySelector('#setting-coords').checked);
    window.dispatchEvent(new StorageEvent('storage', { key: 'showGridCoords' }));
});

settings.querySelector('#setting-grid').addEventListener('click', () => {
    localStorage.setItem('showGrid', settings.querySelector('#setting-grid').checked);
    window.dispatchEvent(new StorageEvent('storage', { key: 'showGrid' }));
});

settings.querySelector('#setting-coords-system').addEventListener('click', () => {
    localStorage.setItem('coordsSystem', settings.querySelector('#setting-coords-system').value);
    window.dispatchEvent(new StorageEvent('storage', { key: 'coordsSystem' }));
});
