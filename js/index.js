const formElement = document.querySelector("form");
const inputElement = document.querySelector("input");
const loadingElement = document.querySelector(".loading");
const apiKey = "6875159d34a1869ccb28d658";
let toDoList = [];

const mode = document.querySelector(".mode");

if (localStorage.getItem("theme") !== null) {
  const theme = localStorage.getItem("theme");
  document.documentElement.dataset.theme = theme;

  if (theme === "light") mode.classList.replace("fa-sun", "fa-moon");
}


getAllTodos();
mode.addEventListener("click", function () {
  if (mode.classList.contains("fa-sun")) {
    document.documentElement.setAttribute("data-theme", "light");
    mode.classList.replace("fa-sun", "fa-moon");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.dataset.theme = "dark";
    mode.classList.replace("fa-moon", "fa-sun");
    localStorage.setItem("theme", "dark");
  }
});

formElement.addEventListener("submit", function (e) {
  e.preventDefault();
  addTodo();
form
});

async function addTodo() {
  showLoading();
  try {
    const todoObj = {
      title: inputElement.value,
      apiKey: apiKey,
    };

    const opations = {
      method: "POST",
      body: JSON.stringify(todoObj),
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
      },
    };

    const data = await fetch(
      "https://todos.routemisr.com/api/v1/todos",
      opations
    )
      .then(async (response) => await response.json())
      .then((data) => data);

    if (data.message === "success") {
      toastr.success("Your Task Added Successfull", "Tostar App ");
      await getAllTodos();
      formElement.reset();
    } else {
      console.log(data);
      toastr.error(data.error[0].message, "Inconceivable!");
    }
  } catch (error) {
    console.log(error);
  } finally {
    hideLoading();
  }



}

async function getAllTodos() {
  showLoading();
  try {
    const response = await fetch(
      `https://todos.routemisr.com/api/v1/todos/${apiKey}`
    );

    if (response.ok) {
      const toDoObjest = await response.json();
      if (toDoObjest.message === "success") {
        toDoList = toDoObjest.todos;
        displayToDos();
      } else {
        /// toster
      }
    } else {
      // response.ok === false
    }
  } catch (error) {
    console.log(error);
  } finally {
    hideLoading();
  }
}

function displayToDos() {
  let toDoBox = "";
  for (const toDo of toDoList) {
    toDoBox += `
          <li
            class="d-flex align-items-center justify-content-between border-bottom pb-2 my-4 ">
            <span class="todo-title" onclick="markCompleted('${
              toDo._id
            }')" style="${
      toDo.completed ? "text-decoration: line-through;" : ""
    }"   >${toDo.title}</span>
            <div>
            ${
              toDo.completed
                ? ` <span class="complete-icon pe-2">
                <i class="fa-solid fa-check-double"></i>
              </span>`
                : ""
            }
              <span class="trash-icon"  onclick="deletetoDo('${
                toDo._id
              }')"     >
                <i class="fa-solid fa-trash"></i>
              </span>
            </div>
          </li>

    `;
  }

  document.querySelector("ul").innerHTML = toDoBox;

  changeProgress();
}

async function deletetoDo(id) {
  showLoading();
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const opations = {
          method: "DELETE",
          body: JSON.stringify({ todoId: id }),
          headers: {
            Accept: "application/json",
            "content-type": "application/json",
          },
        };

        const response = await fetch(
          "https://todos.routemisr.com/api/v1/todos",
          opations
        );

        if (response.ok) {
          const toDo = await response.json();
          if (toDo.message === "success") {
            await getAllTodos();
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        hideLoading();
      }
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    }
  });
}

async function markCompleted(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Complete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      showLoading();
      try {
        const opations = {
          method: "PUT",
          body: JSON.stringify({
            todoId: id,
          }),
          headers: {
            Accept: "application/json",
            "content-type": "application/json",
          },
        };

        const response = await fetch(
          "https://todos.routemisr.com/api/v1/todos",
          opations
        );
        if (response.ok) {
          const toDo = await response.json();

          if (toDo.message === "success") {
            await getAllTodos();
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        hideLoading();
      }

      Swal.fire({
        title: "Completed!",
        icon: "success",
      });
    }
  });
}

function showLoading() {
  loadingElement.classList.remove("d-none");
}

function hideLoading() {
  loadingElement.classList.add("d-none");
}




function changeProgress() {
  
    // return completed tasks only
  const completedTaskNumber = toDoList.filter((todo) => todo.completed).length  ; // 5
  const allTaskNumber = toDoList.length;  // 10

  document.getElementById('progress-bar').style.width =`${(completedTaskNumber / allTaskNumber)*100}%`; 
  
 const status =  document.querySelectorAll('.status-progress span'); 
  status[0].innerHTML = completedTaskNumber;
  status[1].innerHTML = allTaskNumber;







}
