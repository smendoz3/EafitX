var express = require('express');
var app = express();
var http = require('http').Server(app).listen(8000);
var path = require('path');
var os = require('os');
var fs = require('fs');
var Busboy = require('busboy');

app.post('/',function(req,res){
    var cont =0;
    var busboy = new Busboy({ headers: req.headers });
	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      cont +=1;
	    console.log(mimetype);
	    var fileType = mimetype.split("/");
	    if(fileType[0] === "video" && cont==1){
          console.log("Entre!!!");
          var fechaEnMiliseg = Date.now();
		      var saveTo = path.join("./Uploads/", path.basename(fechaEnMiliseg+"."+fileType[1]));//aca se coloca el directorio pero no se como
          console.log(cont);
          file.pipe(fs.createWriteStream(saveTo));


	    }else if(fileType[0] === "image" && cont ==2){

        console.log("Entre x2!!!");
        var fechaEnMiliseg = Date.now();
        var saveTo = path.join("./PreviewVideos/", path.basename(fechaEnMiliseg+"."+fileType[1]));//aca se coloca el directorio pero no se como
        console.log(cont);
        file.pipe(fs.createWriteStream(saveTo));

      }else{
		      console.log("Tipo de archivo invalido");
          res.writeHead(200, { 'Connection': 'close' });
          var hola = "Hola";
          fs.readFile("./prueba.html",function(err,html) {
            var eje = String(html);
            var error = err;
            res.end(eje);
          });


	    }
	});
  busboy.on('finish', function() {
    res.writeHead(200, { 'Connection': 'close' });
    fs.readFile("./index.html",function(err,html) {
      var eje = String(html);
      var error = err;
      res.end(eje);
    });
  });

  return req.pipe(busboy);
});

app.get('/upload',function(req,res){
	res.sendFile(__dirname+"/prueba.html");
});

app.get('/video',function(req,res) {
  const path = 'Uploads/001.mp4'
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)

  }


});

app.get('/',function(req,res){
	res.sendFile(__dirname+"/index.html");
});
