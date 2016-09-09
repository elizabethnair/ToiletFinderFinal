// WHEN the user clicks the js-search
// select js-searchfield
// IF it has class hide, remove class hide
// otherwise add class hide

// GOOGLE API KEY: AIzaSyBgT00HqmK1WQzEUeclV2I5-HY6yuvskg4





window.initMap = function() {
	// ***** VARIABLES ***** //
	let markers = [];

	getUserLocation().then(function(latLng) {
		const myLat = latLng.lat;
		const myLng = latLng.long;

		console.log( myLat, myLng );

		let APIRequest = "//www.refugerestrooms.org:80/api/v1/restrooms/by_location.json?lat=" + myLat + "&lng=" + myLng;


		// Create a map object and specify the DOM element for display.
		let map = new google.maps.Map(document.getElementById('map'), {
		  center: {
		  	lat: myLat,
		  	lng: myLng,
		  },
		  scrollwheel: false,
		  zoom: 15,
		});

		// getUserLocation();
		const whenDataComesBack = grabToiletData(APIRequest);

		whenDataComesBack.then(function( data ) {
		  let myData = data;
		  let currentlyOpenWin = null;

		  for( let i = 0; i < myData.length; i = i + 1 ) {
		  	const currentToilet = myData[ i ];
		  	console.log( currentToilet );
		  	const marker = new google.maps.Marker({
		        map: map,
		        position: {
		        	lat: currentToilet.latitude,
		        	lng: currentToilet.longitude,
		        },
		        title: currentToilet.name
		    })

			const infowin = new google.maps.InfoWindow({
		        content: `<div>
		        	<strong>${currentToilet.name}</strong>
		        </div>`
		    });

		    google.maps.event.addListener(marker, 'click', function() {
		    	if ( currentlyOpenWin ) {
		    		currentlyOpenWin.close();
		    	}

		        infowin.open(map, marker);

		        currentlyOpenWin = infowin;
		    });
		  }
		});

	});
	// addMarker('usa');
}



//***** MY FUNCTIONS ***** //

function grabToiletData(URL){
	return $.get( URL );
}

function getUserLocation(){
	return new Promise(( resolve, reject ) => {
		navigator.geolocation.getCurrentPosition(success, err);

		function success(position) {
		     var lat = position.coords.latitude;
		     var long = position.coords.longitude;
console.log('success')
		     resolve( { lat, long } );
		} // success!

		function err() {
			const myLat = 40.7371449;
			const myLng = -73.9907287;
console.log('err')
			resolve({ lat: myLat, long: myLng });
		}

		setTimeout(function() {
			err();
		}, 15000);
	});
}

