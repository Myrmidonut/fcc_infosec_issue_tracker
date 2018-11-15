const submitIssueTest = document.getElementById("submitIssueTest");
const updateIssueTest = document.getElementById("updateIssueTest");
const deleteIssueTest = document.getElementById("deleteIssueTest");
const jsonResult = document.getElementById("jsonResult");
const submitStatus = document.getElementById("submitStatus");
const updateStatus = document.getElementById("updateStatus");
const deleteStatus = document.getElementById("deleteStatus");

const openProjectField = document.getElementById("openProjectField");
const openProjectButton = document.getElementById("openProjectButton");
const openAllProjectsButton = document.getElementById("openAllProjectsButton");
const projectsList = document.getElementById("projectsList");

const apitestUrl = "/api/issues/apitest";

openProjectButton.addEventListener("click", e => {
  e.preventDefault();
  
  if (openProjectField.value !== "") {
    window.location.pathname = `/${openProjectField.value}`;
  }
})

openAllProjectsButton.addEventListener("click", e => {
  e.preventDefault();
  
  openAllProjectsButton.textContent = "Loading..."
  
  const url = "/api/issues";
  let projects;
  
  if (projectsList.innerHTML === "") {
    fetch(url)
    .then(response => response.json())
    .then(data => {
      projectsList.innerHTML = "<h3>Projects:</h3>";
      data.forEach(e => {
        projectsList.innerHTML += `<li class="projectLink" id="${e}">${e}</li>`
      })
      
      openAllProjectsButton.textContent = "Hide all projects";
      projects = projectsList.innerHMTL;
    })
    .then(() => {
      const projectLink = document.querySelectorAll(".projectLink");
      
      projectLink.forEach(e => {
        e.addEventListener("click", () => {
          window.location.pathname = `/${e.id}`;
        })
      })
    })
    .catch(error => {
      console.log(error);
    })
  } else {
    openAllProjectsButton.textContent = "Show all projects";
    projectsList.innerHTML = "";
  }
})

submitIssueTest.addEventListener("submit", e => {
  submitStatus.textContent = "";
  
  e.preventDefault();
  
  fetch(apitestUrl, {
    method: "post",
    body: new URLSearchParams(new FormData(submitIssueTest))
  })
  .then(response => response.text())
  .then(data => {
    if (data === "missing inputs") {
      jsonResult.textContent = data;
      submitStatus.textContent = "Failure!"
    } else {
      jsonResult.textContent = data;
      submitStatus.textContent = "Success!"
    }
  })
  .catch(error => {
    console.log(error);
  })
})

updateIssueTest.addEventListener("submit", e => {
  updateStatus.textContent = "";
  
  e.preventDefault();
  
  fetch(apitestUrl, {
    method: "put",
    body: new URLSearchParams(new FormData(updateIssueTest))
  })
  .then(response => response.text())
  .then(data => {
    if (data === "no updated field sent" || data.includes("could not update ")) {
      jsonResult.textContent = data;
      updateStatus.textContent = "Failure!"
    } else {
      jsonResult.textContent = data;
      updateStatus.textContent = "Success!"
    }
  })
  .catch(error => {
    console.log(error);
  })
})

deleteIssueTest.addEventListener("submit", e => {
  deleteStatus.textContent = "";
  
  e.preventDefault();
  
  fetch(apitestUrl, {
    method: "delete",
    body: new URLSearchParams(new FormData(deleteIssueTest))
  })
  .then(response => response.text())
  .then(data => {
    console.log(data)
    if (data.includes("could not delete ") || data === "_id error" || "not found") {
      jsonResult.textContent = data;
      deleteStatus.textContent = "Failure!"
    } else {
      jsonResult.textContent = data;
      deleteStatus.textContent = "Success!"
    }
  })
  .catch(error => {
    console.log(error);
  })
})