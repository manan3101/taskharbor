import { useState,useEffect } from "react"
import Navigation from "./Navigate"
const ViewAllTasks=()=>{
    const [taskList,setTaskList]=useState([])

    useEffect(()=>{
        const allTasks=async()=>{
        try{
          const res=await fetch("http://localhost:3000/api/ethereum/view-all-task",{
            method:"GET",
            headers:{
                "content-type":"application/json"
            }
          })
          const data=await res.json();
          if (data.STATUS===200)
          {
            console.log(data);
            setTaskList(data.tasklist)
          }
          else{
            throw new Error;
          }
        
        }
        catch(error)
        {
            console.error(error);
        }
        }
        allTasks();
    },[])
    return <>
    <Navigation/>
    <div className="view_all_tasks">
      {taskList.map((task)=>{
        return(
            <div 
            className="view_all_tasks_card"
            key={task.tid}
            style={task.tid!=="" && task.name!=="" && task.date!=="" ? {} : {display:"none"}}
            >   
                <p>{task.tid}</p>
                <p>{task.name}</p>
                <p>{task.date}</p>
            </div>
        )
      })}
      </div>
    </>
}
export default ViewAllTasks