import electron from 'electron';

console.log("Arrancando electron...");

let eWindow = null;

electron.app.on('ready', ()=>{
  console.log("Evento Ready!")
  eWindow = new electron.BrowserWindow({
    width: 800,
    height: 600});

    eWindow.setMenuBarVisibility(false);

    eWindow.loadFile('C:/Users/diego/Desktop/3D Graphics/3D-Graphics/Rustic_PacMan/index.html');
});



