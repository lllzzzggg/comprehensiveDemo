// 引用依赖
var express = require('express');
var request = require('request');

var app = express();

/**
 * 发起get请求
 * @param {String} url 请求路径 
 */
let doGet = function(url){
    return new Promise((resolve, reject) =>{
        request(url, function (error, response, body) {
            resolve(body)
        })
    })
}

//跳板配置
let config = {
    port: 3000,
    porxyUrl: `https://www.imooc.com`
}
//请求拦截
app.all('/*', function(req, response, next){
    let originalUrl = req.originalUrl
    console.log(config.porxyUrl + originalUrl)
    doGet(config.porxyUrl + originalUrl).then(res=>{
        response.send(res)
    })
})

app.listen(config.port);
console.log(`跳板机开始监听 => 127.0.0.1:${config.port}`)