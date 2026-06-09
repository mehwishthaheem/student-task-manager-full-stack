const API_URL = "http://127.0.0.1:7000/tasks";

async function loadTasks() {
    const taskList = document.getElementById("taskList");

    try {
        taskList.innerHTML = "<li>Loading tasks...</li>";

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch tasks");
        }

        const tasks = await response.json();

        taskList.innerHTML = "";

        if (tasks.length === 0) {
            taskList.innerHTML = "<li>No tasks found</li>";
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement("li");

            li.innerHTML = `
                <strong>${task.title}</strong> - ${task.description}
                <button onclick="deleteTask('${task._id}')">Delete</button>
            `;

            taskList.appendChild(li);
        });

    } catch (error) {
        console.log(error);
        taskList.innerHTML = "<li>Backend connection failed</li>";
    }
}

async function addTask() {
    const title = document.getElementById("taskTitle").value.trim();
    const description = document.getElementById("taskDescription").value.trim();

    if (!title || !description) {
        alert("Please enter title and description");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                description: description
            })
        });

        if (!response.ok) {
            throw new Error("Failed to add task");
        }

        document.getElementById("taskTitle").value = "";
        document.getElementById("taskDescription").value = "";

        loadTasks();

    } catch (error) {
        console.log(error);
        alert("Task was not added. Check backend.");
    }
}

async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete task");
        }

        loadTasks();

    } catch (error) {
        console.log(error);
        alert("Task was not deleted. Check backend.");
    }
}

loadTasks();