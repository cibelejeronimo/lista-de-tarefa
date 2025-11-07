// app/page.tsx
"use client";
import { useEffect, useState } from "react";
import { getTasks, addTask, updateTask, deleteTask } from "./actions/tasks";

interface Task {
  id: number;
  title: string;
  description?: string;
  status: "pendente" | "concluída";
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("todas");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // Carrega as tarefas
  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTask() {
    if (!newTask.trim()) return;
    
    setLoading(true);
    try {
      await addTask({ title: newTask });
      setNewTask("");
      await loadTasks();
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(task: Task) {
    setLoading(true);
    try {
      const newStatus = task.status === "pendente" ? "concluída" : "pendente";
      await updateTask(task.id, { status: newStatus });
      await loadTasks();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    setLoading(true);
    try {
      await deleteTask(id);
      await loadTasks();
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(task: Task) {
    setEditingTask(task);
    setEditTitle(task.title);
  }

  async function saveEdit() {
    if (!editingTask || !editTitle.trim()) return;
    
    setLoading(true);
    try {
      await updateTask(editingTask.id, { title: editTitle });
      setEditingTask(null);
      setEditTitle("");
      await loadTasks();
    } catch (error) {
      console.error("Erro ao editar tarefa:", error);
    } finally {
      setLoading(false);
    }
  }

  function cancelEdit() {
    setEditingTask(null);
    setEditTitle("");
  }

  const filteredTasks =
    filter === "todas"
      ? tasks
      : tasks.filter((t) => t.status === filter);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>
        📝 Lista de Tarefas
      </h1>

      {/* Formulário para adicionar nova tarefa */}
      <div style={{ display: "flex", marginBottom: "20px", gap: "10px" }}>
        <input
          placeholder="Digite uma nova tarefa..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            fontSize: "16px"
          }}

          
          disabled={loading}
        />
        <button 
          onClick={handleAddTask}
          disabled={loading}
          style={{
            padding: "10px 20px",
            background: "#b094b6ff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px"
          }}
          
          
        >
          {loading ? "⏳" : "➕"} Adicionar
        </button>
      </div>
          {/* Campo opcional de descrição */}
        <textarea
          name="description"
          placeholder="Descrição da tarefa (opcional)"
          className="border p-2 rounded outline-none focus:ring-2 focus:ring-purple-400"
        />
        

      {/* Filtro por status */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>Filtrar: </label>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            fontSize: "14px"
          }}
          disabled={loading}
        >
          <option value="todas">📋 Todas</option>
          <option value="pendente">⏳ Pendentes</option>
          <option value="concluída">✅ Concluídas</option>
        </select>
      </div>

      {/* Lista de tarefas */}
      {loading && tasks.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Carregando tarefas...</p>
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              style={{
                background: "#fff",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: editingTask?.id === task.id ? "2px solid #007acc" : "1px solid #e0e0e0"
              }}
            >
              {editingTask?.id === task.id ? (
                // Modo Edição
                <div style={{ display: "flex", flex: 1, alignItems: "center", gap: "10px" }}>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{ 
                      flex: 1, 
                      padding: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "4px"
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                    disabled={loading}
                  />
                  <button 
                    onClick={saveEdit}
                    disabled={loading}
                    style={{ 
                      background: "#28a745", 
                      color: "white", 
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    💾 Salvar
                  </button>
                  <button 
                    onClick={cancelEdit}
                    disabled={loading}
                    style={{ 
                      background: "#6c757d", 
                      color: "white", 
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    ❌ Cancelar
                  </button>
                </div>
              ) : (
                // Modo Visualização
                <>
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        textDecoration: task.status === "concluída" ? "line-through" : "none",
                        color: task.status === "concluída" ? "#666666ff" : "#333",
                        fontSize: "16px",
                        fontWeight: "500"
                      }}
                    >
                      {task.title}
                    </span>
                    {task.description && (
                      <p style={{ 
                        margin: "5px 0 0 0", 
                        color: "#666", 
                        fontSize: "14px" 
                      }}>
                        {task.description}
                      </p>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button 
                      onClick={() => handleToggleStatus(task)}
                      disabled={loading}
                      style={{
                        background: task.status === "pendente" ? "#94a728ff" : "#c2991eff",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      {task.status === "pendente" ? "✅ Concluir" : "↩️ Reabrir"}
                    </button>
                    <button
                      onClick={() => startEdit(task)}
                      disabled={loading}
                      style={{
                        background: "#007acc",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      disabled={loading}
                      style={{
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      🗑 Excluir
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}


      {/* Mensagem quando não há tarefas */}
      {filteredTasks.length === 0 && !loading && (
        <div style={{ textAlign: "center", padding: "40px", color: "#666666ff" }}>
          <p style={{ fontSize: "18px" }}>
            {filter === "todas" 
              ? "📝 Nenhuma tarefa encontrada. Adicione uma nova tarefa!" 
              : `🔍 Nenhuma tarefa ${filter === "pendente" ? "pendente" : "concluída"} encontrada.`
            }
          </p>
        </div>
      )}
    </div>
  );
}
