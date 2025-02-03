"use client"

import { useState, useEffect } from "react"
import axios from "axios"

interface Task {
  _id: string
  title: string
  description: string
  status: boolean
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [editMode, setEditMode] = useState(false)  // To toggle between creating and editing tasks
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null) // The task being edited

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get("/api/task")
      setTasks(response.data)
    } catch (err) {
      console.log(err)
      setToast({ message: "Failed to fetch tasks", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newTaskTitle.trim() && description.trim()) {
      try {
        setIsSubmitting(true)
        const response = await axios.post("/api/task", { title: newTaskTitle, description })
        setTasks((prevTasks) => [...prevTasks, response.data])
        setNewTaskTitle("")
        setDescription("")
        setToast({ message: "Task created successfully", type: "success" })
      } catch (err) {
        console.log(err)
        setToast({ message: "Failed to create task", type: "error" })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const updateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (taskToEdit && taskToEdit.title.trim() && taskToEdit.description.trim()) {
      try {
        const res = await axios.put(`/api/task?id=${taskToEdit._id}`, {
          title: taskToEdit.title,
          description: taskToEdit.description,
        })
        const updatedTask = res.data

        setTasks((prevTasks) =>
          prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
        )

        setTaskToEdit(null)
        setEditMode(false)
        setToast({ message: "Task updated successfully", type: "success" })
      } catch (err) {
        console.log(err)
        setToast({ message: "Failed to update task", type: "error" })
      }
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`/api/task?id=${id}`)
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id))
      setToast({ message: "Task deleted successfully", type: "success" })
    } catch (err) {
      console.log(err)
      setToast({ message: "Failed to delete task", type: "error" })
    }
  }

  const toggleTaskStatus = async (taskId: string, newStatus: boolean) => {
    try {
      const res = await axios.put(`/api/task?id=${taskId}`, { status: newStatus });
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? res.data : task))
      );
    } catch (err) {
      console.log(err)
      setToast({ message: "Failed to update task status", type: "error" });
    }
  };

  if (isLoading) return <div className="text-center">Loading...</div>

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Task Management System</h1>

      {toast && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md ${toast.type === "success" ? "bg-green-500" : "bg-red-500"} text-white`}
        >
          {toast.message}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{editMode ? "Edit Task" : "Add New Task"}</h2>
        <form onSubmit={editMode ? updateTask : createTask} className="space-y-4">
          <input
            type="text"
            value={editMode ? taskToEdit?.title : newTaskTitle}
            onChange={(e) =>
              editMode
                ? setTaskToEdit({ ...taskToEdit!, title: e.target.value })
                : setNewTaskTitle(e.target.value)
            }
            placeholder="Enter task title"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={editMode ? taskToEdit?.description : description}
            onChange={(e) =>
              editMode
                ? setTaskToEdit({ ...taskToEdit!, description: e.target.value })
                : setDescription(e.target.value)
            }
            placeholder="Enter task description"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? (editMode ? "Updating Task..." : "Adding Task...") : editMode ? "Update Task" : "Add Task"}
          </button>
        </form>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center text-gray-500">
          No tasks found. Add a new task to get started!
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={task.status}
                  onChange={() => toggleTaskStatus(task._id, !task.status)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <p className={`font-medium ${task.status ? "line-through text-gray-500" : ""}`}>{task.title}</p>
                  <p className="text-sm text-gray-500">{task.description}</p>
                </div>
              </div>
              <div className="flex space-x-4 ml-4">
                <button
                  onClick={() => {
                    setTaskToEdit(task)
                    setEditMode(true)
                  }}
                  className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete
                </button>
              </div>
            </div>

          ))}
        </div>
      )}
    </div>
  )
}
