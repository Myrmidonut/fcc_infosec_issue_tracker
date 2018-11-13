$(function() {
  var currentProject = window.location.pathname.replace(/\//g, "");;
  var url = "/api/issues/"+currentProject;

  $('#projectTitle').text('All issues for: '+currentProject)
  $.ajax({
    type: "GET",
    url: url,
    success: function(data)
    {
      var issues= [];

      data.forEach(function(ele) {
        var openstatus;
        (ele.open) ? openstatus = 'open' : openstatus = 'closed';

        var single = [
          '<div class="issue '+openstatus+'">',
          '<h3>'+ele.issue_title+' -  ('+openstatus+')</h3>',
          '<br>',
          '<p><b>Text: </b>'+ele.issue_text+'</p>',
          '<p><b>Status: </b>'+ele.status_text+'</p>',
          '<br>',
          '<p class="id"><b>id: </b>'+ele._id+'</p>',
          '<p class="id"><b>Created by:</b> '+ele.created_by+'<br><b>Assigned to:</b> '+ele.assigned_to,
          '<p class="id"><b>Created on:</b> '+ele.created_on+'<br><b>Last updated:</b> '+ele.updated_on,
          '<br><a href="#" class="closeIssue" id="'+ele._id+'">Close?</a><br><a href="#" class="deleteIssue" id="'+ele._id+'">Delete?</a>',
          '</div>',
          '<hr>'
        ];

        issues.push(single.join(''));
      });

      $('#issueDisplay').html(issues.join(''));
    }
  });
  
  
  
  
  
  $('#newIssue').submit(function(e){
    e.preventDefault();
    $(this).attr('action', "/api/issues/" + currentProject);
    $.ajax({
      type: "POST",
      url: url,
      data: $(this).serialize(),
      success: function(data) { window.location.reload(true); }
    });
  });

  $('#issueDisplay').on('click','.closeIssue', function(e) {
    var url = "/api/issues/"+currentProject;
    $.ajax({
      type: "PUT",
      url: url,
      data: {_id: $(this).attr('id'), open: false},
      success: function(data) { alert(data); window.location.reload(true); }
    });
    e.preventDefault();
  });

  $('#issueDisplay').on('click','.deleteIssue', function(e) {
    var url = "/api/issues/"+currentProject;
    $.ajax({
      type: "DELETE",
      url: url,
      data: {_id: $(this).attr('id')},
      success: function(data) { alert(data); window.location.reload(true); }
    });
    e.preventDefault();
  });
  
  
  
  
  
});