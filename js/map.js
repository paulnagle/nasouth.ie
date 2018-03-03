$( window ).load(function() {
	$( "#searchradius-slider" ).slider({
		min: 1,
		max: 99,
		value: 25,
		animate: "fast"
	}).slider("float", { suffix: "kms"});
  
	$( "#searchradius-slider" ).css('background', 'rgb(51,102,153)');
	$( "#slider-range-max .ui-state-default, .ui-widget-content .ui-state-default" ).css( "background", '#eb6864'); 
  
	$( "#searchradius-slider" ).on( "slidestop", function( event, ui ) {
		searchRadius = $( "#searchradius-slider" ).slider( "value" );
		DEBUG && console && console.log("Searchradius = " + searchRadius);
		map.removeLayer(circle);
		circle = L.circle(myLatLng, searchRadius * 1000, {fillOpacity: 0.1});
		circle.addTo(map);
		var circleBounds = new L.LatLngBounds;
		circleBounds = circle.getBounds();
		map.fitBounds(circleBounds); 
		runSearch();		
  } );
});

var DEBUG = false;

// Dont forget to comment all of this
var map = null;
var myLatLng = new L.latLng(53.341318, -6.270205); // Irish Service Office
var circle = null;
var currentLocationMarker = null;
var searchRadius = 25;  // default to 25km
var markerClusterer = null; 
var firstLoad = 1;

var sunCount =0, monCount =0, tueCount = 0, wedCount = 0, thuCount = 0, friCount = 0, satCount = 0;
var sunExpandLi = "";		
var monExpandLi = "";
var tueExpandLi = "";
var wedExpandLi = "";
var thuExpandLi = "";
var friExpandLi = "";
var satExpandLi = "";
		
var format_hover_data = [];

var raw_meeting_json = false;

var naIcon = L.MakiMarkers.icon({
	icon: "star",
	icon: "star",
	color: "#f00",
	size: "l"
});

// https://www.mapbox.com/maki/
// There should only be one of these markers on the map, representing where the meeting search
// is centered.
var markerIcon = L.MakiMarkers.icon({
	icon: "marker",
	color: "#0a0",
	size: "m"
});

function isEmpty(object) { 
	for ( var i in object) { 
		return true; 
	} 
	return false; 
}

function mapInit() {
	getCurrentGPSLocation();
}

// This function creates a new map, adds the Circle, the current location marker and
// then runs a new search.
function newMap() {
	DEBUG && console && console.log("Running newMap()");
	map =  L.map('map_canvas');
	
	map.on('load', function(e) {  // This is called when the map center and zoom are set
		DEBUG && console && console.log("****map load event****");
		
		circle = L.circle(myLatLng, searchRadius * 1000, {fillOpacity: 0.1});
		circle.addTo(map);
		var circleBounds = new L.LatLngBounds;
		circleBounds = circle.getBounds();
		map.fitBounds(circleBounds);  		
	
		currentLocationMarker = new L.marker(myLatLng, {draggable: true, icon: markerIcon}).addTo(map);
		currentLocationMarker.bindPopup("<b>This is where you are searching from. Drag this marker to search in another location. Move the slider below the map to increase the search radius.</b>", {className: 'custom-popup'});
		currentLocationMarker.openPopup();
		currentLocationMarker.on('dragend', function(e){
			myLatLng = e.target.getLatLng();
			circle.setLatLng(myLatLng);
			circleBounds = circle.getBounds();
			map.fitBounds(circleBounds);			
			runSearch(); 
			currentLocationMarker.unbindPopup();
		}); 
		runSearch();  
	});	
	
	document.getElementById("map_canvas").style.height = "425px";

	DEBUG && console && console.log("****Adding tile Layer to Map****");
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
	}).addTo(map);
	
	map.setView(myLatLng, 9); // Create new map 
}

// This function converts a number to a day of the week	
function dayOfWeekAsString(dayIndex) {
	return ["not a day?", "Sun", "Mon","Tue","Wed","Thu","Fri","Sat"][dayIndex];
}
	
// This function uses the browser function to find our current GPS location. If the location
// is found OK, the newMap() function is called with the location.
function getCurrentGPSLocation() {
    DEBUG && console && console.log("****getCurrentGPSLocation()****");
    function success(location) {
		DEBUG && console && console.log("****GPS location found");
		myLatLng = L.latLng(location.coords.latitude, location.coords.longitude);
		newMap();
    }
    function fail(error) {
		DEBUG && console && console.log("****GPS location NOT found");  // Failed to find location, show default map
		newMap();
	}
	// Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
	navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});
}

// This function generates the URL to query the BMLT based on the settings in the Settings Panel
function buildSearchURL () {
	DEBUG && console && console.log("****Running buildSearchURL()****");	
	search_url = "http://www.nasouth.ie/bmlt/main_server/client_interface/json/";
	search_url += "?switcher=GetSearchResults";
	search_url += "&geo_width_km=" + searchRadius;
	search_url += "&long_val=" + myLatLng.lng;
	search_url += "&lat_val=" + myLatLng.lat;
	search_url += "&sort_key=sort_results_by_distance";
	search_url += "&data_field_key=meeting_name,weekday_tinyint,start_time,location_text,location_street,location_info,distance_in_km,latitude,longitude,formats";
	search_url += "&get_used_formats";	
	DEBUG && console && console.log("Search URL = "+ search_url);
}


function processSingleJSONMeetingResult(val) {
	DEBUG && console && console.log("**** 7 ****");				
	markerContent = "<li style='list-style-type: none !important'><h4>" + val.meeting_name + "</h4>";
	markerContent += "<p><i>" + dayOfWeekAsString(val.weekday_tinyint) 
	markerContent += "&nbsp;" + val.start_time.substring(0, 5) + "</i>&nbsp;&nbsp;";
	markerContent += val.location_text + "&nbsp;" + val.location_street + "<br>";
	markerContent += "<i>" + val.location_info + "</i></p>";
			
	fromHere = "'" + myLatLng.lat + ',' + myLatLng.lng + "'";
	toHere   = "'" + val.latitude + ',' + val.longitude + "'";
	markerContent += '<a href="http://maps.google.com/maps?';
	markerContent += '&daddr=' 
	markerContent += val.latitude + ',' + val.longitude;
	markerContent +='">Directions</a></li>';	

	listContent = "<tr>";
	listContent = "<td>" + val.meeting_name + "</td>";
	listContent += "<td>" + dayOfWeekAsString(val.weekday_tinyint) 
	listContent += "&nbsp;" + val.start_time.substring(0, 5) + "</td>";
	listContent += "<td>" + val.location_text + "&nbsp;" + val.location_street + "<br>";
	listContent += "<i>" + val.location_info + "</i></td>";
	listContent += "<td>" + val.formats + "</td>";
	listContent += '<td><a href="http://maps.google.com/maps?daddr=';
	listContent += val.latitude + ',' + val.longitude;
	listContent +='">Directions <span class="glyphicon glyphicon-globe" aria-hidden="true"></span></a></li></td>';
	listContent += "</tr>";			

	switch (val.weekday_tinyint) {
		case "1": sunCount++; sunExpandLi = sunExpandLi + listContent; break;
		case "2": monCount++; monExpandLi = monExpandLi + listContent; break;
		case "3": tueCount++; tueExpandLi = tueExpandLi + listContent; break;
		case "4": wedCount++; wedExpandLi = wedExpandLi + listContent; break;
		case "5": thuCount++; thuExpandLi = thuExpandLi + listContent; break;
		case "6": friCount++; friExpandLi = friExpandLi + listContent; break;
		case "7": satCount++; satExpandLi = satExpandLi + listContent; break;
	}
				
	// Add markers to the markerClusterer Layer
	var aMarker = L.marker([val.latitude, val.longitude], {icon: naIcon});
	aMarker.bindPopup(markerContent, {className: 'custom-popup'});
	markerClusterer.addLayer(aMarker);
}

// This function runs the query to the BMLT and displays the results on the map
function runSearch() {
	DEBUG && console && console.log("****Running runSearch()****");		
	
	sunCount =0, monCount =0, tueCount = 0, wedCount = 0, thuCount = 0, friCount = 0, satCount = 0;
	sunExpandLi = "";		
	monExpandLi = "";
	tueExpandLi = "";
	wedExpandLi = "";
	thuExpandLi = "";
	friExpandLi = "";
	satExpandLi = "";
		
	format_hover_data = [];
	raw_meeting_json = false;
	
	buildSearchURL();
	
	$.getJSON(search_url, function( data) {	
		DEBUG && console && console.log("**** 1 ****");		

		if (markerClusterer) {
			map.removeLayer(markerClusterer);
		}
		DEBUG && console && console.log("**** 2 ****");		

		$("#list-results").empty();
		DEBUG && console && console.log("**** 3 ****");		

		markerClusterer = new L.markerClusterGroup({showCoverageOnHover: false, 
													removeOutsideVisibleBounds: false});	
		DEBUG && console && console.log("**** 4 ****");		
		
		if (!jQuery.isEmptyObject(data.formats)) {
			$.each( data.formats, function( format_key, format_val) {
				DEBUG && console && console.log("**** Some formats returned ****");
				format_hover_data.push(format_val);
			});
		} else {
			DEBUG && console && console.log("**** NO formats returned ****");
			raw_meeting_json = true;
		}
		
		DEBUG && console && console.log("**** 5 ****");		

		var formats_output = "<div class='table-responsive'><table class='table table-bordered table-striped table-condensed'>";
		formats_output += "<thead><tr><th>Abbrev</th><th>Type</th><th>Description</th></tr></thead><tbody>";
		$.each(format_hover_data, function(output_key, output_val) {
			formats_output += "<tr><td>" + output_val.key_string + "</td><td>" + output_val.name_string + "</td><td>";
			formats_output += output_val.description_string + "</td></tr>";
		});
		
		DEBUG && console && console.log("**** 6 ****");		

		formats_output += "</tbody></table></div>";
		document.getElementById("formats_table").innerHTML = formats_output;
		
		if (!jQuery.isEmptyObject(data.meetings)) {
			DEBUG && console && console.log("**** Some meetings were returned ****");
			$.each( data.meetings, function( key, val) {	
				processSingleJSONMeetingResult(val);
			});
		} else {
			if (raw_meeting_json) {   // Only meetings with no formats were returned
				DEBUG && console && console.log("****  ****");	
				$.each( data, function( key, val) {	
					processSingleJSONMeetingResult(val);
				});
			}
			DEBUG && console && console.log("**** NO meetings were returned ****");		
		}

		var result = "<div class='panel-group' id='accordion'>";
		result += "<div class='panel panel-default'><div class='panel-heading accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseOne'><h4 class='panel-title'><a href='#'>NA Meetings on Sunday <span class='badge'>" + sunCount + "</span></a></h4></div>";
		result += "<div id='collapseOne' class='panel-collapse collapse'><div class='panel-body'>";
		result += "<div class='table-responsive'><table class='table table-bordered table-striped'>";
		result += "<thead><tr><th>Meeting Name</th><th>Time</th><th>Location</th><th>Format</th><th>Directions</th></tr></thead><tbody>";		
		result += sunExpandLi;
		result += "</thead></table></div>";
		result += "</div></div></div>";
		
		result += "<div class='panel panel-default'><div class='panel-heading accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseTwo'><h4 class='panel-title'><a href='#'>NA Meetings on Monday  <span class='badge'>" + monCount + "</span></a></h4></div>";
		result += "<div id='collapseTwo' class='panel-collapse collapse'><div class='panel-body'>";	
		result += "<div class='table-responsive'><table class='table table-bordered table-striped'>";
		result += "<thead><tr><th>Meeting Name</th><th>Time</th><th>Location</th><th>Format</th><th>Directions</th></tr></thead><tbody>";		
		result += monExpandLi;
		result += "</thead></table></div>";
		result += "</div></div></div>";

		result += "<div class='panel panel-default'><div class='panel-heading accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseThree'><h4 class='panel-title'><a href='#'>NA Meetings on Tuesday  <span class='badge'>" + tueCount + "</span></a></h4></div>";
		result += "<div id='collapseThree' class='panel-collapse collapse'><div class='panel-body'>";
		result += "<div class='table-responsive'><table class='table table-bordered table-striped'>";	
		result += "<thead><tr><th>Meeting Name</th><th>Time</th><th>Location</th><th>Format</th><th>Directions</th></tr></thead><tbody>";				
		result += tueExpandLi;
		result += "</thead></table></div>";
		result += "</div></div></div>";		

		result += "<div class='panel panel-default'><div class='panel-heading accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseFour'><h4 class='panel-title'><a href='#'>NA Meetings on Wednesday  <span class='badge'>" + wedCount + "</span></a></h4></div>";
		result += "<div id='collapseFour' class='panel-collapse collapse'><div class='panel-body'>";
		result += "<div class='table-responsive'><table class='table table-bordered table-striped'>";	
		result += "<thead><tr><th>Meeting Name</th><th>Time</th><th>Location</th><th>Format</th><th>Directions</th></tr></thead><tbody>";				
		result += wedExpandLi;
		result += "</thead></table></div>";
		result += "</div></div></div>";

		result += "<div class='panel panel-default'><div class='panel-heading accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseFive'><h4 class='panel-title'><a href='#'>NA Meetings on Thursday <span class='badge'>" + thuCount + "</span></a></h4></div>";
		result += "<div id='collapseFive' class='panel-collapse collapse'><div class='panel-body'>";
		result += "<div class='table-responsive'><table class='table table-bordered table-striped'>";
		result += "<thead><tr><th>Meeting Name</th><th>Time</th><th>Location</th><th>Format</th><th>Directions</th></tr></thead><tbody>";				
		result += thuExpandLi;
		result += "</thead></table></div>";		
		result += "</div></div></div>";

		result += "<div class='panel panel-default'><div class='panel-heading accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseSix'><h4 class='panel-title'><a href='#'>NA Meetings on Friday <span class='badge'>" + friCount + "</span></a></h4></div>";
		result += "<div id='collapseSix' class='panel-collapse collapse'><div class='panel-body'>";	
		result += "<div class='table-responsive'><table class='table table-bordered table-striped'>";	
		result += "<thead><tr><th>Meeting Name</th><th>Time</th><th>Location</th><th>Format</th><th>Directions</th></tr></thead><tbody>";				
		result += friExpandLi;
		result += "</thead></table></div>";
		result += "</div></div></div>";		

		result += "<div class='panel panel-default'><div class='panel-heading accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseSeven'><h4 class='panel-title'><a href='#'>NA Meetings on Saturday <span class='badge'>" + satCount + "</span></a></h4></div>";
		result += "<div id='collapseSeven' class='panel-collapse collapse'><div class='panel-body'>";
		result += "<div class='table-responsive'><table class='table table-bordered table-striped'>";
		result += "<thead><tr><th>Meeting Name</th><th>Time</th><th>Location</th><th>Format</th><th>Directions</th></tr></thead><tbody>";				
		result += satExpandLi;
		result += "</thead></table></div>";
		result += "</div></div></div>";	
		
		result += "</div>";
		document.getElementById("list_result").innerHTML = result;

		map.addLayer(markerClusterer);	
	});
}


