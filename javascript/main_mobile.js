"use strict";

// WHEN the user clicks the js-search
// select js-searchfield
// IF it has class hide, remove class hide
// otherwise add class hide

// GOOGLE API KEY: AIzaSyBgT00HqmK1WQzEUeclV2I5-HY6yuvskg4


window.initMap = function () {
	// ***** VARIABLES ***** //
	var markers = [];

	getUserLocation().then(function (latLng) {

		var myLat = latLng.lat;
		var myLng = latLng.long;

		console.log(myLat, myLng);

		var APIRequest = "https://refugerestrooms.webscript.io/api/v1/restrooms/by_location.json?lat=" + myLat + "&lng=" + myLng;

		// Create a map object and specify the DOM element for display.
		var map = new google.maps.Map(document.getElementById('map'), {
			center: {
				lat: myLat,
				lng: myLng
			},
			scrollwheel: false,
			zoom: 15
		});

		// getUserLocation();
		var whenDataComesBack = grabToiletData(APIRequest);

		whenDataComesBack.then(function (data) {
			var myData = data;
			var currentlyOpenWin = null;

			if (myData) {
				myData = JSON.parse(myData);
			}

			var $listing = $('.js-listing');

			var _loop = function _loop(i) {
				var currentToilet = myData[i];
				console.log(currentToilet);
				var marker = new google.maps.Marker({
					map: map,
					position: {
						lat: currentToilet.latitude,
						lng: currentToilet.longitude
					},
					title: currentToilet.name
				});

				var infoWin = new google.maps.InfoWindow({
					content: "<div>\n\t\t        \t<strong>" + currentToilet.name + "</strong>\n\t\t        </div>"
				});

				google.maps.event.addListener(marker, 'click', function () {
					if (currentlyOpenWin) {
						currentlyOpenWin.close();
					}

					infoWin.open(map, marker);

					currentlyOpenWin = infoWin;
				});

				var directions = "";
				if (currentToilet.directions !== null) {
					directions = currentToilet.directions;
				}

				$listing.append($("<div class=\"listing-text ui card toilet-card toilet-card-" + i + "\">\n                <div class=\"content\">\n                    <h4 class=\"header\">" + currentToilet.name + "</h4>\n                    <p class=\"meta\">" + currentToilet.street + "</p>\n                    <p class=\"description\">" + directions + "</p>  \n                </div>                \n            </div>"));

				$(".toilet-card-" + i).on('click', function () {
					marker.setAnimation(google.maps.Animation.BOUNCE);
					setTimeout(function () {
						marker.setAnimation(null);
					}, 1200);
				});

				console.log(currentToilet);
			};

			for (var i = 0; i < myData.length; i++) {
				_loop(i);
			}

			$listing.slick({
				infinite: true,
				slidesToShow: 1,
				slidesToScroll: 1,
				dots: true,
				speed: 300
			});
		});
	});
};

// $('.responsive').slick({
//   dots: true,
//   infinite: true,
//   slidesToShow: 4,
//   slidesToScroll: 4,
//   responsive: [
//     {
//       breakpoint: 1024,
//       settings: {
//         slidesToShow: 3,
//         slidesToScroll: 3,
//         infinite: true,
//         dots: true
//       }
//     },
//     {
//       breakpoint: 600,
//       settings: {
//         slidesToShow: 2,
//         slidesToScroll: 2
//       }
//     },
//     {
//       breakpoint: 480,
//       settings: {
//         slidesToShow: 1,
//         slidesToScroll: 1
//       }
//   ]
// });


//***** MY FUNCTIONS ***** //

function grabToiletData(URL) {
	return $.get(URL);
}

function getUserLocation() {

	return new Promise(function (resolve, reject) {

		navigator.geolocation.getCurrentPosition(success, err);

		function success(position) {

			var lat = position.coords.latitude;
			var long = position.coords.longitude;
			console.log('success');
			resolve({ lat: lat, long: long });
		} // success!

		function err() {

			var myLat = 40.7371449;
			var myLng = -73.9907287;
			console.log('err');
			resolve({ lat: myLat, long: myLng });
		}

		setTimeout(function () {

			err();
		}, 15000);
	});
}
