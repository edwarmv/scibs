import { app, BrowserWindow, utilityProcess } from 'electron';
import * as path from 'node:path';

const server = utilityProcess.fork(path.join(__dirname, 'main.js'), [], {
  cwd: path.join(__dirname, '../'),
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 800,
  });
  mainWindow.loadFile('client/index.html');
  mainWindow.webContents.openDevTools();
  return mainWindow;
}

function createLoading() {
  const loadingWindow = new BrowserWindow({
    height: 200,
    width: 200,
    transparent: true,
    frame: false,
  });
  loadingWindow.loadFile('loading.html');
  return loadingWindow;
}

app.whenReady().then(() => {
  const loadingWindow = createLoading();
  server.on('message', (message) => {
    if (message.type === 'SERVER_STARTED') {
      loadingWindow.close();
      createWindow();
      app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
      });
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', () => {
  server.kill();
});
