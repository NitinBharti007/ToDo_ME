# Task Management Application

A modern, responsive task management application built with HTML, CSS, and JavaScript. This application helps users organize their tasks efficiently with a clean and intuitive interface.

## Features

- **Task Management**
  - Add new tasks with title, description, priority, and category
  - Mark tasks as completed
  - Delete tasks with confirmation
  - View task details and status

- **Task Organization**
  - Filter tasks by status (All, Completed, Pending)
  - Filter tasks by priority (High, Medium, Low)
  - Filter tasks by category (Work, Personal, Shopping, Health, Other)
  - Search tasks by title or description

- **Statistics Dashboard**
  - View total number of tasks
  - Track completed tasks
  - Monitor pending tasks
  - Visual status indicators

- **User Interface**
  - Modern and responsive design
  - Clean and intuitive layout
  - Smooth animations and transitions
  - Mobile-friendly interface
  - Custom scrollbars
  - Toast notifications

## Technologies Used

- HTML5
- CSS3
  - Flexbox
  - Grid
  - Custom Properties (CSS Variables)
  - Media Queries
  - Transitions and Animations
- JavaScript (ES6+)
  - DOM Manipulation
  - Event Handling
  - Local Storage
  - Modern JavaScript Features

## Backend Process

### Data Structure

```javascript
{
  id: string,          // Unique identifier for each task
  title: string,       // Task title
  description: string, // Task description
  priority: string,    // High, Medium, Low
  category: string,    // Work, Personal, Shopping, Health, Other
  completed: boolean,  // Task completion status
  createdAt: number    // Timestamp of task creation
}
```

### Data Flow

1. **Data Storage**
   - Tasks are stored in browser's localStorage
   - Data is serialized using JSON
   - Each task has a unique ID generated using timestamp
   - Data persists across page refreshes

2. **Task Operations**
   - **Adding Tasks**
     1. Form validation
     2. Generate unique ID
     3. Create task object
     4. Save to localStorage
     5. Update UI and statistics

   - **Updating Tasks**
     1. Find task by ID
     2. Update task properties
     3. Save to localStorage
     4. Refresh UI and statistics

   - **Deleting Tasks**
     1. Show confirmation modal
     2. Remove task from array
     3. Update localStorage
     4. Refresh UI and statistics

3. **Data Management**
   - **TaskManager Class**
     - Handles all CRUD operations
     - Manages localStorage interactions
     - Updates statistics
     - Handles task filtering

   - **Statistics Calculation**
     - Total tasks count
     - Completed tasks count
     - Pending tasks count
     - Category-wise distribution
     - Priority-wise distribution

4. **Filtering System**
   - Status-based filtering (All/Completed/Pending)
   - Priority-based filtering (High/Medium/Low)
   - Category-based filtering
   - Search functionality
   - Combined filter support

5. **Error Handling**
   - Form validation
   - Storage quota exceeded
   - Invalid data handling
   - Error notifications
   - Fallback mechanisms

6. **Performance Optimization**
   - Debounced search
   - Efficient DOM updates
   - Optimized localStorage operations
   - Lazy loading of tasks
   - Cached statistics

## Getting Started

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Open the project directory:
   ```bash
   cd task-management-app
   ```

3. Open `index.html` in your web browser to start using the application.

## Usage

1. **Adding a Task**
   - Click the "Add Task" button in the sidebar
   - Fill in the task details (title, description, priority, category)
   - Click "Add Task" to save

2. **Managing Tasks**
   - Click the checkmark icon to mark a task as completed
   - Click the trash icon to delete a task
   - Use the search bar to find specific tasks
   - Use filters to organize tasks by status, priority, or category

3. **Viewing Statistics**
   - Check the stats cards in the sidebar for task overview
   - Monitor your progress with visual indicators

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Laptops
- Tablets
- Mobile phones

## Future Enhancements

- User authentication
- Cloud storage integration
- Task sharing capabilities
- Calendar integration
- Task reminders and notifications
- Dark mode support
- Export/import functionality

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Modern CSS techniques and best practices 