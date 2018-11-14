const currentProject = window.location.pathname.replace(/\//g, "");;
const projectTitle = document.getElementById("projectTitle");
const url = `/api/issues/${currentProject}`;

projectTitle.textContent = `All issues for: ${currentProject}`

getIssues();

function getIssues() {
  fetch(url)
  .then(response => response.json())
  .then(data => {
    let issues= [];
    
    data.forEach(e => {
      let openstatus;

      (e.open) ? openstatus = "open" : openstatus = "closed";

      const single = [
        '<div class="issue ' + openstatus + '">',
        '<h3>' + e.issue_title + ' -  (' + openstatus + ')</h3>',
        '<br>',
        '<p><b>Text: </b>' + e.issue_text + '</p>',
        '<p><b>Status: </b>' + e.status_text + '</p>',
        '<br>',
        '<p class="id"><b>id: </b>' + e._id + '</p>',
        '<p class="id"><b>Created by:</b> ' + e.created_by + '<br><b>Assigned to:</b> ' + e.assigned_to,
        '<p class="id"><b>Created on:</b> ' + e.created_on + '<br><b>Last updated:</b> ' + e.updated_on,
        '<button class="closeIssue" id="' + e._id + '">Close</button>',
        '<button class="deleteIssue" id="' + e._id + '">Delete</button>',
        '</div>'
      ];

      issues.push(single.join(""));
    });

    const issueDisplay = document.getElementById("issueDisplay");

    issueDisplay.innerHTML = issues.join("");
  })
  .then(() => {
    closeIssue();
    deleteIssue();
  })
}

const newIssue = document.getElementById("newIssue");

newIssue.addEventListener("submit", e => {
  e.preventDefault();
  
  fetch(url, {
    method: "post",
    body: new URLSearchParams(new FormData(newIssue))
  })
  .then(response => response.json())
  .then(data => {
    newIssue.reset();
    getIssues();
  })
})

function closeIssue() {
  const closeIssue = document.querySelectorAll(".closeIssue")

  closeIssue.forEach(e => {
    e.addEventListener("click", f => {
      f.preventDefault();
      
      fetch(url, {
        method: "put",
        body: JSON.stringify({_id: e.id, open: false}),
        headers: {"Content-type": "application/json"}
      })
      .then(response => response.text())
      .then(data => {
        getIssues();
      })
    })
  })
}

function deleteIssue() {
  const deleteIssue = document.querySelectorAll(".deleteIssue")

  deleteIssue.forEach(e => {
    e.addEventListener("click", f => {
      f.preventDefault();
      
      fetch(url, {
        method: "delete",
        body: JSON.stringify({_id: e.id}),
        headers: {"Content-type": "application/json"}
      })
      .then(response => response.text())
      .then(data => {
        getIssues();
      })
    })
  })
}