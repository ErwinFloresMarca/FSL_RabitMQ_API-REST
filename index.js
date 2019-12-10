var server=require ('./Rmq_Server');

server.connect({
    hostname:'localhost',
    port:5672,
    username:'rabbitmq',
    password:'rabbitmq',
    queue:'server'
},(route)=>{
    route.post('user/',(req,res)=>{
        let data=req.body;
        console.log("metodo post",data);
        res.status(200).json({
            msn:'ok',
            data:data
        });
    });
    route.get('user/',(req,res)=>{
        let data=req.body;
        console.log("metodo get",data);
        res.status(200).json({
            msn:'ok',
            data:data
        });
    });
    route.get('user/list/',(req,res)=>{
        let data=req.body;
        console.log("metodo get list",data);
        res.status(200).json({
            msn:'ok',
            data:data
        });
    });
    route.put('user/',(req,res)=>{
        let data=req.body;
        console.log("metodo put",data);
        res.status(200).json({
            msn:'ok',
            data:data
        });
    });
    route.patch('user/',(req,res)=>{
        let data=req.body;
        console.log("metodo patch",data);
        res.status(200).json({
            msn:'ok',
            data:data
        });
    });
    route.delete('user/',(req,res)=>{
        let data=req.body;
        console.log("metodo delete",data);
        res.status(200).json({
            msn:'ok',
            data:data
        });
    });
});