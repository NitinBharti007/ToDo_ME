// Task class to represent a single task
class Task {
    constructor(name, description, deadline, priority, category) {
        this.name = name;
        this.description = description;
        this.deadline = deadline;
        this.priority = priority;
        this.category = category;
        this.completed = false;
        this.id = Date.now().toString();
        this.createdAt = new Date().toISOString();
    }
}

// TaskManager class to handle all task operations
class TaskManager {
    constructor() {
        this.tasks = [];
        this.loadTasks();
        this.setupEventListeners();
    }

    // Load tasks from localStorage
    loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
            this.displayTasks();
            this.updateStats();
        }
    }

    // Save tasks to localStorage
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.updateStats();
    }

    // Add a new task
    addTask(title, description, dueDate, priority, category) {
        const newTask = {
            id: Date.now().toString(),
            title,
            description,
            dueDate,
            priority,
            category,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(newTask);
        this.saveTasks();
        this.displayTasks();
        showToast('Task added successfully!', 'success');
    }

    // Delete a task
    deleteTask(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (!task) return;

        const modal = document.createElement('div');
        modal.className = 'delete-confirmation';
        modal.innerHTML = `
            <div class="delete-confirmation-content">
                <h3>Delete Task</h3>
                <p>Are you sure you want to delete "${task.title}"?</p>
                <div class="delete-confirmation-buttons">
                    <button class="btn-confirm" onclick="taskManager.confirmDelete('${taskId}')">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                    <button class="btn-cancel" onclick="taskManager.cancelDelete()">
                        <i class="bi bi-x-circle"></i> Cancel
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    confirmDelete(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
        this.displayTasks();
        this.cancelDelete();
        showToast('Task deleted successfully!', 'success');
    }

    cancelDelete() {
        const modal = document.querySelector('.delete-confirmation');
        if (modal) {
            modal.remove();
        }
    }

    // Toggle task completion status
    toggleTaskStatus(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.displayTasks();
            showToast(`Task marked as ${task.completed ? 'completed' : 'incomplete'}!`, 'success');
        }
    }

    // Clear all tasks
    clearAllTasks() {
        if (confirm('Are you sure you want to delete all tasks?')) {
            this.tasks = [];
            this.saveTasks();
            this.displayTasks();
            showToast('All tasks cleared successfully!', 'success');
        }
    }

    // Clear completed tasks
    clearCompletedTasks() {
        if (confirm('Are you sure you want to delete all completed tasks?')) {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveTasks();
            this.displayTasks();
            showToast('Completed tasks cleared successfully!', 'success');
        }
    }

    // Update statistics
    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;

        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('pendingTasks').textContent = pendingTasks;
    }

    // Filter tasks based on category, priority, and search term
    filterTasks() {
        const categoryFilter = document.getElementById('filterCategory').value;
        const priorityFilter = document.getElementById('filterPriority').value;
        const searchTerm = document.getElementById('searchTask').value.toLowerCase();

        return this.tasks.filter(task => {
            const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
            const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
            const matchesSearch = task.title.toLowerCase().includes(searchTerm) || 
                                task.description.toLowerCase().includes(searchTerm);

            return matchesCategory && matchesPriority && matchesSearch;
        });
    }

    // Display tasks in the UI
    displayTasks() {
        const tasksList = document.getElementById('tasksList');
        tasksList.innerHTML = '';

        const filteredTasks = this.filterTasks();
        
        if (filteredTasks.length === 0) {
            tasksList.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-inbox"></i>
                    <p>No tasks found</p>
                </div>
            `;
            return;
        }

        filteredTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.completed ? 'completed' : ''} priority-${task.priority}`;
            
            const deadline = new Date(task.dueDate);
            const isOverdue = !task.completed && deadline < new Date();
            
            taskElement.innerHTML = `
                <div class="task-header">
                    <div>
                        <span class="category-badge category-${task.category}">${this.getCategoryLabel(task.category)}</span>
                        <h6 class="task-title">${task.title}</h6>
                    </div>
                    <div class="task-actions">
                        <button class="btn-complete" onclick="taskManager.toggleTaskStatus('${task.id}')">
                            <i class="bi ${task.completed ? 'bi-check-circle-fill' : 'bi-circle'}"></i>
                        </button>
                        <button class="btn-delete" onclick="taskManager.deleteTask('${task.id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                <p class="task-description">${task.description}</p>
                <div class="task-footer">
                    <small>Created: ${new Date(task.createdAt).toLocaleDateString()}</small>
                    <small class="${isOverdue ? 'text-danger' : ''}">
                        <i class="bi bi-clock"></i>
                        ${deadline.toLocaleString()}
                        ${isOverdue ? ' (Overdue)' : ''}
                    </small>
                </div>
            `;

            tasksList.appendChild(taskElement);
        });
    }

    // Get category label for display
    getCategoryLabel(category) {
        const labels = {
            'work': 'Work',
            'personal': 'Personal',
            'shopping': 'Shopping',
            'health': 'Health',
            'other': 'Other'
        };
        return labels[category] || category;
    }

    // Setup event listeners
    setupEventListeners() {
        const taskForm = document.getElementById('taskForm');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const title = document.getElementById('taskName').value;
                const description = document.getElementById('description').value;
                const dueDate = document.getElementById('deadline').value;
                const priority = document.getElementById('priority').value;
                const category = document.getElementById('category').value;

                this.addTask(title, description, dueDate, priority, category);
                taskForm.reset();
            });
        }

        const searchInput = document.getElementById('searchTask');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.displayTasks();
            });
        }
    }
}

// Initialize the task manager
const taskManager = new TaskManager();

// Toast notification function
function showToast(message, type = 'success') {
    const backgroundColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#f59e0b';
    
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: backgroundColor,
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: "500",
            color: "#ffffff"
        }
    }).showToast();
} 