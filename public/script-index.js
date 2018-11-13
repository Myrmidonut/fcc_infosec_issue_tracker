const submitForm = document.getElementById("submitForm");
const updateForm = document.getElementById("updateForm");
const deleteForm = document.getElementById("deleteForm");
const jsonResult = document.getElementById("jsonResult");
const submitStatus = document.getElementById("submitStatus");
const updateStatus = document.getElementById("updateStatus");
const deleteStatus = document.getElementById("deleteStatus");

const url = "/api/issues/apitest";

submitForm.addEventListener("submit", e => {
  submitStatus.textContent = "";
  
  e.preventDefault();
  
  fetch(url, {
    method: 'post',
    body: new URLSearchParams(new FormData(submitForm))
  })
  .then(response => response.text())
  .then(data => {
    if (data === "missing inputs") {
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

updateForm.addEventListener("submit", e => {
  updateStatus.textContent = "";
  
  e.preventDefault();
  
  fetch(url, {
    method: 'put',
    body: new URLSearchParams(new FormData(updateForm))
  })
  .then(response => response.text())
  .then(data => {
    if (data === "no updated field sent" || data.includes("could not update ")) {
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

deleteForm.addEventListener("submit", e => {
  deleteStatus.textContent = "";
  
  e.preventDefault();
  
  fetch(url, {
    method: 'delete',
    body: new URLSearchParams(new FormData(deleteForm))
  })
  .then(response => response.text())
  .then(data => {
    if (data.includes("could not delete ") || data === "_id error") {
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