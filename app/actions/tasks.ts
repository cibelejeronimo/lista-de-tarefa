// app/actions/tasks.ts
'use server';

import { revalidatePath } from 'next/cache';


let tasks = [
  { id: 1, title: "Estudar Next.js", description: "Aprender server actions", status: "pendente" as const },
  { id: 2, title: "Fazer compras", description: "Comprar alimentos", status: "concluída" as const },
  { id: 3, title: "Reunião da Empresa", description: "Planejamento do projeto", status: "pendente" as const },
  { id: 4, title: "Levar o cachorro para passear", description: "levar sacola", status: "concluida" as const },
  { id: 5, title: "Lavar o banheiro", description: "repor as toalhas", status: "pendente" as const },
  { id: 6, title: "aniversario da sofy ", description: "não esquecer o presente", status: "pendente" as const },
];

interface TaskData {
  title: string;
  description?: string;

}

export async function getTasks() {
  // Simula delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...tasks];
}

export async function createTask(formData: TaskData) {
  try {
    const newTask = {
      id: Date.now(),
      ...formData,
      status: 'pendente' as const
    };
    tasks.push(newTask);
    revalidatePath('/');
    return { success: true, task: newTask };
  } catch (error) {
    console.error('Error creating task:', error);
    return { success: false };
  }
}

export async function getTaskById(id: number) {
  return tasks.find(task => task.id === id) || null;
}

export async function updateTask(id: number, updatedData: { title?: string; description?: string; status?: string }) {
  try {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData };
      revalidatePath('/');
      return { success: true, task: tasks[taskIndex] };
    }
    return { success: false };
  } catch (error) {
    console.error('Error updating task:', error);
    return { success: false };
  }
}

export async function deleteTask(id: number) {
  try {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
      revalidatePath('/');
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false };
  }
}

export async function addTask(taskData: { title: string; description?: string }) {
  return createTask(taskData);
}