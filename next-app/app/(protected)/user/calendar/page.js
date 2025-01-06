"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";

export default function Calendar() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: "", description: "" });
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) {
        console.warn("User is not defined.");
        return;
      }

      try {
        const tasksRef = collection(db, `users/${user.uid}/tasks`);
        const snapshot = await getDocs(tasksRef);

        const tasksData = {};
        snapshot.docs.forEach((doc) => {
          const task = doc.data();
          if (!task.date) {
            console.warn(`Task with ID ${doc.id} is missing a 'date' field.`);
            return;
          }
          tasksData[task.date] = tasksData[task.date] || [];
          tasksData[task.date].push({ id: doc.id, ...task });
        });

        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [user, db]);

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDay || !taskForm.title) return;

    const taskId = taskForm.id || Date.now().toString();
    const taskRef = doc(db, `users/${user.uid}/tasks`, taskId);

    const taskData = {
      title: taskForm.title,
      description: taskForm.description,
      date: format(selectedDay, "yyyy-MM-dd"),
    };

    try {
      await setDoc(taskRef, taskData);
      setTasks((prev) => ({
        ...prev,
        [taskData.date]: [
          ...(prev[taskData.date] || []),
          { id: taskId, ...taskData },
        ],
      }));
      setTaskForm({ title: "", description: "" });
      setSelectedDay(null);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDeleteTask = async (taskId, taskDate) => {
    try {
      await deleteDoc(doc(db, `users/${user.uid}/tasks`, taskId));
      setTasks((prev) => ({
        ...prev,
        [taskDate]: prev[taskDate].filter((task) => task.id !== taskId),
      }));
      setSelectedTask(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdateTask = async (updatedDescription) => {
    if (!selectedTask) return;

    try {
      const taskRef = doc(db, `users/${user.uid}/tasks`, selectedTask.id);
      await updateDoc(taskRef, { description: updatedDescription });

      setTasks((prev) => ({
        ...prev,
        [selectedTask.date]: prev[selectedTask.date].map((task) =>
          task.id === selectedTask.id
            ? { ...task, description: updatedDescription }
            : task
        ),
      }));

      setSelectedTask((prev) => ({ ...prev, description: updatedDescription }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  return (
    <section className="p-6 bg-gray-100 text-gray-900 flex flex-col items-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        Calendar - {format(currentDate, "MMMM yyyy")}
      </h1>
      <div className="grid grid-cols-7 gap-2 w-full max-w-4xl">
        {daysInMonth.map((day) => (
          <div
            key={day}
            className={`border rounded-lg p-2 ${
              isSameDay(day, selectedDay) ? "bg-blue-200" : "bg-white"
            }`}
            onClick={() => setSelectedDay(day)}
          >
            <p className="font-bold text-center">{format(day, "d")}</p>
            <ul className="mt-2">
              {(tasks[format(day, "yyyy-MM-dd")] || []).map((task) => (
                <li
                  key={task.id}
                  className="text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTask(task);
                  }}
                >
                  {task.title}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {selectedDay && (
        <form
          onSubmit={handleTaskSubmit}
          className="mt-6 w-full max-w-md bg-white p-4 rounded-lg shadow"
        >
          <h2 className="text-lg font-bold">
            Add Task for {format(selectedDay, "dd MMM yyyy")}
          </h2>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={taskForm.title}
              onChange={(e) =>
                setTaskForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="mt-1 w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={taskForm.description}
              onChange={(e) =>
                setTaskForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="mt-1 w-full p-2 border rounded-md"
            />
          </div>
          <div className="mt-4 flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setTaskForm({ title: "", description: "" });
                setSelectedDay(null);
              }}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {selectedTask && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">
                {selectedTask.date} - {selectedTask.title}
              </h2>
            </div>

            {isEditing ? (
              <textarea
                value={selectedTask.description}
                onChange={(e) =>
                  setSelectedTask((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="mt-4 w-full p-2 border rounded-md"
              />
            ) : (
              <p className="mt-4 text-gray-700">{selectedTask.description}</p>
            )}

            <div className="mt-6 flex justify-between">
              {isEditing ? (
                <button
                  onClick={() => handleUpdateTask(selectedTask.description)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() =>
                  handleDeleteTask(selectedTask.id, selectedTask.date)
                }
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedTask(null);
                }}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
