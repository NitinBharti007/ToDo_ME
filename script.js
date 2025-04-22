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
        this.notified = false;
    }
}

// TaskManager class to handle all task operations
class TaskManager {
    constructor() {
        this.tasks = [];
        this.loadTasks();
        this.setupEventListeners();
        this.setupNotifications();
        this.startOverdueCheck();
    }

    // Setup notifications
    setupNotifications() {
        // Request notification permission
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notification permission granted');
                }
            }).catch(error => {
                console.error('Error requesting notification permission:', error);
            });
        } 
        // Check for overdue tasks every minute
        setInterval(() => this.checkOverdueTasks(), 60000);
    }

    // Reset all filters
    resetFilters() {
        document.getElementById('filterCategory').value = 'all';
        document.getElementById('filterPriority').value = 'all';
        document.getElementById('searchTask').value = '';
        this.displayTasks();
        showToast('Filters reset successfully!', 'success');
    }

    // Open edit modal
    openEditModal(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        document.getElementById('editTaskId').value = task.id;
        document.getElementById('editTaskName').value = task.title;
        document.getElementById('editDescription').value = task.description;
        document.getElementById('editDeadline').value = task.dueDate;
        document.getElementById('editPriority').value = task.priority;
        document.getElementById('editCategory').value = task.category;

        document.getElementById('editTaskModal').classList.add('show');
    }

    // Close edit modal
    closeEditModal() {
        document.getElementById('editTaskModal').classList.remove('show');
    }

    // Save edited task
    saveEditedTask(e) {
        e.preventDefault();
        
        const taskId = document.getElementById('editTaskId').value;
        const task = this.tasks.find(t => t.id === taskId);
        
        if (task) {
            task.title = document.getElementById('editTaskName').value;
            task.description = document.getElementById('editDescription').value;
            task.dueDate = document.getElementById('editDeadline').value;
            task.priority = document.getElementById('editPriority').value;
            task.category = document.getElementById('editCategory').value;
            
            this.saveTasks();
            this.displayTasks();
            this.closeEditModal();
            showToast('Task updated successfully!', 'success');
        }
    }

    // Start checking for overdue tasks
    startOverdueCheck() {
        // Check every 10 seconds
        setInterval(() => this.checkOverdueTasks(), 10000);
    }

    // Check for overdue tasks and show notifications
    checkOverdueTasks() {
        const now = new Date();
        let hasOverdueTasks = false;
        
        this.tasks.forEach(task => {
            if (!task.completed && !task.notified) {
                const deadline = new Date(task.dueDate);
                if (deadline <= now) {
                    console.log('Found overdue task:', task.title);
                    this.showOverdueNotification(task);
                    task.notified = true;
                    hasOverdueTasks = true;
                }
            }
        });

        if (hasOverdueTasks) {
            this.saveTasks();
            this.displayTasks(); // Update the display to show overdue status
        }
    }

    // Play notification sound
    playNotificationSound() {
        // Create a more noticeable sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Set a much louder volume
        gainNode.gain.value = 1.0; // Maximum volume
        
        // Play a more attention-grabbing alarm tone
        oscillator.type = 'sine';
        // First beep
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
        // Second beep
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.4);
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.5);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.6);
        // Third beep
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.8);
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.9);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 1.0);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1.2);
    }

    // Show notification for overdue task
    showOverdueNotification(task) {
        // Play the alarm sound
        this.playNotificationSound();
        
        // Show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            try {
                new Notification('⚠️ TASK OVERDUE!', {
                    body: `"${task.title}" is overdue! Please complete it as soon as possible.`,
                    icon: 'https://cdn-icons-png.flaticon.com/512/1827/1827504.png',
                    tag: task.id,
                    requireInteraction: true, // Notification stays until clicked
                    vibrate: [200, 100, 200] // Vibrate pattern for mobile devices
                });
            } catch (error) {
                console.error('Error showing overdue notification:', error);
            }
        }

        // Show visual alert with more emphasis
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show overdue-alert';
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.zIndex = '9999';
        alertDiv.style.minWidth = '300px';
        alertDiv.style.animation = 'shake 0.5s ease-in-out';
        alertDiv.innerHTML = `
            <strong>⚠️ Task Overdue!</strong><br>
            "${task.title}" is overdue!<br>
            <small>Please complete it as soon as possible.</small>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(alertDiv);

        // Auto remove after 10 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 10000);
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
            createdAt: new Date().toISOString(),
            notified: false
        };

        this.tasks.push(newTask);
        this.saveTasks();
        this.displayTasks();
        showToast('Task added successfully!', 'success');

        // Schedule a check for this specific task
        this.scheduleTaskCheck(newTask);
    }

    // Schedule a check for a specific task
    scheduleTaskCheck(task) {
        const deadline = new Date(task.dueDate);
        const now = new Date();
        const timeUntilDeadline = deadline - now;

        if (timeUntilDeadline > 0) {
            setTimeout(() => {
                if (!task.completed && !task.notified) {
                    this.showOverdueNotification(task);
                    task.notified = true;
                    this.saveTasks();
                }
            }, timeUntilDeadline);
        }
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
            const deadline = new Date(task.dueDate);
            const isOverdue = !task.completed && deadline < new Date();
            
            taskElement.className = `task-item ${task.completed ? 'completed' : ''} priority-${task.priority} ${isOverdue ? 'overdue' : ''}`;
            
            taskElement.innerHTML = `
                <div class="task-header">
                    <div>
                        <span class="category-badge category-${task.category}">${this.getCategoryLabel(task.category)}</span>
                        <h6 class="task-title">${task.title}</h6>
                    </div>
                    <div class="task-actions">
                        <button class="btn-edit" onclick="taskManager.openEditModal('${task.id}')">
                            <i class="bi bi-pencil"></i>
                        </button>
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
                    <small class="${isOverdue ? 'text-danger overdue-text' : ''}">
                        <i class="bi bi-clock"></i>
                        ${deadline.toLocaleString()}
                        ${isOverdue ? ' <span class="overdue-badge">OVERDUE</span>' : ''}
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

        // Add filter event listeners
        const filterCategory = document.getElementById('filterCategory');
        const filterPriority = document.getElementById('filterPriority');
        const searchInput = document.getElementById('searchTask');

        if (filterCategory) {
            filterCategory.addEventListener('change', () => {
                this.displayTasks();
            });
        }

        if (filterPriority) {
            filterPriority.addEventListener('change', () => {
                this.displayTasks();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.displayTasks();
            });
        }

        // Add edit form event listener
        const editTaskForm = document.getElementById('editTaskForm');
        if (editTaskForm) {
            editTaskForm.addEventListener('submit', (e) => this.saveEditedTask(e));
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