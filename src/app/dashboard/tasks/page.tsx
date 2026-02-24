"use client";

import { useState, DragEvent } from "react";

type TaskStatus = "todo" | "in-progress" | "done";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "urgent";
  distance?: string;
  pickupTime?: string;
  price: number;
}

const initialTasks: Record<TaskStatus, Task[]> = {
  todo: [
    {
      id: "t1",
      title: "Downtown Express Delivery",
      description: "Package from Central Station to Office Tower",
      priority: "urgent",
      distance: "2.4 km",
      pickupTime: "Now",
      price: 28.5,
    },
    {
      id: "t2",
      title: "Medical Supplies – Hospital Rush",
      priority: "high",
      distance: "1.8 km",
      pickupTime: "15 min",
      price: 35.0,
    },
    {
      id: "t3",
      title: "Birthday Cake Delivery",
      priority: "medium",
      distance: "4.1 km",
      pickupTime: "30 min",
      price: 22.75,
    },
  ],
  "in-progress": [
    {
      id: "t4",
      title: "Legal Documents – Financial District",
      priority: "high",
      distance: "3.7 km",
      pickupTime: "In progress",
      price: 42.0,
    },
  ],
  done: [
    {
      id: "t5",
      title: "Coffee Order – Office Rush",
      priority: "medium",
      distance: "1.2 km",
      pickupTime: "Completed",
      price: 16.8,
    },
    {
      id: "t6",
      title: "Flower Bouquet – Anniversary",
      priority: "low",
      distance: "2.9 km",
      pickupTime: "Delivered",
      price: 31.25,
    },
  ],
};

export default function TasksKanban() {
  const [tasks, setTasks] = useState(initialTasks);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", task.id);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    if (!draggedTask) return;

    const sourceStatus = Object.keys(tasks).find((key) =>
      tasks[key as TaskStatus].some((t) => t.id === draggedTask.id)
    ) as TaskStatus | undefined;

    if (!sourceStatus || sourceStatus === status) return;

    const newSource = tasks[sourceStatus].filter((t) => t.id !== draggedTask.id);
    const newDest = [...tasks[status], draggedTask];

    setTasks({
      ...tasks,
      [sourceStatus]: newSource,
      [status]: newDest,
    });

    setDraggedTask(null);
  };

  const getPriorityStyle = (priority: Task["priority"]) => {
    switch (priority) {
      case "urgent": return "bg-primary text-white";
      case "high":   return "bg-orange-600 text-white";
      case "medium": return "bg-amber-500 text-white";
      case "low":    return "bg-gray-500 text-white";
      default:       return "bg-gray-400 text-white";
    }
  };

  const Column = ({
    title,
    status,
    icon,
  }: {
    title: string;
    status: TaskStatus;
    icon: string;
  }) => (
    <div className="flex-1 min-w-[320px] bg-gray-50/70 rounded-xl border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-3xl text-secondary">
            {icon}
          </span>
          <h2 className="text-lg font-bold text-secondary">{title}</h2>
        </div>
        <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-600 shadow-sm">
          {tasks[status].length}
        </span>
      </div>

      <div
        className="p-4 min-h-[500px] flex flex-col gap-4"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
      >
        {tasks[status].map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => handleDragStart(e, task)}
            className={`
              bg-white rounded-lg border border-gray-200 p-4 shadow-sm 
              hover:shadow-md hover:border-primary/40 transition-all
              cursor-grab active:cursor-grabbing select-none
              ${draggedTask?.id === task.id ? "opacity-40 scale-[0.98]" : ""}
            `}
          >
            <div className="flex justify-between items-start gap-3 mb-2">
              <h3 className="font-semibold text-secondary flex-1 line-clamp-2">
                {task.title}
              </h3>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${getPriorityStyle(
                  task.priority
                )}`}
              >
                {task.priority.toUpperCase()}
              </span>
            </div>

            {task.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-2">
              {task.distance && (
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">distance</span>
                  {task.distance}
                </div>
              )}
              {task.pickupTime && (
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  {task.pickupTime}
                </div>
              )}
              <div className="ml-auto font-bold text-primary">
                ${task.price.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-secondary pb-12">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary tracking-tight">
            Tasks – Kanban
          </h1>
          <p className="mt-2 text-gray-600">
            Drag & drop deliveries between columns
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4">
          <Column title="To Do"       status="todo"        icon="assignment" />
          <Column title="In Progress" status="in-progress" icon="local_shipping" />
          <Column title="Done"        status="done"        icon="check_circle" />
        </div>
      </div>
    </div>
  );
}