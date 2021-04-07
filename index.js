const express = require('express')
const router=require('./router/router.js')
const bodyParser = require('body-parser');
const app = express()
const port = 8898

const WebSocket = require('ws'); 
app.use(bodyParser.urlencoded({
    extended: false
}));
//CORS跨域设置
app.all('*', function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "http://localhost:1708");
    res.header('Access-Control-Allow-Origin', '*') // 使用session时不能使用*，只能对具体的ip开放。
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("X-Powered-By", ' 3.2.1')
    if (req.method == "OPTIONS") res.send(200);/*让options请求快速返回*/
    else next();
});
let ws=new WebSocket('ws://172.21.213.174:1708');
let heartBeat
ws.on('open',()=>{
    console.log("open websocket connection")
    ws.send('{ "msg":"regist","token":"connlist" }')
    if(ws.readyState==1){
        
    }
})
ws.on('close', function close() {
    console.log('disconnected');

    ws=new WebSocket('ws://172.21.213.174:1708');
    console.log('re connected')
});
setInterval(()=>{
    ws.send('{ "msg":"beat" }')
},119*1000)

ws.on('message',(data)=>{
    
    let obj
    if(data=="no authority"||data=="no data in service node!"||data=="node offline"){
        return
    }
    if(data!="success"&&data!="node offline"){
        obj=JSON.parse(data);
        if(obj.msg=='online'){
            console.log(new Date()+'connection with center server is stable')
        }
    } 
})

var wsClient = function (req, res, next) {
    req.wsClient = ws
    next()
}
app.use(wsClient)


// 获取当前在线节点token
app.get('/onlineNodes', router.onlineNodes)

app.get('/state',router.state)

// 获取对应在线节点处理服务
// 参数 token,type
// 注意将token encode
app.get('/onlineNodesAllPcs', router.onlineNodesAllPcs)


// 执行响应处理方法
// 参数 dataId,pcsId,params,name,token,reqUsrOid
// 注意将token encode
app.get('/extPcs', router.excuteProcess)

//已有数据调用相应处理方法
// 参数 token,contDtId,pcsId,节点token、数据容器数据contDtId、想要的处理方法pcsId
app.get('/invokeDistributedPcs',router.invokeDistributedPc)

// 执行处理方法
// 基于模型输出的url
// 参数 token,pcsId,url,params,服务节点token标识，处理方法标识pcsId,外部数据url,处理方法可能的参数（没有的话可不填）params
// 注意请求头：application/x-www-form-urlencoded
app.post('/invokeUrlDataPcs',router.invokeUrlDataPcs)
app.post('/invokeUrlsDataPcs',router.invokeUrlsDataPcs)
// 带key，重命名数据名字
app.post('/invokeUrlsDataPcsWithKey',bodyParser.json(),router.invokeExternalUrlsDataPcsWithKeys)

// 执行处理方法
// 基于多个url,外部数据,任意数据名称
// 参数 token,pcsId,url,params,服务节点token标识，处理方法标识pcsId,外部数据url,处理方法可能的参数（没有的话可不填）params
app.post('/invokeExternalUrlsDataPcs',bodyParser.json(),router.invokeExternalUrlsDataPcs)


// 获取数据
app.get('/fileObtain',router.distributedData)
// 获取多个url的返回值
app.get('/files',router.distributedFiles)

// 获取文件元数据
app.get('/capability',router.metaInfo)
 


app.listen(port, () => console.log(`app run on port ${port}!`))

process.on('uncaughtException', function (err) {
    console.log(new Date()+'Caught Exception:' + err);//直接捕获method()未定义函数，Node进程未被退出。  
});