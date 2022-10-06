import { useEffect, useState } from "react";
import { remult } from "remult";
import { Task } from "./shared/Task";
import { TasksController } from "./shared/TasksController";

import "./App.css";

const taskRepo = remult.repo(Task);
async function fetchTasks(hideCompleted: boolean) {
  return taskRepo.find();
}

function App() {
  const [hideCompleted, setHideCompleted] = useState(false);
  const [tasks, setTasks] = useState<(Task & { error?: ErrorInfo<Task> })[]>(
    []
  );

  useEffect(() => {
    fetchTasks(hideCompleted).then(setTasks);
  }, [hideCompleted]);

  const saveTask = async (task: Task) => {
    try {
      const updatedTask = await taskRepo.save(task);
      setTasks(tasks.filter((t) => t.completed !== true));
    } catch (error: any) {
      setTasks(tasks.map((t) => (t === task ? { ...task, error } : t)));
    }
  };
  const addTask = () => {
    setTasks([...tasks, new Task()]);
  };

  const deleteTask = async (task: Task) => {
    await taskRepo.delete(task);
    setTasks(tasks.filter((t) => t !== task));
  };
  const setAll = async (completed: boolean) => {
    await TasksController.setAll(completed);
    fetchTasks(hideCompleted).then(setTasks);
  };
  return (
    <div className="App">
      <input
        type="checkbox"
        checked={hideCompleted}
        onChange={(e) => setHideCompleted(e.target.checked)}
      />{" "}
      Hide Completed
      {tasks.map((task) => {
        const handleChange = (values: Partial<Task>) => {
          setTasks(tasks.map((t) => (t === task ? { ...task, ...values } : t)));
        };
        return (
          <div key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => handleChange({ completed: e.target.checked })}
            />
            <input
              value={task.title}
              onChange={(e) => handleChange({ title: e.target.value })}
            />
            <span>{task.error?.modelState?.title}</span>
            <button onClick={() => saveTask(task)}>Save</button>
            <button onClick={() => deleteTask(task)}>Delete</button>
          </div>
        );
      })}
      <button onClick={addTask}>Add task</button>
      <div>
        <button onClick={() => setAll(true)}>Set all Completed</button>
        <button onClick={() => setAll(false)}>Set all Uncompleted</button>
      </div>
    </div>
  );
}

export default App;
