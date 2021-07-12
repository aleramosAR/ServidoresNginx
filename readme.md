# Servidores Nginx

**Arrancar dos instancias del servidor en el que venimos trabajando utilizando PM2 modo fork (sin -i max).**<br />

**Las dos instancias estarán: una en el puerto 8081 modo fork (parámetro línea de comandos en FORK: cluster interno deshabilitado) y la otra en 8082 modo cluster (parámetro línea de comandos en CLUSTER: cluster interno habilitado). Ambas estarán en modo watch.**<br />

Arranco las 2 sesiones, una en fork y la otra en cluster.<br />
```npm run fork``` -> Corre el código ```pm2 start server.js --name='server1' --watch -- 8081```<br />
```npm run cluster``` -> Corre el código ```pm2 start server.js --name='server2' --watch -i max -- 8082```
<hr />

**Configurar un servidor Nginx para que las rutas entrantes /info y /randoms por el puerto 80 de Nginx se deriven a esas dos instancias, recibiendo la del modo cluster cuatro veces más de tráfico que la instancia en modo fork.**<br />

Inclui en la carpeta el archivo **nginx.conf** para poder chequearlo.
La configuración de *http* que puse en **nginx.conf** es esta:<br />
(Incluyo solo lo que modifique):

```
http {
  upstream node_app {
    server      127.0.0.1:8081;
    server      127.0.0.1:8082 weight=4;
  }

  server {
    listen      80;
    server_name nginx_node;
    root        ../NginxNode/public;

    location / {
      root      html;
      index     index.html index.htm;
    }

    location ~ ^/(info|randoms) {
      proxy_pass  http://node_app;
    }
  }
}

```

<hr />

**Verificar en la ruta de info, el puerto y el pid de atención y el correcto funcionamiento del balanceador de carga implementado en Nginx. Comprobar que la ruta randoms funcione adecuadamente.**<br />

Direccione las 2 rutas (info y randoms) a ```http://node_app```.

**/info** muestra el PID y puerto, haciendo refresh se ve como aparece la secuencia 1 vez 8081, 4 veces 8082.

**/randoms** genera los randoms que levanta de **generarNums.js**
