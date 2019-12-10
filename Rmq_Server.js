var amqp=require('amqplib/callback_api');


var Server_REST_API={
    connect:(conf,callback)=>{
        var QUEUE=conf.queue;
        var config={
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
        amqp.connect(config,(err,connection)=>{
            if(err)
                throw err;
            connection.createChannel((err1,channel)=>{
                if(err1)
                    throw err1;
                channel.assertQueue(QUEUE,{durable: false});
                channel.prefetch(1);
                channel.consume(QUEUE, function reply(msg) {
                    console.log(msg.content.toString());
                    var DATA=JSON.parse(msg.content.toString());
                    let RESPONSE_OBJECT={
                        state:200,
                        RequestID:DATA.RequestID,
                        data:undefined
                    }
                    RESPONSE_OBJECT.status=(state)=>{
                        this.state=state;
                        return RESPONSE_OBJECT;
                    };
                    RESPONSE_OBJECT.json=(data)=>{
                        RESPONSE_OBJECT.data=data;
                        channel.sendToQueue(msg.properties.replyTo,
                            Buffer.from(JSON.stringify({
                                status:RESPONSE_OBJECT.state,
                                RequestID:RESPONSE_OBJECT.RequestID,
                                data:RESPONSE_OBJECT.data
                            })), {
                            correlationId: msg.properties.correlationId
                        });
                    };
                    let ROUTER={
                        OnFound:false,
                        post:function (route,callback_route){
                            if(DATA.method.toLowerCase()=='post'&&!this.OnFound){
                                if(route==DATA.route){
                                    this.OnFound=true;
                                    callback_route(DATA,RESPONSE_OBJECT);
                                    return;
                                }
                            }
                        },
                        get:function (route,callback_route){
                            if(DATA.method.toLowerCase()=='get'&&!this.OnFound){
                                if(route==DATA.route){
                                    OnFound=true;
                                    callback_route(DATA,RESPONSE_OBJECT);
                                    return;
                                }
                            }
                        },
                        put:function (route,callback_route){
                            if(DATA.method.toLowerCase()=='put'&&!this.OnFound){
                                if(route==DATA.route){
                                    OnFound=true;
                                    callback_route(DATA,RESPONSE_OBJECT);
                                    return;
                                }
                            }
                        },
                        patch:function (route,callback_route){
                            if(DATA.method.toLowerCase()=='patch'&&!this.OnFound){
                                if(route==DATA.route){
                                    OnFound=true;
                                    callback_route(DATA,RESPONSE_OBJECT);
                                    return;
                                }
                            }
                        },
                        delete:function (route,callback_route){
                            if(DATA.method.toLowerCase()=='delete'&&!this.OnFound){
                                if(route==DATA.route){
                                    OnFound=true;
                                    callback_route(DATA,RESPONSE_OBJECT);
                                    return;
                                }
                            }
                        },
                    }
                    callback(ROUTER);
                    channel.ack(msg);
                });
            });
        });
    },
};
module.exports=Server_REST_API;