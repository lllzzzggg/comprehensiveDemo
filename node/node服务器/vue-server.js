/**
 * vue项目history模式使用的node临时服务器
 * 用来验证dist打包后的文件使用
 * 将所有的404都转发到了index.html
 *
 * 运行环境 node.js  版本不限 越新越好
 * 此文件与 vue项目的index.html同级
 * 命令行切换到文件目录  执行node vue-server.js
 */
(function() {

'use strict';

const
  http  = require('http'),
  url   = require('url'),
  path  = require('path'),
  fs    = require('fs'),
  port  = parseInt(process.argv[2] || 8888, 10),
  mime  = {
    '.html' : ['text/html', 86400],
    '.htm'  : ['text/html', 86400],
    '.css'  : ['text/css', 86400],
    '.js'   : ['application/javascript', 86400],
    '.json' : ['application/json', 86400],
    '.jpg'  : ['image/jpeg', 0],
    '.jpeg' : ['image/jpeg', 0],
    '.png'  : ['image/png', 0],
    '.gif'  : ['image/gif', 0],
    '.ico'  : ['image/x-icon', 0],
    '.svg'  : ['image/svg+xml', 0],
    '.txt'  : ['text/plain', 86400],
    'err'   : ['text/plain', 30]
  };

// new server
http.createServer(function(req, res) {
  let
    uri = url.parse(req.url).pathname,
    filename = path.join(process.cwd(), uri);

  // file available?
  fs.access(filename, fs.constants.R_OK, (err) => {
    // not found
    if (err) {
        if(filename.indexOf(".") > -1){
            serve(404, "404");
        }else{
            let filsename = `${__dirname}/index.html`
            fs.readFile(filsename, (err, file) => {
                serve(200, file, path.extname(filename));
            })
        }
      return;
    }

    // index.html default
    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    // read file
    fs.readFile(filename, (err, file) => {

      if (err) {
        // error reading
        serve(500, err + '\n');
      }
      else {
        // return file
        serve(200, file, path.extname(filename));
      }

    });
  });

  // serve content
  function serve(code, content, type) {

    let head = mime[type] || mime['err'];

    res.writeHead(code, {
      'Content-Type'    : head[0],
      'Cache-Control'   : 'must-revalidate, max-age=' + (head[1] || 2419200),
      'Content-Length'  : Buffer.byteLength(content)
    });
    res.write(content);
    res.end();

  }

}).listen(port);

console.log('监听端口： http://localhost:' + port);

}());
