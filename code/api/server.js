const express=require('express');
const ABI=require('./ABI.json');
const cors=require("cors");
const {Web3}=require('web3');

const app=express();
app.use(cors())
app.use(express.json())

const web3=new Web3("HTTP://127.0.0.1:7545");                         //ganache http
const contract_address="0x40c4613e9428996730Bf8FEB2D7DA8c69D52D539";  //contract address
const contract=new web3.eth.Contract(ABI,contract_address);

const dateCheck=async(taskDate)=>{
    const tasks=await contract.methods.allTask().call();
    const foundTask=tasks.find((tasks)=>tasks.date===taskDate);
    if (foundTask) {
        return foundTask.name;
      } else {
        return "No Task Found";
      }
}

app.post("/api/ethereum/create-task",async(req,res)=>{
    const {taskDate}=req.body;
    const task=await dateCheck(taskDate);
    try{
     if(task!=="No Task Found"){
        res.status(409).json({STATUS:409,message:"Date Clashed"});
     }
     else{
        res.status(200).json({STATUS:200,message:"Entry can be Added"});
     }
    }
    catch(error)
    {
        console.error(error);
    }
})

app.post("/api/ethereum/update-task",async(req,res)=>{
    const {taskDate}=req.body;
    const task=await dateCheck(taskDate);
    try{
     if(task!=="No Task Found"){
        res.status(409).json({STATUS:409,message:"updated Date Clashed"});
     }
     else{
        res.status(200).json({STATUS:200,message:"Entry can be Updated"});
     }
    }
    catch(error)
    {
         console.error(error);
    }
})

app.get("/api/ethereum/view-task/:taskId",async(req,res)=>{
   try{
    const {taskId}=req.params;
    const task=await contract.methods.viewTask(taskId).call();
    const {id,name,date}=task;
    const tid=Number(id);
    const taskobject={
        tid,name,date
    }
    res.status(200).json({STATUS:200,taskobject,MESSAGE:"Entry Exist"});
   }
   catch(error)
   {
    res.status(404).json({STATUS:500,MESSAGE:"Entry not Exist"});
   }
})

app.get("/api/ethereum/view-all-task",async(req,res)=>{
    try{
     const task=await contract.methods.allTask().call();
     if(task.length>0)
   {
        const tasklist=task.map(({id,name,date})=>{
        const tid=Number(id);
        return {tid,name,date};
    })
    res.status(200).json({STATUS:200,tasklist,MESSAGE:"Entry Exist"});
   }
   else
   res.status(404).json({STATUS:404,tasklist,MESSAGE:"Entry List Not Exist"});
    }
    catch(error)
    {
       console.log(error);
    }
 })
 
const priorityCheck = async(id)=>{
    const tasks = await contract.methods.allTask().call();
    const result = tasks[id-1].name.includes("priority");
    return result;
}

app.delete("/api/ethereum/delete-task/:taskId",async(req,res)=>{
    try{
      const {taskId}=req.params;
      const isTrue = await priorityCheck(taskId);
      console.log(isTrue);
      if(isTrue){
        res.status(403).json({STATUS:403,message:"Entry is prioritized"})
      }else{
        res.status(200).json({STATUS:200,message:"Entry can delete"})
      }
    }catch(error){
      console.error(error);
    }
})


app.listen(3000, function () {
    console.log("Server is running on localhost4000");
});
