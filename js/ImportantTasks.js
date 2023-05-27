import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  getDatabase,
  update,
  get,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCHnta7PptzHko_EBht5H52oRSbT67xuB0",
  authDomain: "computer-science-ia-bba75.firebaseapp.com",
  projectId: "computer-science-ia-bba75",
  storageBucket: "computer-science-ia-bba75.appspot.com",
  messagingSenderId: "863859461520",
  appId: "1:863859461520:web:1f24e37a56dd011ff77715",
  measurementId: "G-BH4Q0JCDNZ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const input = document.querySelector("#new-task-input");
const taskList = document.querySelector("#tasks");

async function updateTaskList() {
  try {
    const user = auth.currentUser;
    const userDb = await get(ref(db, `users/${user.uid}`));
    const tasks = userDb.val() || [];

    taskList.innerHTML = tasks.length > 0 ? "" : "No tasks";

    tasks.forEach((task, index) => {
      addTaskList(task, index);
    });
  } catch (error) {
    console.error(error);
  }
}

async function saveTask(task) {
  try {
    if (!task) return;
    const user = auth.currentUser;
    const userDb = await get(ref(db, `users/${user.uid}`));
    const tasks = userDb.val() || [];
    tasks.push(task);
    await set(ref(db, `users/${user.uid}`), tasks);
  } catch (error) {
    console.error(error);
  }
}

async function editTask(task, taskId) {
  try {
    if (!task) return;
    const user = auth.currentUser;
    const userDb = await get(ref(db, `users/${user.uid}`));
    const tasks = userDb.val() || [];
    tasks[taskId] = task;
    await set(ref(db, `users/${user.uid}`), tasks);
  } catch (error) {
    console.error(error);
  }
}

async function deleteTask(taskId) {
  try {
    const user = auth.currentUser;
    const userDb = await get(ref(db, `users/${user.uid}`));
    const tasks = userDb.val() || [];
    tasks.splice(taskId, 1);
    await set(ref(db, `users/${user.uid}`), tasks);
  } catch (error) {
    console.error(error);
  }
}

function createTaskElement(task, id) {
  const taskElement = document.createElement("div");
  taskElement.classList.add("task");
  taskElement.setAttribute("id", id);

  const taskContentElement = document.createElement("div");
  taskContentElement.classList.add("content");

  taskElement.appendChild(taskContentElement);

  const taskInputElement = document.createElement("input");
  taskInputElement.classList.add("text");
  taskInputElement.type = "text";
  taskInputElement.value = task;
  taskInputElement.setAttribute("readonly", "readonly");

  taskContentElement.appendChild(taskInputElement);

  const taskActionsElement = document.createElement("div");
  taskActionsElement.classList.add("actions");

  const taskEditButton = document.createElement("button");
  taskEditButton.classList.add("edit");
  taskEditButton.innerHTML = "Edit";

  const taskDeleteButton = document.createElement("button");
  taskDeleteButton.classList.add("delete");
  taskDeleteButton.innerHTML = "Delete";

  taskActionsElement.appendChild(taskEditButton);
  taskActionsElement.appendChild(taskDeleteButton);

  taskElement.appendChild(taskActionsElement);

  return { taskElement, taskInputElement, taskEditButton, taskDeleteButton };
}

function addTaskList(task, id) {
  const { taskElement, taskInputElement, taskEditButton, taskDeleteButton } =
    createTaskElement(task, id);

  taskList.appendChild(taskElement);

  taskInputElement.addEventListener("input", () => {
    editTask(taskInputElement.value, id);
  });

  taskEditButton.addEventListener("click", () => {
    if (taskEditButton.innerText.toLowerCase() === "edit") {
      taskInputElement.removeAttribute("readonly");
      taskInputElement.focus();
      taskEditButton.innerText = "Save";
    } else {
      taskInputElement.setAttribute("readonly", "readonly");
      taskEditButton.innerText = "Edit";
    }
  });

  taskDeleteButton.addEventListener("click", async () => {
    taskList.removeChild(taskElement);
    await deleteTask(id);
    updateTaskList();
  });
}

window.addEventListener("load", () => {
  setTimeout(updateTaskList, 500);
});

const form = document.querySelector("#new-task-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const task = input.value.trim();
  await saveTask(task);
  addTaskList(task);
  input.value = "";
  await updateTaskList();
});
