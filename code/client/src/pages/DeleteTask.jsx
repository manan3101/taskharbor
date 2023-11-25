import Navigation from "./Navigate";
import { useState } from "react";
const DeleteTask = ({ state }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const closeModal = () => {
    setModalVisible(false);
    setModalContent("");
  };


  const deleteTask = async (event) => {
    event.preventDefault();
    const { contract, account } = state;
    const taskID = document.querySelector("#taskID").value;

    try {
      const res = await fetch(`http://localhost:3000/api/ethereum/delete-task/${taskID}`, {
        method: "DELETE", // Correctly specify DELETE method
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ taskID: taskID }),
      });
      const data = await res.json();
      console.log(data);
      if (data.STATUS === 200) {
        await contract.methods.deleteTask(taskID).send({ from: account });
        setModalContent(
          `Task ID ${taskID} Deleted`
        );
        setModalVisible(true);
      } else {
        alert("Entry can't be Deleted");
      }
    } catch (error) {
      setModalContent("Task cannot be Deleted");
          setModalVisible(true);
    }
    
  };

  return (
    <>
      <Navigation />
      <div className="delete_task todo_btn">
        <form onSubmit={deleteTask}>
          <label htmlFor="taskID">
            ID:
            <input id="taskID" />
          </label>
          <button type="submit">Delete entry</button>
        </form>
        {modalVisible && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <p>{modalContent}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DeleteTask;
