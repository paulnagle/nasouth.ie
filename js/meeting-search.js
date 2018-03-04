
openTable  = "<div class='table-responsive'><table class='table table-bordered table-striped'><thead><tr><th>Meeting Name</th><th>Time</th><th>Location</th><th>Format</th><th>Directions</th></tr></thead><tbody>";
closeTable = "</tbody></table></div></div>";


function drawNavigation() {
	var navOutput = "<nav class='navbar navbar-expand-md navbar-dark fixed-top' style='background-color: #336699;'>";
  navOutput += " <a class='navbar-brand' href='index.html'>NA Southern Area of Ireland</a>";
  navOutput += " <button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarCollapse' aria-controls='navbarCollapse' aria-expanded='false' aria-label='Toggle navigation'>";
  navOutput += " <span class='navbar-toggler-icon'></span>";
  navOutput += " </button>";
  navOutput += " <div class='collapse navbar-collapse' id='navbarCollapse'>";
  navOutput += " <ul class='nav navbar-nav'>";
  navOutput += " <li class='nav-item'><a  class='nav-link' href='index.html'>Welcome</a></li>";
  navOutput += " <li class='nav-item dropdown'>";
  navOutput += " <a class='nav-link dropdown-toggle' href='#' id='navbarDropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
  navOutput += " Find a Meeting";
  navOutput += " </a>";
  navOutput += " <div class='dropdown-menu' aria-labelledby='navbarDropdown'>";
  navOutput += " <a class='dropdown-item' href='searchbyday.html'>Search By Day</a>";
  navOutput += " <a class='dropdown-item' href='searchbymap.html'>Search By Map</a>";
  navOutput += " <a class='dropdown-item' href='searchbycounty.html'>Search By County</a>";
  navOutput += " </div>";
  navOutput += " </li>";
  navOutput += " <li class='nav-item'><a class='nav-link' href='events.html'>Events & Fundraisers</a></li>";
  navOutput += " <li class='nav-item'><a class='nav-link' href='usefullinks.html'>Useful Links</a></li>";
  navOutput += " <li class='nav-item'><a class='nav-link' href='forprofessionals.html'>For Professionals</a></li>";
  navOutput += " <li class='nav-item'><a class='nav-link' href='history.html'>History</a></li>";
  navOutput += " <li class='nav-item'><a class='nav-link' href='sasc.html'>SASC</a></li>";
  navOutput += " </ul>";
  navOutput += " </div>";
  navOutput += " </nav>";

	document.getElementById("nav_holder").innerHTML = navOutput;
}

function drawLinkCards() {
	var linkCardsoutput = "<div class='row'>";
	linkCardsoutput += "  <div class='col-sm'>";
	linkCardsoutput += "    <div class='card'>";
	linkCardsoutput += "      <div class='card-header'>";
	linkCardsoutput += "        <h3 class='card-title'>iPhone / iPad App</h3>";
	linkCardsoutput += "      </div>";
	linkCardsoutput += "      <div class='card-body'>";
	linkCardsoutput += "        We have an app for iPhones and iPads available.<br>";
	linkCardsoutput += "        <a href='https://itunes.apple.com/app/narcotics-anonymous-ireland/id1084048094'>";
	linkCardsoutput += "        <img src='img/apple.png' class='img-responsive' alt='NA Ireland iPhone iPad App' /> </a>";
	linkCardsoutput += "      </div>";
	linkCardsoutput += "    </div>";
	linkCardsoutput += "  </div>";

	linkCardsoutput += "  <div class='col-sm'>";
	linkCardsoutput += "    <div class='card'>";
	linkCardsoutput += "     <div class='card-header'>";
	linkCardsoutput += "       <h3 class='card-title'>Android App</h3>";
	linkCardsoutput += "      </div>";
	linkCardsoutput += "      <div class='card-body'>";
	linkCardsoutput += "        We also have an app available for Android tablets and phones<br>";
	linkCardsoutput += "        <a href='https://play.google.com/store/apps/details?id=ie.nasouth.android.naireland'>";
	linkCardsoutput += "        <img src='img/android.png' class='img-responsive' alt='NA Ireland Android App' /> </a>";
	linkCardsoutput += "      </div>";
	linkCardsoutput += "    </div>";
	linkCardsoutput += "  </div>";

	linkCardsoutput += "  <div class='col-sm'>";
	linkCardsoutput += "   <div class='card'>";
	linkCardsoutput += "     <div class='card-header'>";
	linkCardsoutput += "     <h3 class='card-title'>Printable Meeting Lists</h3>";
	linkCardsoutput += "     </div>";
	linkCardsoutput += "     <div class='card-body'>";
	linkCardsoutput += "       <p>Southern Area printable";
	linkCardsoutput += "       <a href='http://nasouth.ie/meetingslist/?current-meeting-list=1' oncontextmenu='return false;'> Meetings List PDF.</a></p>";
	linkCardsoutput += "       <p>Irish Region printable <a href='http://www.na-ireland.org/?current-meeting-list=1' oncontextmenu='return false;'> Meetings List PDF. </a></p>";
	linkCardsoutput += "     </div>";
	linkCardsoutput += "   </div>";
	linkCardsoutput += "  </div>";
	linkCardsoutput += " </div>";

	document.getElementById("links_card").innerHTML = linkCardsoutput;

}

function drawPhonelineCard() {
	var phonelineCardOutput = "<br><div class='card'><div class='card-header bg-danger text-white'>";
		phonelineCardOutput +=	"<h3 class='card-title'>Phoneline</h3></div><div class='card-body'>";
		phonelineCardOutput +=	"<strong>Phoneline : <a href='tel:0871386120'>087 – 138 6120</a></strong><br>";
		phonelineCardOutput +=	"<strong>Monday - Friday 6pm - 9pm</strong><br>";
		phonelineCardOutput +=	"<strong>Email address : <a href='mailto:info@nasouth.ie'>info@nasouth.ie</a></strong>";
		phonelineCardOutput +=	"</div>";
	  phonelineCardOutput +=	"</div>";
	  phonelineCardOutput +=	"<br>";

	document.getElementById("phoneline_card").innerHTML = phonelineCardOutput;
}

// This function converts a number to a day of the week
function dayOfWeekAsString(dayIndex) {
	return ["not a day?", "Sun", "Mon","Tue","Wed","Thu","Fri","Sat"][dayIndex];
}

function drawFormatTable(data) {

	var format_hover_data = [];

	$.each( data.formats, function( format_key, format_val) {
		format_hover_data.push(format_val);
	});

	var formats_output = "<div class='table-responsive'><table class='table table-bordered table-dark table-striped table-condensed'>";
	formats_output += "<thead><tr><th>Abbrev</th><th>Type</th><th>Description</th></tr></thead><tbody>";
	$.each(format_hover_data, function(output_key, output_val) {
		formats_output += "<tr><td>" + output_val.key_string + "</td><td>" + output_val.name_string + "</td><td>";
		formats_output += output_val.description_string + "</td></tr>";
	});
	formats_output += "</tbody></table></div>";
	document.getElementById("formats_table").innerHTML = formats_output;
}

function writeMeetingRow (val) {
	meetingRow = "<tr>";
	meetingRow += "<td>" + val.meeting_name + "</td>";
	meetingRow += "<td>" + dayOfWeekAsString(val.weekday_tinyint)
	meetingRow += "&nbsp;" + val.start_time.substring(0, 5) + "</td>";
	meetingRow += "<td>" + val.location_text + "&nbsp;" + val.location_street + "<br>";
	meetingRow += "<i>" + val.location_info + "</i></td>";
	meetingRow += "<td>" + val.formats + "</td>";
	meetingRow += "<td><a href='http://maps.google.com/maps?daddr=";
	meetingRow += val.latitude + ',' + val.longitude;
	meetingRow += "'>Directions</a></li></td>";
	meetingRow += "</tr>";
}

// This function runs the query to the BMLT and displays the results on the map
function runSearchDay() {
	var search_url = "https://www.nasouth.ie/bmlt/main_server/client_interface/json/";
	search_url += "?switcher=GetSearchResults";
	search_url += "&services=2";
	search_url += "&data_field_key=meeting_name,weekday_tinyint,start_time,location_text,location_street,location_info,location_sub_province,distance_in_km,latitude,longitude,formats";
	search_url += "&get_used_formats";

	var sunCount = 0, monCount = 0, tueCount = 0, wedCount = 0, thuCount = 0, friCount = 0, satCount = 0;

	$.getJSON(search_url, function( data) {
		var sunExpandLi = "";
		var monExpandLi = "";
		var tueExpandLi = "";
		var wedExpandLi = "";
		var thuExpandLi = "";
		var friExpandLi = "";
		var satExpandLi = "";

		drawFormatTable(data);

		$.each( data.meetings, function( key, val) {

      writeMeetingRow(val);

			switch (val.weekday_tinyint) {
				case "1": sunExpandLi = sunExpandLi + meetingRow; sunCount++; break;
				case "2": monExpandLi = monExpandLi + meetingRow; monCount++; break;
				case "3": tueExpandLi = tueExpandLi + meetingRow; tueCount++; break;
				case "4": wedExpandLi = wedExpandLi + meetingRow; wedCount++; break;
				case "5": thuExpandLi = thuExpandLi + meetingRow; thuCount++; break;
				case "6": friExpandLi = friExpandLi + meetingRow; friCount++; break;
				case "7": satExpandLi = satExpandLi + meetingRow; satCount++; break;
			}

		});

		var result  = "<div class='tab-content' id='myTabContent'>";

		result += "<div id='sunday' class='tab-pane fade show active' role='tabpanel' aria-labelledby='sunday-tab'>";
		result += openTable;
		result += sunExpandLi;
		result += closeTable;

		result += "  <div id='monday' class='tab-pane fade' role='tabpanel' aria-labelledby='monday-tab'>";
		result += openTable;
		result += monExpandLi;
		result += closeTable;

		result += "  <div id='tuesday' class='tab-pane fade' role='tabpanel' aria-labelledby='tuesday-tab'>";
		result += openTable;
		result += tueExpandLi;
		result += closeTable;

		result += "  <div id='wednesday' class='tab-pane fade' role='tabpanel' aria-labelledby='wednesday-tab'>";
		result += openTable;
		result += wedExpandLi;
		result += closeTable;

		result += "  <div id='thursday' class='tab-pane fade' role='tabpanel' aria-labelledby='thursday-tab'>";
		result += openTable;
		result += thuExpandLi;
		result += closeTable;

		result += "  <div id='friday' class='tab-pane fade' role='tabpanel' aria-labelledby='friday-tab'>";
		result += openTable;
		result += friExpandLi;
		result += closeTable;

		result += "  <div id='saturday' class='tab-pane fade' role='tabpanel' aria-labelledby='saturday-tab'>";
		result += openTable;
		result += satExpandLi;
		result += closeTable;

		result += "</div>";
		document.getElementById("day-results").innerHTML = result;

	});
}

// This function runs the query to the BMLT and displays the results on the map
function runSearchCounty() {
	var search_url = "https://www.nasouth.ie/bmlt/main_server/client_interface/json/";
	search_url += "?switcher=GetSearchResults";
	search_url += "&services=2";
	search_url += "&data_field_key=meeting_name,weekday_tinyint,start_time,location_text,location_street,location_info,location_sub_province,distance_in_km,latitude,longitude,formats";
	search_url += "&get_used_formats";

	$.getJSON(search_url, function( data) {

		var CorkExpandLi = "";
		var KerryExpandLi = "";
		var LimerickExpandLi = "";
		var ClareExpandLi = "";
		var WaterfordExpandLi = "";
		var TipperaryExpandLi = "";

		drawFormatTable(data);

		$.each( data.meetings, function( key, val) {

			writeMeetingRow(val);

			switch (val.location_sub_province) {
				case "Cork":      CorkExpandLi      = CorkExpandLi      + meetingRow; break;
				case "Kerry":     KerryExpandLi     = KerryExpandLi     + meetingRow; break;
				case "Limerick":  LimerickExpandLi  = LimerickExpandLi  + meetingRow; break;
				case "Clare":     ClareExpandLi     = ClareExpandLi     + meetingRow; break;
				case "Waterford": WaterfordExpandLi = WaterfordExpandLi + meetingRow; break;
				case "Tipperary": TipperaryExpandLi = TipperaryExpandLi + meetingRow; break;
			}

		});

		var result  = "<div class='tab-content' id='myTabContent'>";

    result += "  <div id='cork' class='tab-pane fade show active' role='tabpanel' aria-labelledby='cork-tab'>";
		result += openTable;
		result += CorkExpandLi;
		result += closeTable;

		result += "  <div id='kerry' class='tab-pane fade' role='tabpanel' aria-labelledby='kerry-tab'>";
		result += openTable;
		result += KerryExpandLi;
		result += closeTable;

		result += "  <div id='limerick' class='tab-pane fade' role='tabpanel' aria-labelledby='limerick-tab'>";
		result += openTable;
		result += LimerickExpandLi;
		result += closeTable;

		result += "  <div id='clare' class='tab-pane fade' role='tabpanel' aria-labelledby='clare-tab'>";
		result += openTable;
		result += ClareExpandLi;
		result += closeTable;

		result += "  <div id='tipperary' class='tab-pane fade' role='tabpanel' aria-labelledby='tipperary-tab'>";
	  result += openTable;
		result += TipperaryExpandLi;
		result += closeTable;

		result += "  <div id='waterford' class='tab-pane fade' role='tabpanel' aria-labelledby='waterford-tab'>";
		result += openTable;
		result += WaterfordExpandLi;
		result += closeTable;

		result += "</div>";
		document.getElementById("county-results").innerHTML = result;

	});

}
