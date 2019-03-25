var express = require('express');
var app = express();

var AipSpeechClient = require("baidu-aip-sdk").speech;

// 设置APPID/AK/SK
var APP_ID = "15147521";
var API_KEY = "NXQYhBSGYb6xve8m3FmwOrkU";
var SECRET_KEY = "Zio57yIahYxXLMPmV7FSkG4ahfe0zbXg";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY);

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');
var path = require('path');

app.post('/process_post', multipartMiddleware, function (req, res) {

    var source = fs.createReadStream(req.files.audioData.path);

    streamToBuffer(source).then(buff => {

        console.log(buff);
        console.log("正在识别");

        // 识别本地语音文件
        client.recognize(buff, 'wav', 16000).then(result => {
            console.log('return json: ' + JSON.stringify(result));
            console.log('在线语音识别结果: ' + result.result);

            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.end(JSON.stringify(result));
        }, function (err) {
            console.log(err);
        });

    });

    //res.end(JSON.stringify(source));
})


function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
        let buffers = [];
        stream.on('error', reject);
        stream.on('data', (data) => buffers.push(data))
        stream.on('end', () => resolve(Buffer.concat(buffers)))
    });
}





app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile( __dirname + "/public/" + "wave.html" );
 })

var server = app.listen(8081, function () {

    var port = server.address().port

    console.log("应用实例，访问地址为 http://localhost:%s", port)

})
