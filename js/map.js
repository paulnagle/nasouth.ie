var tomato_map_search = function($) {
  "use strict";

  $(window).on('load', function() {
    $("#searchradius-slider").slider({
      min: 1,
      max: 99,
      value: 25,
      animate: "fast"
    }).slider("pips", {
      suffix: "km",
      step: 5
    }).slider("float", {
      suffix: "km"
    });

    $("#searchradius-slider").css('background', 'rgb(51,102,153)');
    $("#slider-range-max .ui-state-default, .ui-widget-content .ui-state-default").css("background", '#eb6864');
    $("#searchradius-slider .ui-slider-handle").css("z-index", "1000");
    $("#map_canvas").css("height", "425px");

    var target = document.getElementById('map_canvas');
    var spinner = new Spinner().spin(target);
    $(target).data('spinner', spinner);

    $("#searchradius-slider").on("slidestop", function(event, ui) {
      searchRadius = $("#searchradius-slider").slider("value");
      DEBUG && console && console.log("Searchradius = " + searchRadius);
      map.removeLayer(circle);
      circle = L.circle(myLatLng, searchRadius * 1000, {
        fillOpacity: 0.1
      });
      circle.addTo(map);
      var circleBounds = new L.LatLngBounds;
      circleBounds = circle.getBounds();
      map.fitBounds(circleBounds);
      runSearch();
    });
  });

  var DEBUG = false;

  // Dont forget to comment all of this
  var map = null;
  var myLatLng = new L.latLng(53.341318, -6.270205); // Irish Service Office
  var circle = null;
  var currentLocationMarker = null;
  var searchRadius = 25; // default to 25km
  var markerClusterer = null;
  var firstLoad = 1;

  var sunCount = 0,
    monCount = 0,
    tueCount = 0,
    wedCount = 0,
    thuCount = 0,
    friCount = 0,
    satCount = 0;
  var sunExpandLi = "";
  var monExpandLi = "";
  var tueExpandLi = "";
  var wedExpandLi = "";
  var thuExpandLi = "";
  var friExpandLi = "";
  var satExpandLi = "";

  var meeting_formats = [];

  var onlyMeetingsWithNoFormats = false;

  var openTable = "<div class='table-responsive'><table class='table table-bordered table-striped'><thead><tr><th>Meeting Name</th><th>Time</th><th>Location</th><th>Format</th><th>Directions</th></tr></thead><tbody>";
  var closeTable = "</tbody></table></div></div>";

  var naIcon = L.MakiMarkers.icon({
    icon: "marker",
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

  var get_unique_id = function() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  var isEmpty = function(object) {
    for (var i in object) {
      return true;
    }
    return false;
  }

  var mapInit = function() {
    getCurrentGPSLocation();
  }

  // This function creates a new map, adds the Circle, the current location marker and
  // then runs a new search.
  var newMap = function() {
    DEBUG && console && console.log("Running newMap()");
    map = L.map('map_canvas');

    map.on('load', function(e) { // This is called when the map center and zoom are set
      DEBUG && console && console.log("****map load event****");

      $('#map_canvas').data('spinner').stop();
      circle = L.circle(myLatLng, searchRadius * 1000, {
        fillOpacity: 0.1
      });
      circle.addTo(map);
      var circleBounds = new L.LatLngBounds;
      circleBounds = circle.getBounds();
      map.fitBounds(circleBounds);

      currentLocationMarker = new L.marker(myLatLng, {
        draggable: true,
        icon: markerIcon
      }).addTo(map);
      currentLocationMarker.bindPopup("<b>This is where you are searching from. Drag this marker to search in another location. Move the slider below the map to increase the search radius.</b>", {
        className: 'custom-popup'
      });
      currentLocationMarker.openPopup();
      currentLocationMarker.on('dragend', function(e) {
        myLatLng = e.target.getLatLng();
        circle.setLatLng(myLatLng);
        circleBounds = circle.getBounds();
        map.fitBounds(circleBounds);
        runSearch();
        currentLocationMarker.unbindPopup();
      });
      runSearch();
    });

    DEBUG && console && console.log("****Adding tile Layer to Map****");
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    map.setView(myLatLng, 9); // Create new map
  }

  // This function converts a number to a day of the week
  var dayOfWeekAsString = function(dayIndex) {
    return ["not a day?", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIndex];
  }

  // This function uses the browser function to find our current GPS location. If the location
  // is found OK, the newMap() function is called with the location.
  var getCurrentGPSLocation = function() {
    DEBUG && console && console.log("****getCurrentGPSLocation()****");

    function success(location) {
      DEBUG && console && console.log("****GPS location found");
      myLatLng = L.latLng(location.coords.latitude, location.coords.longitude);
      newMap();
    }

    function fail(error) {
      DEBUG && console && console.log("****GPS location NOT found"); // Failed to find location, show default map
      newMap();
    }

    // Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
    navigator.geolocation.getCurrentPosition(success, fail, {
      maximumAge: 500000,
      enableHighAccuracy: true,
      timeout: 6000
    });
  }

  // This function generates the URL to query the BMLT based on the settings in the Settings Panel
  var buildSearchURL = function() {
    var search_url = "https://tomato.na-bmlt.org/main_server/client_interface/json/";
    // search_url = "https://na-bmlt.org/_/sandwich/client_interface/json/";
    // search_url = "https://www.nasouth.ie/bmlt/main_server/client_interface/json/";
    search_url += "?switcher=GetSearchResults";
    search_url += "&geo_width_km=" + searchRadius;
    search_url += "&long_val=" + myLatLng.lng;
    search_url += "&lat_val=" + myLatLng.lat;
    search_url += "&sort_key=sort_results_by_distance";
    search_url += "&data_field_key=meeting_name,weekday_tinyint,start_time,location_text,location_street,location_info,distance_in_km,latitude,longitude,formats";
    search_url += "&get_used_formats";
    search_url += "&callingApp=nasouth.ie";


    DEBUG && console && console.log("Search URL = " + search_url);

    return search_url;
  }


  var processSingleJSONMeetingResult = function(val) {
    DEBUG && console && console.log("**** processSingleJSONMeetingResult ******");

    var resultID = get_unique_id();

    var markerContent = "<li style='list-style-type: none !important'><h4>" + val.meeting_name + "</h4>";
    markerContent += "<p><i>" + dayOfWeekAsString(val.weekday_tinyint)
    markerContent += "&nbsp;" + val.start_time.substring(0, 5) + "</i></p>";
    markerContent += "<p>" + val.location_text + "</p><p>" + val.location_street + "</p>";
    markerContent += "<p><i>" + val.location_info + "</i></p>";
    markerContent += '<a href="http://maps.google.com/maps?';
    markerContent += '&daddr='
    markerContent += val.latitude + ',' + val.longitude;
    markerContent += '"  target="_blank">Directions</a></li>';

    var listContent = "<tr  id='" + resultID + "' >";
    listContent += "<td>" + val.meeting_name + "</td>";
    listContent += "<td>" + dayOfWeekAsString(val.weekday_tinyint)
    listContent += "&nbsp;" + val.start_time.substring(0, 5) + "</td>";
    listContent += "<td>" + val.location_text + "&nbsp;" + val.location_street + "<br>";
    listContent += "<i>" + val.location_info + "</i></td>";
    listContent += "<td>" + val.formats + "</td>";
    listContent += '<td><a href="http://maps.google.com/maps?daddr=';
    listContent += val.latitude + ',' + val.longitude;
    listContent += '"  target="_blank">Directions </a></li></td>';
    listContent += "</tr>";

    switch (val.weekday_tinyint) {
      case "1":
        sunCount++;
        sunExpandLi = sunExpandLi + listContent;
        break;
      case "2":
        monCount++;
        monExpandLi = monExpandLi + listContent;
        break;
      case "3":
        tueCount++;
        tueExpandLi = tueExpandLi + listContent;
        break;
      case "4":
        wedCount++;
        wedExpandLi = wedExpandLi + listContent;
        break;
      case "5":
        thuCount++;
        thuExpandLi = thuExpandLi + listContent;
        break;
      case "6":
        friCount++;
        friExpandLi = friExpandLi + listContent;
        break;
      case "7":
        satCount++;
        satExpandLi = satExpandLi + listContent;
        break;
    }

    // Add markers to the markerClusterer Layer
    var aMarker = L.marker([val.latitude, val.longitude], {
      icon: naIcon
    });
    aMarker.unique_id = resultID;
    aMarker.dayOfWeek = val.weekday_tinyint;
    aMarker.bindPopup(markerContent, {
      className: 'custom-popup'
    });
    aMarker.on("click", highlightMeeting);
    markerClusterer.addLayer(aMarker);
  }

  var highlightMeeting = function(e) {
    var nav_link;

    switch (e.target.dayOfWeek) {
      case "1":
        $("#myTab li:eq(0) a").tab('show');
        break;
      case "2":
        $("#myTab li:eq(1) a").tab('show');
        break;
      case "3":
        $("#myTab li:eq(2) a").tab('show');
        break;
      case "4":
        $("#myTab li:eq(3) a").tab('show');
        break;
      case "5":
        $("#myTab li:eq(4) a").tab('show');
        break;
      case "6":
        $("#myTab li:eq(5) a").tab('show');
        break
      case "7":
        $("#myTab li:eq(6) a").tab('show');
        break;
    }
    $("tr").removeClass("table-primary");
    $("#" + e.target.unique_id).addClass("table-primary");
  }

  // This function runs the query to the BMLT and displays the results on the map
  var runSearch = function() {
    DEBUG && console && console.log("**** runSearch()****");

    if (markerClusterer) {
      map.removeLayer(markerClusterer);
    }

    map.spin(true);

    sunCount = 0, monCount = 0, tueCount = 0, wedCount = 0, thuCount = 0, friCount = 0, satCount = 0;
    sunExpandLi = "";
    monExpandLi = "";
    tueExpandLi = "";
    wedExpandLi = "";
    thuExpandLi = "";
    friExpandLi = "";
    satExpandLi = "";

    meeting_formats = [];
    onlyMeetingsWithNoFormats = false;

    var search_url = buildSearchURL();

    $.getJSON(search_url, function(data) {
      DEBUG && console && console.log("**** runSearch() -> getJSON");

      $("#list-results").empty();

      markerClusterer = new L.markerClusterGroup({
        showCoverageOnHover: false,
        removeOutsideVisibleBounds: false
      });

      // Draw the formats table - Start
      if (!jQuery.isEmptyObject(data.formats)) {
        $.each(data.formats, function(format_key, format_val) {
          DEBUG && console && console.log("**** Formats for this search ****");
          DEBUG && console && console.log(JSON.stringify(format_val));
          meeting_formats.push(format_val);
          onlyMeetingsWithNoFormats = false;
        });
      } else {
        DEBUG && console && console.log("**** No formats for this search ****");
        onlyMeetingsWithNoFormats = true;
      }

      var formats_output = "<div class='table-responsive'><table class='table table-bordered table-dark table-striped table-condensed'>";
      formats_output += "<thead><tr><th>Abbrev</th><th>Type</th><th>Description</th></tr></thead><tbody>";
      $.each(meeting_formats, function(output_key, output_val) {
        formats_output += "<tr><td>" + output_val.key_string + "</td><td>" + output_val.name_string + "</td><td>";
        formats_output += output_val.description_string + "</td></tr>";
      });

      formats_output += "</tbody></table></div>";
      document.getElementById("formats_table").innerHTML = formats_output;
      // Draw the formats table - Stop


      if (!jQuery.isEmptyObject(data.meetings)) {
        DEBUG && console && console.log("**** Some meetings were returned ****");
        DEBUG && console && console.log(JSON.stringify(data.meetings));

        $.each(data.meetings, function(key, val) {
          processSingleJSONMeetingResult(val);
        });
      } else {
        DEBUG && console && console.log("**** No meetings were returned ****");
      }

      var result = "<div class='tab-content' id='myTabContent'>";

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
      document.getElementById("list_result").innerHTML = result;
      document.getElementById("sunday-badge").innerHTML = sunCount;
      document.getElementById("monday-badge").innerHTML = monCount;
      document.getElementById("tuesday-badge").innerHTML = tueCount;
      document.getElementById("wednesday-badge").innerHTML = wedCount;
      document.getElementById("thursday-badge").innerHTML = thuCount;
      document.getElementById("friday-badge").innerHTML = friCount;
      document.getElementById("saturday-badge").innerHTML = satCount;

      map.addLayer(markerClusterer);
      map.spin(false);
    });
  }

  // Expose one public method to be called from the html page
  return {
    doIt: function() {
      mapInit();
    }
  };
}(jQuery);
