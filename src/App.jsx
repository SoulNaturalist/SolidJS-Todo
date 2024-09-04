import logo from './logo.svg';
import styles from './App.module.css';
import { createSignal, batch } from "solid-js";

function App() {
  const [tasksData, setTask] = createSignal([], { equalityFn: (a, b) => a === b });
  const [textTask, setText] = createSignal("");
  const [inputId, setId] = createSignal(-1);
  const [loading, setLoading] = createSignal(true);

  const loadTasksFromLocalStorage = async () => {
    setLoading(true);
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTask(JSON.parse(storedTasks));
    }
    setLoading(false);
  };

  const saveTasksToLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasksData()));
  };

  loadTasksFromLocalStorage();

  const addTask = (task) => {
    setTask(tasks => [[task, false], ...tasks]);
    saveTasksToLocalStorage();
  };

  const swapStatus = (name) => {
    setTask(tasks => tasks.map(([taskName, status]) => 
      taskName === name ? [taskName, !status] : [taskName, status]
    ));
    saveTasksToLocalStorage();
  };

  const changeTaskName = (index, newName) => {
    batch(() => {
      setTask(tasks => tasks.map((task, i) => i === index ? [newName, task[1]] : task));
      setId(-1);
    });
    saveTasksToLocalStorage();
  };

  const removeTask = (index) => {
    batch(() => {
      setTask(tasks => tasks.filter((task, i) => i !== index));
      if (inputId() === index) {
        setId(-1);
      }
    });
    saveTasksToLocalStorage();
  };

  return (
    <div>
      <header class='header'>
        <h1>Список Задач</h1>
      </header>
      {loading() ? (
        <div style={{textAlign:"center", display:"block", margin:"auto", position:"relative", top:"120px"}}>
          <p>Загрузка задач...</p>
        </div>
      ) : (
        <>
          <input value={"Название задачи"} style={{textAlign:"center", display:"block", margin:"auto", position:"relative", top:"120px"}} onChange={(e) => setText(e.currentTarget.value)}/>
          <button style={{textAlign:"center", display:"block", margin:"auto", position:"relative", top:"140px"}} onClick={() => addTask(textTask())}>Создать</button>
          <br/>
          {tasksData().map((task, index) => (
            inputId() === index ?
              <div key={index}  style={{position:"relative", top:"120px"}}>
                <input value={task[0]} onChange={(e) => changeTaskName(index, e.currentTarget.value)}/> 
                <button className="buttonInput" onClick={() => changeTaskName(index, task[0])}>Сохранить</button>
                <button style={{marginLeft:"10px"}} onClick={() => removeTask(index)}>Удалить</button>

              </div>:
              <div key={index} style={{position:"relative", top:"120px"}}>
                <div 
                  className={`task-${task[0]}`} 
                  onClick={(e) => swapStatus(e.currentTarget.className.replace("task-", ""))}
                >
                  <div style={{textAlign:"center", display:"block", margin:"auto", background:task[1] ? "green":"red", color:"white", "border-radius":"10px", padding:"15px"}}>
                    Задание: {task[0]}
                    <br/>
                    статус {task[1] ? "Завершено": "В процессе"}
                  </div>
                </div>
                <div style={{textAlign:"center", display:"block", margin:"auto", background:"grey", color:"white", cursor:"pointer","border-radius":"5px", padding:"5px"}} onClick={() => setId(index)}>Изменить</div>
              </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;