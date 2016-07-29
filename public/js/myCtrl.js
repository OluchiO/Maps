angular.module('mapsApp', ['oitozero.ngSweetAlert']).
controller('myCtrl', function($scope, myService, $http, $location, $anchorScroll, SweetAlert){
$scope.markers;
var allListings = [];
var pos; 

 $scope.map = new google.maps.Map(document.getElementById('map'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: new google.maps.LatLng(37.3382, -121.8863),
            zoom: 8
        });

  
 $scope.infoWindow = new google.maps.InfoWindow({});

 
      var reloadMarkers = function () {
         if($scope.markers !== undefined)
          for (var i = 0; i < $scope.markers.length; i++) {    
            $scope.markers[i].setMap(null);
          }
    $scope.markers = [];
    
      };  



 $scope.postListing = function(form) {
        if (form === undefined || form === null || form === "") {
           return SweetAlert.swal("All Fields Required!", "There was a problem with your submission", "error"); 
        }
         myService.postListing(form).then(function(response) {
          form = "";
          SweetAlert.swal("Added!", "Thanks for submitting your listing to the map", "success");
            }, function(err){
               SweetAlert.swal("Sorry!", err, "error");
            }
            )};
          
            
                     
                        
   
  $scope.getListings = function(){
    reloadMarkers();
    $http.get('/getListings').success(function(response){
      for(var i = 0; i < response.length; i++) {
                allListings.push(response[i]);
              }
               $scope.createMarker(allListings);
               $scope.map.setZoom(10);
               allListings = [];
             }).error(function(err) {
                console.log(err);
            });
      $location.hash('browse_');
      $anchorScroll();
             
           };

           $scope.goTo = function(link){
            $location.hash(link);
            $anchorScroll();
           };


    $scope.getListingByCity = function(stringValue) { 
      reloadMarkers();
      var city = stringValue;
    $http.get('/getListings').success(function(response){
   
      for (var i = 0; i < response.length; i++) {
        if (response[i].city === city) {
                allListings.push(response[i]);
              }
            }
               $scope.createMarker(allListings);
               allListings = [];
               $scope.map.setZoom(17);

             }).error(function(err) {
                console.log(err);
            });
       
           };
        
 

        $scope.createMarker = function(allListings){
          allListings.forEach(function(listing){

          var contentString =
                    '<p><b>Study Name:</b> ' + listing.title +
                    '<br><b>Study Link:</b> ' + listing.link +
                    '<br><b>Ages:</b> ' + listing.ageRange +
                    '<br><b>Compensation:</b> $' + listing.compensation +
                    '<br><b>Type:</b> ' + listing.medType +
                    '</p>';

            var geocoder = new google.maps.Geocoder();

            geocoder.geocode({
                'address': listing.city
            },
                function (results, status) {
                 
            var newLat = results[0].geometry.location.lat() + (Math.random() -.5) / 1500;
            var newLng = results[0].geometry.location.lng() + (Math.random() -.5) / 1500;
            pos = new google.maps.LatLng(newLat,newLng);

                    if (status == google.maps.GeocoderStatus.OK) {
                        var marker = new google.maps.Marker({
                            position: pos, 
                            map: $scope.map,
                            animation: google.maps.Animation.DROP,
                            title: listing.city,
                            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                            content: contentString
                        });

                       google.maps.event.addListener(marker, 'click', function (e) {
                            $scope.infoWindow.setContent('<h4>' + marker.title + '</h4>' + marker.content);
                            $scope.infoWindow.open($scope.map, marker);
                          
                        });

                       $scope.markers.push(marker);
                       $scope.map.panTo(pos);


                    }                         

           
                });
        
                

        });
 
};


    });



