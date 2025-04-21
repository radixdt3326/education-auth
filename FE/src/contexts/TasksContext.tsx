"use client";
import { createContext, useContext, useEffect, useState } from "react";

const TaskContext = createContext<null>(null);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a TasksProvider");
  return context;
};

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([1,2,3])


  return (
    <TaskContext.Provider
      value={{
        tasks,
        // createTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
