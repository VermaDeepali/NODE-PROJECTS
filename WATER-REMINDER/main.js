const { app, BrowserWindow, Tray, Menu, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');

// App Windows
let dashboardWin = null;
let popupWin = null;
let appTray = null;
let reminderTimeout = null;

// Paths
const assetsDir = path.join(__dirname, 'assets');
const settingsPath = path.join(app.getPath('userData'), 'hydration-settings.json');

// Default App State
let state = {
  consumed: 0,
  goal: 2000,
  interval: 30, // in minutes
  muteSound: false,
  lastDrinkDate: new Date().toLocaleDateString(),
  nextReminderTimestamp: 0
};

// Load saved state
function loadState() {
  try {
    if (fs.existsSync(settingsPath)) {
      const data = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      
      // Check if it's a new day; if so, reset consumed amount
      const today = new Date().toLocaleDateString();
      if (data.lastDrinkDate !== today) {
        data.consumed = 0;
        data.lastDrinkDate = today;
      }
      
      state = { ...state, ...data };
      console.log('Loaded app state:', state);
    }
  } catch (err) {
    console.error('Failed to load settings:', err);
  }
}

// Save app state
function saveState() {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(state, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}



// Create Dashboard Window
function createDashboardWindow() {
  if (dashboardWin) {
    dashboardWin.focus();
    return;
  }

  dashboardWin = new BrowserWindow({
    width: 680,
    height: 520,
    resizable: false,
    maximizable: false,
    title: 'Hydration Companion',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    // macOS native feel
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#020617'
  });

  dashboardWin.loadFile(path.join(__dirname, 'dashboard', 'index.html'));

  dashboardWin.on('closed', () => {
    dashboardWin = null;
  });
}

// Create Transparent Overlay Reminder Window
function triggerReminderPopup() {
  // If already open, do not open another
  if (popupWin) return;

  const windowWidth = 360;
  const windowHeight = 480;

  // Position at the bottom-right corner of the primary screen
  const primaryDisplay = screen.getPrimaryDisplay();
  const { x, y, width, height } = primaryDisplay.workArea;

  const posX = x + width - windowWidth - 15;
  const posY = y + height - windowHeight - 15;

  popupWin = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: posX,
    y: posY,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  popupWin.loadFile(path.join(__dirname, 'popup', 'index.html'));

  // Float on top of everything, including fullscreen apps
  popupWin.setAlwaysOnTop(true, 'screen-saver');
  popupWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  popupWin.on('closed', () => {
    popupWin = null;
  });
}

// Timer Scheduler
function scheduleReminder(minutes) {
  if (reminderTimeout) {
    clearTimeout(reminderTimeout);
  }

  const durationMs = minutes * 60 * 1000;
  state.nextReminderTimestamp = Date.now() + durationMs;
  saveState();

  console.log(`Scheduling next reminder in ${minutes} minutes (at ${new Date(state.nextReminderTimestamp).toLocaleTimeString()})`);

  reminderTimeout = setTimeout(() => {
    triggerReminderPopup();
    // Re-schedule based on the state interval
    scheduleReminder(state.interval);
  }, durationMs);
}

// Setup System Tray
function setupTray() {
  appTray = new Tray(path.join(assetsDir, 'icon_dummy.png')); // We will set text/emoji dynamically
  updateTrayTitle();

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Hydration Tracker', enabled: false },
    { type: 'separator' },
    { label: 'Open Settings Panel', click: createDashboardWindow },
    { label: 'Test Reminder Animation', click: triggerReminderPopup },
    { label: 'Reset Today\'s Count', click: resetStats },
    { type: 'separator' },
    { 
      label: 'Mute Reminder Sounds', 
      type: 'checkbox', 
      checked: state.muteSound,
      click: (item) => {
        state.muteSound = item.checked;
        saveState();
        notifyStateChange();
      }
    },
    { type: 'separator' },
    { label: 'Quit Hydration Companion', click: () => app.quit() }
  ]);

  appTray.setContextMenu(contextMenu);
  
  // Click tray icon opens settings panel
  appTray.on('click', createDashboardWindow);
}

// Update Tray Display
function updateTrayTitle() {
  if (!appTray) return;
  // Dynamic label in macOS menu bar showing hydration progress
  const progressText = `💧 ${state.consumed}/${state.goal} ml`;
  appTray.setTitle(progressText);
  appTray.setToolTip(`Hydration Companion - Today: ${state.consumed}ml / Goal: ${state.goal}ml`);
}

// Reset Stats
function resetStats() {
  state.consumed = 0;
  saveState();
  updateTrayTitle();
  notifyStateChange();
}

// Notify windows of state change
function notifyStateChange() {
  if (dashboardWin) {
    dashboardWin.webContents.send('dashboard-state', state);
  }
}

// IPC Receivers
ipcMain.on('get-audio-settings', (event) => {
  event.reply('audio-settings-response', { muteSound: state.muteSound });
});

ipcMain.on('get-dashboard-state', (event) => {
  event.reply('dashboard-state', state);
});

ipcMain.on('increment-water', (event, amount) => {
  state.consumed += amount;
  state.lastDrinkDate = new Date().toLocaleDateString();
  saveState();
  updateTrayTitle();
  notifyStateChange();
});

ipcMain.on('reset-stats', () => {
  resetStats();
});

ipcMain.on('set-interval', (event, intervalMins) => {
  state.interval = intervalMins;
  saveState();
  scheduleReminder(state.interval);
  notifyStateChange();
});

ipcMain.on('set-goal', (event, goalMl) => {
  state.goal = goalMl;
  saveState();
  updateTrayTitle();
  notifyStateChange();
});

ipcMain.on('set-sound', (event, mute) => {
  state.muteSound = mute;
  saveState();
  // Sync checkbox status in Tray
  setupTray(); 
});

ipcMain.on('snooze-reminder', (event, mins) => {
  console.log(`Snoozing reminder for ${mins} minutes`);
  scheduleReminder(mins);
});

ipcMain.on('action-complete', (event, action) => {
  if (popupWin) {
    popupWin.close();
  }
});

ipcMain.on('test-reminder', () => {
  triggerReminderPopup();
});

// App initialization
app.whenReady().then(async () => {
  // 1. Load configuration
  loadState();



  // 3. Create dummy tray icon file (macOS can display title only, but tray constructor expects an icon)
  // Let's create an empty 1x1 transparent png for the tray icon
  const dummyIconPath = path.join(assetsDir, 'icon_dummy.png');
  if (!fs.existsSync(dummyIconPath)) {
    // 1x1 transparent png base64
    const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    fs.writeFileSync(dummyIconPath, Buffer.from(base64Png, 'base64'));
  }

  // 4. Setup Tray & Windows
  setupTray();
  
  // 5. Start main timer
  scheduleReminder(state.interval);

  // 6. Open dashboard by default on first launch
  createDashboardWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createDashboardWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Keep the app running in the system tray on macOS even when dashboard is closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
