var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
directionsDisplay = new google.maps.DirectionsRenderer();
var myLatlng = new google.maps.LatLng(40.7376487, -73.9886182);

function initialize() {

  // Create an array of styles.
  var styles = [
    {
      stylers: [
        { hue: "#dc9629" },
        { saturation: -20 }
      ]
    },{
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { lightness: 100 },
        { visibility: "simplified" }
      ]
    },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];

  // Create a new StyledMapType object, passing it the array of styles,
  // as well as the name to be displayed on the map type control.
  var styledMap = new google.maps.StyledMapType(styles,
    {name: "Styled Map"});


  // Create a map object, and include the MapTypeId to add
  // to the map type control.
  var mapOptions = {
    zoom: 12,
    center: myLatlng,
    scrollwheel: true,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }
  };

  
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  directionsDisplay.setMap(map);


  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');

  // Create a new StyledMapType object, passing it the array of styles,
  // as well as the name to be displayed on the map type control.
  var styledMap1 = new google.maps.StyledMapType(styles,
    {name: "Styled Map1"});

  var myLatlng1 = new google.maps.LatLng(40.6996688, -74.2200069);

  // Create a map object, and include the MapTypeId to add
  // to the map type control.
  var mapOptions1 = {
    zoom: 12,
    center: myLatlng1,
    scrollwheel: false,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style1']
    }
  };
  var map1 = new google.maps.Map(document.getElementById('map-canvas1'),
    mapOptions1);

        var marker1 = new google.maps.Marker({
        position: myLatlng1,
        animation: google.maps.Animation.DROP,
        map: map1,
    });

  //Associate the styled map with the MapTypeId and set it to display.
  map1.mapTypes.set('map_style1', styledMap1);
  map1.setMapTypeId('map_style1');

}
