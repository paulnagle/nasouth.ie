
// This function converts a number to a day of the week	
function dayOfWeekAsString(dayIndex) {
	return ["not a day?", "Sun", "Mon","Tue","Wed","Thu","Fri","Sat"][dayIndex];
}
// This function runs the query to the BMLT and displays the results on the map
function runSearchDay() {
	console.log("****Running buildSearchURL()****");	
	var search_url = "http://www.nasouth.ie/bmlt/main_server/client_interface/json/";
	search_url += "?switcher=GetSearchResults";
	search_url += "&services=2";
	search_url += "&data_field_key=meeting_name,weekday_tinyint,start_time,location_text,location_street,location_info,location_sub_province,distance_in_km,latitude,longitude,formats";	
	search_url += "&get_used_formats";
	console.log("Search URL = "+ search_url);
	console.log("****Running runSearch()****");		
	
	var sunCount = 0, monCount = 0, tueCount = 0, wedCount = 0, thuCount = 0, friCount = 0, satCount = 0;
	
	$.getJSON(search_url, function( data) {	
		var sunExpandLi = "";		
		var monExpandLi = "";
		var tueExpandLi = "";
		var wedExpandLi = "";
		var thuExpandLi = "";
		var friExpandLi = "";
		var satExpandLi = "";
		
		var format_hover_data = [];
		
		$.each( data.formats, function( format_key, format_val) {
			format_hover_data.push(format_val);
		});
		
		var formats_output = "<div class='table-responsive'><table class='table table-bordered table-striped table-condensed'>";
		formats_output += "<thead><tr><th>Abbrev</th><th>Type</th><th>Description</th></tr></thead><tbody>";
		$.each(format_hover_data, function(output_key, output_val) {
			formats_output += "<tr><td>" + output_val.key_string + "</td><td>" + output_val.name_string + "</td><td>";
			formats_output += output_val.description_string + "</td></tr>";
		});
		formats_output += "</tbody></table></div>";
		document.getElementById("formats_table").innerHTML = formats_output;
		
		$.each( data.meetings, function( key, val) {

			markerContent = "<tr>";
			markerContent += "<td>" + val.meeting_name + "</td>";
			markerContent += "<td>" + dayOfWeekAsString(val.weekday_tinyint) 
			markerContent += "&nbsp;" + val.start_time.substring(0, 5) + "</td>";
			markerContent += "<td>" + val.location_text + "&nbsp;" + val.location_street + "<br>";
			markerContent += "<i>" + val.location_info + "</i></td>";
			markerContent += "<td>" + val.formats + "</td>";
			markerContent += '<td><a href="http://maps.google.com/maps?daddr=';
			markerContent += val.latitude + ',' + val.longitude;
			markerContent +='">Directions <span class="glyphicon glyphicon-globe" aria-hidden="true"></span></a></li></td>';
			markerContent += "</tr>";			

			switch (val.weekday_tinyint) {
				case "1": sunExpandLi = sunExpandLi + markerContent; sunCount++; break;
				case "2": monExpandLi = monExpandLi + markerContent; monCount++; break;
				case "3": tueExpandLi = tueExpandLi + markerContent; tueCount++; break;
				case "4": wedExpandLi = wedExpandLi + markerContent; wedCount++; break;
				case "5": thuExpandLi = thuExpandLi + markerContent; thuCount++; break;
				case "6": friExpandLi = friExpandLi + markerContent; friCount++; break;
				case "7": satExpandLi = satExpandLi + markerContent; satCount++; break;
			}
				
		});

		var result = "<div class='panel-group' id='accordion'>";
		result += "<div class='panel panel-default'><div class='panel-heading accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseOne'><h4 class='panel-title'><a href='#'>NA Meetings on Sunday  <span class='badge'>" + sunCount + "</span></a></h4></div>";
		result += "<div id='collapseOne' class='panel-collapse collapse'><div class='panel-body'>";
		result += "<div class='table-responsive'><table class='table table-bordered table-striped'>";	
		result += "<thead><tr><th>Meeting Name</th><th>Time</th><th>Location</th><th>Format</th><th>Directions</th></tr></thead><tbody>";		
		result += sunExpandLi;
		result += "</tbody></table></div>";
		result += "</div></div></div>";
		
		result += "<div class='panel panel-default'><div class='panel-heading accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseTwo'><h4 class='panel-title'><a href='#'>NA Meetings on Monday  <span class='badge'>" + monCount + "</span></a></h4></div>";
		result += "<div id='collapseTwo' class='panel-collapse collapse'><div class='panel-body'>";	
		result += "<div class='table-responsive'><table class='table table-bordered table-striped'>";
		result += "<thead><tr><th>Meeting Name</th><th>Time</th><th>Location</th><th>Format</th><th>Directions</th></tr></thead><tbody>";		
		result += monExpandLi;
		result += "</tbody></table></div>";
		result += "</div></div></div>";

		result += "<div class='panel panel-default'><div class='panel-heading accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseThree'><h4 class='panel-title'><a href='#'>NA Meetings on Tuesday  <span class='badge'>" + tueCount + "</span></a></h4></div>";
		result += "<div id='collapseThree' class='panel-collapse collapse'><div class='panel-body'>";
		result += "<div class='table-responsive'><table class='table table-bordered table-striped'>";
		result += "<thead><tr><th>Meeting Name</th><th>Time</th><th>Location</th><th>Format</th><th>Directions</th></tr></thead><tbody>";		
		result += tueExpandLi;
		result += "</tbody></table></div>";
		result += "</div></div></div>";		

		result += "<div class='panel panel-default'><div class='panel-heading accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseFour'><h4 class='panel-title'><a href='#'>NA Meetings on Wednesday  <span class='badge'>" + wedCount + "</span></a></h4></div>";
		result += "<div id='collapseFour' class='panel-collapse collapse'><div class='panel-body'>";
		result += "<div class='table-responsive'><table class='table table-bordered table-striped'>";	
		result += "<thead><tr><th>Meeting Name</th><th>Time</th><th>Location</th><th>Format</th><th>Directions</th></tr></thead><tbody>";		
		result += wedExpandLi;
		result += "</tbody></table></div>";
		result += "</div></div></div>";

		result += "<div class='panel panel-default'><div class='panel-heading accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseFive'><h4 class='panel-title'><a href='#'>NA Meetings on Thursday  <span class='badge'>" + thuCount + "</span></a></h4></div>";
		result += "<div id='collapseFive' class='panel-collapse collapse'><div class='panel-body'>";
		result += "<div class='table-responsive'><table class='table table-bordered table-striped'>";	
		result += "<thead><tr><th>Meeting Name</th><th>Time</th><th>Location</th><th>Format</th><th>Directions</th></tr></thead><tbody>";		
		result += thuExpandLi;
		result += "</tbody></table></div>";		
		result += "</div></div></div>";

		result += "<div class='panel panel-default'><div class='panel-heading accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseSix'><h4 class='panel-title'><a href='#'>NA Meetings on Friday  <span class='badge'>" + friCount + "</span></a></h4></div>";
		result += "<div id='collapseSix' class='panel-collapse collapse'><div class='panel-body'>";	
		result += "<div class='table-responsive'><table class='table table-bordered table-striped'>";	
		result += "<thead><tr><th>Meeting Name</th><th>Time</th><th>Location</th><th>Format</th><th>Directions</th></tr></thead><tbody>";
		result += friExpandLi;
		result += "</tbody></table></div>";
		result += "</div></div></div>";		

		result += "<div class='panel panel-default'><div class='panel-heading accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseSeven'><h4 class='panel-title'><a href='#'>NA Meetings on Saturday  <span class='badge'>" + satCount + "</span></a></h4></div>";
		result += "<div id='collapseSeven' class='panel-collapse collapse'><div class='panel-body'>";
		result += "<div class='table-responsive'><table class='table table-bordered table-striped'>";
		result += "<thead><tr><th>Meeting Name</th><th>Time</th><th>Location</th><th>Format</th><th>Directions</th></tr></thead><tbody>";		
		result += satExpandLi;
		result += "</tbody></table></div>";
		result += "</div></div></div>";	
		
		result += "</div>";
		document.getElementById("county-results").innerHTML = result;

	});
}

// This function runs the query to the BMLT and displays the results on the map
function runSearchCounty() {
	console.log("****Running buildSearchURL()****");	
	var search_url = "http://www.nasouth.ie/bmlt/main_server/client_interface/json/";
	search_url += "?switcher=GetSearchResults";
	search_url += "&services=2";
	search_url += "&data_field_key=meeting_name,weekday_tinyint,start_time,location_text,location_street,location_info,location_sub_province,distance_in_km,latitude,longitude,formats";	
	search_url += "&get_used_formats";
	console.log("Search URL = "+ search_url);
	console.log("****Running runSearch()****");		
	
	var CorkCount = 0, KerryCount = 0, LimerickCount = 0, ClareCount = 0, WaterfordCount = 0, TipperaryCount = 0;
	
	$.getJSON(search_url, function( data) {	

		var CorkExpandLi = "";		
		var KerryExpandLi = "";
		var LimerickExpandLi = "";
		var ClareExpandLi = "";
		var WaterfordExpandLi = "";
		var TipperaryExpandLi = "";

		var format_hover_data = [];
		
		$.each( data.formats, function( format_key, format_val) {
			format_hover_data.push(format_val);
		});
		
		var formats_output = "<div class='table-responsive'><table class='table table-bordered table-striped'>";
		formats_output += "<thead><tr><th>Abbrev</th><th>Type</th><th>Description</th></tr></thead><tbody>";
		$.each(format_hover_data, function(output_key, output_val) {
			formats_output += "<tr><td>" + output_val.key_string + "</td><td>" + output_val.name_string + "</td><td>";
			formats_output += output_val.description_string + "</td></tr>";
		});
		formats_output += "</tbody></table></div>";
		document.getElementById("formats_table").innerHTML = formats_output;
		
		$.each( data.meetings, function( key, val) {
			markerContent = "<tr>";
			markerContent += "<td>" + val.meeting_name + "</td>";
			markerContent += "<td>" + dayOfWeekAsString(val.weekday_tinyint) 
			markerContent += "&nbsp;" + val.start_time.substring(0, 5) + "</td>";
			markerContent += "<td>" + val.location_text + "&nbsp;" + val.location_street + "<br>";
			markerContent += "<i>" + val.location_info + "</i></td>";
			markerContent += "<td>" + val.formats + "</td>";
			markerContent += '<td><a href="http://maps.google.com/maps?daddr=';
			markerContent += val.latitude + ',' + val.longitude;
			markerContent +='">Directions <span class="glyphicon glyphicon-globe" aria-hidden="true"></span></a></li></td>';
			markerContent += "</tr>";

			switch (val.location_sub_province) {
				case "Cork":      CorkCount++; CorkExpandLi = CorkExpandLi + markerContent; break;
				case "Kerry":     KerryCount++; KerryExpandLi = KerryExpandLi + markerContent; break;
				case "Limerick":  LimerickCount++; LimerickExpandLi = LimerickExpandLi + markerContent; break;
				case "Clare":     ClareCount++; ClareExpandLi = ClareExpandLi + markerContent; break;
				case "Waterford": WaterfordCount++; WaterfordExpandLi = WaterfordExpandLi + markerContent; break;
				case "Tipperary": TipperaryCount++; TipperaryExpandLi = TipperaryExpandLi + markerContent; break;
			}
				
		});

		var result = "<div class='panel-group' id='accordion'>";
		result += "<div class='panel panel-default'><div class='panel-heading accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseOne'><h4 class='panel-title'><a href='#'>NA Meetings in Cork <span class='badge'>" + CorkCount + "</span></a></h4></div>";
		result += "<div id='collapseOne' class='panel-collapse collapse'><div class='panel-body'>";
		result += "<div class='table-responsive'><table class='table table-bordered table-striped'>";
		result += "<thead><tr><th>Meeting Name</th><th>Time</th><th>Location</th><th>Format</th><th>Directions</th></tr></thead><tbody>";
		result += CorkExpandLi;
		result += "</tbody></table></div>";
		result += "</div></div></div>";
		
		result += "<div class='panel panel-default'><div class='panel-heading accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseTwo'><h4 class='panel-title'><a href='#'>NA Meetings in Kerry <span class='badge'>" + KerryCount + "</span></a></h4></div>";
		result += "<div id='collapseTwo' class='panel-collapse collapse'><div class='panel-body'>";	
		result += "<div class='table-responsive'><table class='table table-bordered table-striped'>";	
		result += "<thead><tr><th>Meeting Name</th><th>Time</th><th>Location</th><th>Format</th><th>Directions</th></tr></thead><tbody>";		
		result += KerryExpandLi;
		result += "</tbody></table></div>";
		result += "</div></div></div>";

		result += "<div class='panel panel-default'><div class='panel-heading accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseThree'><h4 class='panel-title'><a href='#'>NA Meetings in Limerick <span class='badge'>" + LimerickCount + "</span></a></h4></div>";
		result += "<div id='collapseThree' class='panel-collapse collapse'><div class='panel-body'>";
		result += "<div class='table-responsive'><table class='table table-bordered table-striped'>";	
		result += "<thead><tr><th>Meeting Name</th><th>Time</th><th>Location</th><th>Format</th><th>Directions</th></tr></thead><tbody>";		
		result += LimerickExpandLi;
		result += "</tbody></table></div>";
		result += "</div></div></div>";		

		result += "<div class='panel panel-default'><div class='panel-heading accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseFour'><h4 class='panel-title'><a href='#'>NA Meetings in Clare <span class='badge'>" + ClareCount + "</span></a></h4></div>";
		result += "<div id='collapseFour' class='panel-collapse collapse'><div class='panel-body'>";
		result += "<div class='table-responsive'><table class='table table-bordered table-striped'>";
		result += "<thead><tr><th>Meeting Name</th><th>Time</th><th>Location</th><th>Format</th><th>Directions</th></tr></thead><tbody>";		
		result += ClareExpandLi;
		result += "</tbody></table></div>";
		result += "</div></div></div>";

		result += "<div class='panel panel-default'><div class='panel-heading accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseFive'><h4 class='panel-title'><a href='#'>NA Meetings in Waterford <span class='badge'>" + WaterfordCount + "</span></a></h4></div>";
		result += "<div id='collapseFive' class='panel-collapse collapse'><div class='panel-body'>";	
		result += "<div class='table-responsive'><table class='table table-bordered table-striped'>";	
		result += "<thead><tr><th>Meeting Name</th><th>Time</th><th>Location</th><th>Format</th><th>Directions</th></tr></thead><tbody>";		
		result += WaterfordExpandLi;	
		result += "</tbody></table></div>";
		result += "</div></div></div>";

		result += "<div class='panel panel-default'><div class='panel-heading accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseSix'><h4 class='panel-title'><a href='#'>NA Meetings in Tipperary <span class='badge'>" + TipperaryCount + "</span></a></h4></div>";
		result += "<div id='collapseSix' class='panel-collapse collapse'><div class='panel-body'>";	
		result += "<div class='table-responsive'><table class='table table-bordered table-striped'>";	
		result += "<thead><tr><th>Meeting Name</th><th>Time</th><th>Location</th><th>Format</th><th>Directions</th></tr></thead><tbody>";		
		result += TipperaryExpandLi;
		result += "</tbody></table></div>";
		result += "</div></div></div>";		
		
		result += "</div>";
		document.getElementById("county-results").innerHTML = result;

	});

}