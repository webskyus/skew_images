window.addEventListener('DOMContentLoaded', function () {
	'use strict';

	const map = document.querySelector('#map')
	const mapBasket = document.querySelector('#map-basket')

	if (map !== null) {

		window.addEventListener('scroll', e => {
			const scrollMap 		= map.offsetTop - 200
			const scrollFromTop = window.scrollY ? window.scrollY : scrollMap + 400

			if (scrollFromTop >= scrollMap && map.getAttribute('data-js-map-loaded') === 'false') {
				map.setAttribute('data-js-map-loaded', true)
				initMap();
			} 
		})


		window.addEventListener('load', e => {
			const mapInitNow = document.querySelector('[data-js-map-init]')
			const scrollFromTop = window.scrollY
			const scrollMap = map.offsetTop - 200

			if (mapInitNow.getAttribute('data-js-map-init') === 'true') {
				initMap();
				map.setAttribute('data-js-map-loaded', true)
			} 
			
			if (scrollFromTop >= scrollMap && map.getAttribute('data-js-map-loaded') === 'false') {
				initMap();
				map.setAttribute('data-js-map-loaded', true)
			}
		})



	}

	if (mapBasket !== null) {
		initBasketMap()
	}

	function initMap() {

		// all array
		const markers = [];
		const asideMarkers = [];
		const locations = [
			[40.399763, 49.852098],
			[40.443026, 49.942817],
			[40.459765, 49.752094],
		];

		// active icon 
		const activeIcon = {
			url: "./static/img/general/icon/pin_green.svg",
			scaledSize: new google.maps.Size(65, 65)
		};

		// default icon 
		const normalIcon = {
			url: './static/img/general/icon/pin.svg',
			scaledSize: new google.maps.Size(63, 63)
		};

		// styles for map 
		let styleArr = [
			{
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#ebe3cd"
					}
				]
			},
			{
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#523735"
					}
				]
			},
			{
				"elementType": "labels.text.stroke",
				"stylers": [
					{
						"color": "#f5f1e6"
					}
				]
			},
			{
				"featureType": "administrative",
				"elementType": "geometry.stroke",
				"stylers": [
					{
						"color": "#c9b2a6"
					}
				]
			},
			{
				"featureType": "administrative.land_parcel",
				"elementType": "geometry.stroke",
				"stylers": [
					{
						"color": "#dcd2be"
					}
				]
			},
			{
				"featureType": "administrative.land_parcel",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#ae9e90"
					}
				]
			},
			{
				"featureType": "landscape.natural",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#dfd2ae"
					}
				]
			},
			{
				"featureType": "poi",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#dfd2ae"
					}
				]
			},
			{
				"featureType": "poi",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#93817c"
					}
				]
			},
			{
				"featureType": "poi.park",
				"elementType": "geometry.fill",
				"stylers": [
					{
						"color": "#a5b076"
					}
				]
			},
			{
				"featureType": "poi.park",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#447530"
					}
				]
			},
			{
				"featureType": "road",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#f5f1e6"
					}
				]
			},
			{
				"featureType": "road.arterial",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#fdfcf8"
					}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#f8c967"
					}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "geometry.stroke",
				"stylers": [
					{
						"color": "#e9bc62"
					}
				]
			},
			{
				"featureType": "road.highway.controlled_access",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#e98d58"
					}
				]
			},
			{
				"featureType": "road.highway.controlled_access",
				"elementType": "geometry.stroke",
				"stylers": [
					{
						"color": "#db8555"
					}
				]
			},
			{
				"featureType": "road.local",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#806b63"
					}
				]
			},
			{
				"featureType": "transit.line",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#dfd2ae"
					}
				]
			},
			{
				"featureType": "transit.line",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#8f7d77"
					}
				]
			},
			{
				"featureType": "transit.line",
				"elementType": "labels.text.stroke",
				"stylers": [
					{
						"color": "#ebe3cd"
					}
				]
			},
			{
				"featureType": "transit.station",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#dfd2ae"
					}
				]
			},
			{
				"featureType": "water",
				"elementType": "geometry.fill",
				"stylers": [
					{
						"color": "#b9d3c2"
					}
				]
			},
			{
				"featureType": "water",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#92998d"
					}
				]
			}
		]

		// default options for map 
		let mapOptions = {
			center: new google.maps.LatLng(40.399763, 49.852098),
			zoom: 11,
			disableDefaultUI: true,
			styles: styleArr
		};



		// const for dom el
		const mapContainerDesc = document.querySelector('#map');
		const locationButtons = document.querySelectorAll('[data-js-map-btn]');
		const copyBtn = document.querySelectorAll('[data-js-basket-info-copy-btn]')
		const mapDesc = new google.maps.Map(mapContainerDesc, mapOptions);
		let marker, i, s;

		// add all locations icon in map 
		locations.forEach(el => {
			marker = new google.maps.Marker({
				position: new google.maps.LatLng(el[0], el[1]),
				map: mapDesc,
				icon: {
					url: "./static/img/general/icon/pin.svg",
					scaledSize: new google.maps.Size(63, 63)
				}
			});

			markers.push(marker);

			// google.maps.event.addListener(marker, 'click', (function (marker, i) {
			// 	return function () {
			// 		markers.forEach(el => {
			// 			el.setIcon(normalIcon);
			// 		})

			// 		this.setIcon(activeIcon)
			// 	}
			// })(marker, i));
		})

		// show location when click 
		let asideMarker;
		locationButtons.forEach((el, indx) => {
			// show pharmacy 
			el.addEventListener('click', elm => {
				showMarkerOnMap(elm, el)
			})

			// copy pharmacy info 
			if (copyBtn.length > 0) {
				copyBtn[indx].addEventListener('click', elm => {
					getMapStaticImg(elm)
				})
			}

		})


		function showMarkerOnMap(data, dataEl) {

			const lat = +data.target.dataset.jsMapLat
			const lng = +data.target.dataset.jsMapLng
			const id = dataEl.dataset.jsMapBtn
			const parent = document.querySelector(`[data-js-map-item-parent="${id}"]`)
			const parents = document.querySelectorAll(`[data-js-map-item-parent]`)


			// create new marker 
			asideMarker = new google.maps.Marker({
				position: new google.maps.LatLng(lat, lng),
				map: mapDesc,
				icon: {
					url: "./static/img/general/icon/pin.svg",
					scaledSize: new google.maps.Size(30, 30)
				}
			});

			// push new marker in map 
			asideMarkers.push(asideMarker)

			// change marker icon 
			asideMarkers.forEach(markers => {
				markers.setIcon(normalIcon);
			})

			markers.forEach(items => {
				items.setIcon(normalIcon);
			})

			// add active marker icon 
			asideMarker.setIcon(activeIcon)

			// remove active class 
			parents.forEach(e => e.classList.remove('map-iframe-aside__pharmacy-list-item--active'))

			// add active class 
			parent.classList.add('map-iframe-aside__pharmacy-list-item--active')
		}

		function getMapStaticImg(data) {
			const wrapper = document.querySelector('[data-js-pharmacy-clone]')
			const input = document.querySelector('[data-js-basket-map-pharmacy-id]')
			const btn = data.target.dataset 
			const pharmacyID = btn.jsBasketPharmacyId
			const pharmacyName = btn.jsBasketPharmacyName
			const pharmacyLocation = btn.jsBasketPharmacyLocation
			const pharmacyTel = btn.jsBasketPharmacyTel.split(',')
			const pharmacyEmail = btn.jsBasketPharmacyEmail.split(',')
			const pharmacyImg = btn.jsBasketPharmacyImg
			const pharmacyWorkingTime = btn.jsBasketPharmacyWorkingTime
			const addNewMapInfoHead = document.querySelector('[data-js-add-pharmarcy-btn-head]')
			const addNewMapInfoBottom = document.querySelector('[data-js-add-pharmarcy-btn-bottom]')
			const tel = []
			const email = []
			

			for (let key = 0; key < pharmacyTel.length; key++) {
				let telEdited = pharmacyTel[key].replace(/[^+\d]/g, '')
				tel.push(`<a class="basket-cloned-pharmacy-info__link" href="tel:${telEdited}">${pharmacyTel[key]}</a>`)
			}

			for (let key = 0; key < pharmacyEmail.length; key++) {
				let emailEdited = pharmacyEmail[key].replace(/\s+/g, '')
				email.push(`<a class="basket-cloned-pharmacy-info__link" href="tel:${emailEdited}">${pharmacyEmail[key]}</a>`)
			}

			addNewMapInfoHead.classList.add('basket-checkout-box__add-map-info-btn--hidden')
			addNewMapInfoBottom.classList.add('basket-cloned-pharmacy-info__btn--visible')

			input.value = pharmacyID
			wrapper.innerHTML = ''
			wrapper.insertAdjacentHTML('afterbegin', `
						<div class="basket-cloned-pharmacy-info__col">
							<p class="basket-cloned-pharmacy-info__address-title">Ünvan</p>
							<h5 class="basket-cloned-pharmacy-info__pharmacy-title">${pharmacyName}</h5>
							<p class="basket-cloned-pharmacy-info__address">
								${pharmacyLocation}
							</p>
							<div class="basket-cloned-pharmacy-info__row basket-cloned-pharmacy-info__row--phone">
								${tel.join(' ')}
							</div>
							<div class="basket-cloned-pharmacy-info__row basket-cloned-pharmacy-info__row--email">
								${email.join(' ')}
							</div>
							<div	class="basket-cloned-pharmacy-info__row basket-cloned-pharmacy-info__row--work-time">
								<span class="basket-cloned-pharmacy-info__work-time">
										${pharmacyWorkingTime}
								</span>
							</div>
						</div>
						<div class="basket-cloned-pharmacy-info__col basket-cloned-pharmacy-info__col--img">
							<div class="basket-cloned-pharmacy-info__img">
								<img
									src="${pharmacyImg}"
									loading="lazy"
									alt="pharmacy location photo"
									width="245"
									height="245"/>
							</div>
						</div>
			`)
		}


	}


	function initBasketMap() {
		// start latLng 
		let myLatlng = new google.maps.LatLng(40.410519, 49.867317);

		// styles for map 
		let styleArr = [
			{
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#ebe3cd"
					}
				]
			},
			{
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#523735"
					}
				]
			},
			{
				"elementType": "labels.text.stroke",
				"stylers": [
					{
						"color": "#f5f1e6"
					}
				]
			},
			{
				"featureType": "administrative",
				"elementType": "geometry.stroke",
				"stylers": [
					{
						"color": "#c9b2a6"
					}
				]
			},
			{
				"featureType": "administrative.land_parcel",
				"elementType": "geometry.stroke",
				"stylers": [
					{
						"color": "#dcd2be"
					}
				]
			},
			{
				"featureType": "administrative.land_parcel",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#ae9e90"
					}
				]
			},
			{
				"featureType": "landscape.natural",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#dfd2ae"
					}
				]
			},
			{
				"featureType": "poi",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#dfd2ae"
					}
				]
			},
			{
				"featureType": "poi",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#93817c"
					}
				]
			},
			{
				"featureType": "poi.park",
				"elementType": "geometry.fill",
				"stylers": [
					{
						"color": "#a5b076"
					}
				]
			},
			{
				"featureType": "poi.park",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#447530"
					}
				]
			},
			{
				"featureType": "road",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#f5f1e6"
					}
				]
			},
			{
				"featureType": "road.arterial",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#fdfcf8"
					}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#f8c967"
					}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "geometry.stroke",
				"stylers": [
					{
						"color": "#e9bc62"
					}
				]
			},
			{
				"featureType": "road.highway.controlled_access",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#e98d58"
					}
				]
			},
			{
				"featureType": "road.highway.controlled_access",
				"elementType": "geometry.stroke",
				"stylers": [
					{
						"color": "#db8555"
					}
				]
			},
			{
				"featureType": "road.local",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#806b63"
					}
				]
			},
			{
				"featureType": "transit.line",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#dfd2ae"
					}
				]
			},
			{
				"featureType": "transit.line",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#8f7d77"
					}
				]
			},
			{
				"featureType": "transit.line",
				"elementType": "labels.text.stroke",
				"stylers": [
					{
						"color": "#ebe3cd"
					}
				]
			},
			{
				"featureType": "transit.station",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#dfd2ae"
					}
				]
			},
			{
				"featureType": "water",
				"elementType": "geometry.fill",
				"stylers": [
					{
						"color": "#b9d3c2"
					}
				]
			},
			{
				"featureType": "water",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#92998d"
					}
				]
			}
		]

		// map option 
		let mapOptions = {
			zoom: 12,
			center: myLatlng
		};

		// init map 
		let map = new google.maps.Map(document.getElementById('map-basket'), mapOptions);

		// add marker 
		let marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			icon: {
				url: "./static/img/general/icon/pin_green.svg",
				scaledSize: new google.maps.Size(65, 65)
			}
		});

		// add new marker when click
		google.maps.event.addListener(map, 'click', function (event) {

			//Get the location that the user clicked
			let clickedLocation = event.latLng;


			//If the marker hasn't been added
			if (marker === false) {
				// Create the marker.
				marker = new google.maps.Marker({
					position: clickedLocation,
					map: map,
					draggable: true //make it draggable
				});

				// Listen for drag events!
				google.maps.event.addListener(marker, 'dragend', function (event) {
					markerLocation();
				});
			} else {

				//Marker has already been added, so just change its location.
				marker.setPosition(clickedLocation);
			}

			//Get the marker's location.
			markerLocation();
		});

		function markerLocation() {
			//Get location.
			let currentLocation = marker.getPosition();
			let input = document.querySelector('[data-js-basket-map-info-for-courier]')

			// add latlng to input 
			input.value = `${currentLocation.lat()},${currentLocation.lng()}`
		}

	}


});