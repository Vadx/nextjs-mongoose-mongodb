"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ITask } from "@/types";
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchTasks();
    }
  }, [status, router]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskCreated = (newTask: ITask) => {
    setTasks([newTask, ...tasks]);
    setShowForm(false);
  };

  const handleTaskUpdated = (updatedTask: ITask) => {
    setTasks(
      tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)),
    );
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks(tasks.filter((task) => task._id !== taskId));
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>

        {showForm && (
          <div className="mb-8">
            <TaskForm
              onTaskCreated={handleTaskCreated}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
            />
          ))}
        </div>

        {tasks.length === 0 && !showForm && (
          <div className="text-center text-gray-500">
            No tasks found. Create your first task to get started!
          </div>
        )}
      </div>
    </div>
  );
}
