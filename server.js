import express from 'express';
import { fork } from 'child_process';

const app = express();

const PORT = parseInt(process.argv[2]) || 8080;

app.get('/info', (req, res) => {
  console.log(`port: ${PORT} -> Fyh: ${Date.now()}}`);
  res.send(`Servidor express <span style="color:blueviolet;">Nginx</span> en ${PORT} - <b>PID ${process.pid}</b> - ${new Date().toLocaleString()}`);
});

app.get('/randoms', function(req, res) {
  const cant = req.query.cant ?? 100000000;
  const forked = fork('./generarNums.js', [cant]);
  setTimeout(() => {
    forked.send('calcular');  
  }, 1000);

  forked.on('message', result => {
    res.end(JSON.stringify(result, null, 3));
  })
});

app.listen(PORT, err => {
  if (!err) console.log(`Ya me conecte al puerto ${PORT} - PID WORKER ${process.pid}`);
});
