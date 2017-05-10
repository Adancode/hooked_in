//when the document is ready, we will populate the dashboard with information
$(document).ready(function() {
	$.ajax({
		url: '/api/users',
		method: 'GET'
	}).done(function(data) {
		// loop through DB to create rows for all users with their information
		for (var i = 0; i < data.length; i++) {
			var rows_area = $("<div class='individual-result row' data-toggle='modal' data-target='#myModal'>");
			rows_area.attr("id", "user_row" + i);
			$("#results-section").append(rows_area);
			
      //dynamically create each row here, including the picture, name, location, and cohort
        $("#user_row" + i).attr("id", i).append(

          "<div class='col-xs-3 text-center'>" +
            "<img src = '" + data[i].profilePic + "'class='results-image'/>"+
          "</div>"+
          "<div class='col-xs-7' id='searchDiv'>"+
            "<span id='firstname'>" + data[i].firstname + "</span><span id='lastname'> " + data[i].lastname + "</span>"+
            "<h4 id='results-company'>Google</h4>"+
            "<hr id='results-hr'/>" +
            "<p id='location'>"+"<span id='city'>" + data[i].city + "</span>,<span id='state'> " + data[i].state + "</span>"+
            "<p id='cohort'>" + data[i].cohort + "</p>"+
          "</div>"+
          "<div class='col-xs-2 text-right'>"+
            "<div id='employed'>" +
              "<i class='fa fa-briefcase fa-2x' aria-hidden='true'></i>"+
              "<p id='employment-text'>Hired</p>"+
            "</div>"+
          "</div>"
        )}//end of for loop

		// click event to populate the modal
		$("div.individual-result").on("click", function(){
			var resultId = $(this).attr('id');
			console.log(resultId);
			console.log(data[resultId].firstname);
			$(".modal-profile-image").attr("src","").attr("src", data[resultId].profilePic);
			$(".modal-name").html("").html(data[resultId].firstname + " " + data[resultId].lastname);
			$(".modal-employer").html("").html(data[resultId].employer);
			$(".modal-cohort").html("").html(data[resultId].cohort);
			$(".modal-email").html("").html(data[resultId].email);
			$(".modal-city").html("").html(data[resultId].city+", "+data[resultId].state);
			$(".modal-mentor").html("").html(data[resultId].mentor);
			$(".modal-linkedin").attr("href","").attr("href", data[resultId].linkedInURL);
			$(".modal-profile").attr("href","").attr("href", data[resultId].portfolioURL);
		})
	}); // done users api call
	$.ajax({
		url: '/api/currentUser',
		method: "GET"
	}).done(function(data) {
		//add logged-in user data to the left panel on the dashboard 
		$(".user-fullname").html(data.firstname + " " + data.lastname);
		$(".user-city").html("Location: " + data.city + ", "+ data.state);
		$(".user-cohort").html("Graduation: " + data.cohort);
		$(".user-linkedin").html("Linkedin Profile: " + data.linkedInURL);
		$(".user-profile").html("Profile: " + data.portfolioURL);
		$(".profile-image").html("<img src = '" + data.profilePic + "' height = 200px width = 200px/>");
	});



}); // end of document ready