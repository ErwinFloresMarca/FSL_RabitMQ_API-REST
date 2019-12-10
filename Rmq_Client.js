var amqp= require('amqplib/callback_api');

function generateUuid() {
    return Math.random().toString()+Math.random().toString()+Math.random().toString();
}
var QUEUE;
var CorID;
var MyQueue;
var requests=[];
var channel=undefined;
var onReseivedMsn=function(msg){
  for(let i=0;i<requests.length;i++){
    if(msg.RequestID==requests[i].RequestID){
      let req=requests[i];
      requests.splice(i,1);
      req.cbRequest(msg);
      break;
    }
  }
};
var Client_Rest_api={
  connect:function(conf){
    QUEUE=conf.queue;
    let config={
      protocol: 'amqp',
      hostname: conf.hostname,
      port: conf.port,
      username: conf.username,
      password: conf.password,
      locale: 'en_US',
      frameMax: 0,
      heartbeat: 0,
      vhost: '/',
    };
    amqp.connect(config,function(err,connection){
      if(err)
        throw err;
      connection.createChannel(function(err1,chnl){
        if(err1)
          throw err1;
        channel=chnl;
        chnl.assertQueue('', {
          exclusive: true
        }, function(error2, q) {
            if (error2) {
              throw error2;
            }
            var correlationId = generateUuid();
            CorID=correlationId;
            MyQueue=q;
            chnl.consume(q.queue, function(msg) {
              if (msg.properties.correlationId == correlationId) {
                onReseivedMsn(JSON.parse(msg.content.toString()));
              }
            }, {
              noAck: true
            });
          });
      });
    });
  },
  
  post:function(route,data,cbreq){
    let req={
      RequestID :Math.random().toString().split('.')[1],
      method:'post',
      route:route,
      body:data,
    };
    channel.sendToQueue(QUEUE,
    Buffer.from(JSON.stringify(req)),{ 
      correlationId: CorID, 
      replyTo: MyQueue.queue });
    req.cbRequest=cbreq;
    requests.push(req);
  },
  get:function(route,data,cbreq){
    let req={
      RequestID :Math.random().toString().split('.')[1],
      method:'get',
      route:route,
      body:data,
    };
    channel.sendToQueue(QUEUE,
    Buffer.from(JSON.stringify(req)),{ 
      correlationId: CorID, 
      replyTo: MyQueue.queue });
    req.cbRequest=cbreq;
    requests.push(req);
  },
  put:function(route,data,cbreq){
    let req={
      RequestID :Math.random().toString().split('.')[1],
      method:'put',
      route:route,
      body:data,
    };
    channel.sendToQueue(QUEUE,
    Buffer.from(JSON.stringify(req)),{ 
      correlationId: CorID, 
      replyTo: MyQueue.queue });
    req.cbRequest=cbreq;
    requests.push(req);
  },
  patch:function(route,data,cbreq){
    let req={
      RequestID :Math.random().toString().split('.')[1],
      method:'patch',
      route:route,
      body:data,
    };
    channel.sendToQueue(QUEUE,
    Buffer.from(JSON.stringify(req)),{ 
      correlationId: CorID, 
      replyTo: MyQueue.queue });
    req.cbRequest=cbreq;
    requests.push(req);
  },
  delete:function(route,data,cbreq){
    let req={
      RequestID :Math.random().toString().split('.')[1],
      method:'delete',
      route:route,
      body:data,
    };
    channel.sendToQueue(QUEUE,
    Buffer.from(JSON.stringify(req)),{ 
      correlationId: CorID, 
      replyTo: MyQueue.queue });
    req.cbRequest=cbreq;
    requests.push(req);
  }
};

module.exports=Client_Rest_api;
