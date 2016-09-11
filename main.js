// WHEN the user clicks the js-search
// select js-searchfield
// IF it has class hide, remove class hide
// otherwise add class hide

// GOOGLE API KEY: AIzaSyBgT00HqmK1WQzEUeclV2I5-HY6yuvskg4





window.initMap = function() {
	// ***** VARIABLES ***** //
	let markers = [];

	getUserLocation().then(function(latLng) {
		alert(5)
		const myLat = latLng.lat;
		const myLng = latLng.long;

		console.log( myLat, myLng );

		let APIRequest = "https://refugerestrooms.webscript.io/api/v1/restrooms/by_location.json?lat=" + myLat + "&lng=" + myLng;


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

		  if ( myData ) {
		  	myData = JSON.parse( myData );
		  }

		  const $listing = $('.js-listing');

		  for( let i = 0; i < myData.length; i++ ) {
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

			const infoWin = new google.maps.InfoWindow({
		        content: `<div>
		        	<strong>${currentToilet.name}</strong>
		        </div>`
		    });

		    google.maps.event.addListener(marker, 'click', function() {
		    	if ( currentlyOpenWin ) {
		    		currentlyOpenWin.close();
		    	}

		        infoWin.open(map, marker);

		        currentlyOpenWin = infoWin;
		    });

		    let directions = "";
		    if (currentToilet.directions !== null) {
		    	directions = currentToilet.directions;
		    }

		    $listing.append($(`<div class="listing-text ui card toilet-card toilet-card-${i}">
                <div class="content">
                    <h4 class="header">${currentToilet.name}</h4>
                    <p class="meta">${currentToilet.street}</p>
                    <p class="description">${directions}</p>  
                </div>                
            </div>`));

            $(`.toilet-card-${i}`).on('click', function() {
			    marker.setAnimation(google.maps.Animation.BOUNCE);
			    setTimeout(function() {
			    	marker.setAnimation(null);
			    }, 1200);
            })



		    console.log( currentToilet );
		  }

		  $listing.slick({
		  	  infinite: true,
			  slidesToShow: 1,
			  slidesToScroll: 1,
			  dots: true,
			  speed: 300,
			  // adaptiveHeight: true
		  });

		});

	});

}

	 
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

function grabToiletData(URL){
	return $.get( URL );
}

function getUserLocation(){
	alert(0)
	return new Promise(( resolve, reject ) => {
		alert(1)
		navigator.geolocation.getCurrentPosition(success, err);

		function success(position) {
			alert(2)
		     var lat = position.coords.latitude;
		     var long = position.coords.longitude;
console.log('success')
		     resolve( { lat, long } );
		} // success!

		function err() {
			alert(3)
			const myLat = 40.7371449;
			const myLng = -73.9907287;
console.log('err')
			resolve({ lat: myLat, long: myLng });
		}

		setTimeout(function() {
			alert(4)
			err();
		}, 15000);
	});
}


