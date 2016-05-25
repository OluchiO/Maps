angular.module('mapsApp', ['oitozero.ngSweetAlert']).
controller('myCtrl', function($scope, myService, $http, $location, $anchorScroll, SweetAlert){

 $scope.map = new google.maps.Map(document.getElementById('map'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: new google.maps.LatLng(37.3382, -121.8863),
            zoom: 8
        });


 $scope.infoWindow = new google.maps.InfoWindow({});
 $scope.markers = [];
 
 


 $scope.postListing = function(form) {
      
        if (form === undefined || form === null || form === "") {
            SweetAlert.swal("All Fields Required!", "There was a problem with your submission", "error"); 
        }
            myService.postListing(form).then(function(response) {
              if (response.message) {
                SweetAlert.swal("Please try again!", "There was a problem with your submission", "error");
              } else {
               SweetAlert.swal("Added!", "Thanks for submitting your listing to the map", "success");
           console.log("Controller has received response from Server: ", response); 
              }
            
      });
        };

   
  $scope.getListings = function(){
     var allListings = [];
    $http.get('/getListings').success(function(response){
       console.log("Returned from DATABASE: ", response);
      for(var i= 0; i < response.length; i++) {
                allListings.push(response[i]);
              }
               $scope.createMarker(allListings);
             }).error(function(err) {
                console.log("Did not go to controller", err);
            });
      $location.hash('browse_');
      $anchorScroll();
             
           };

           $scope.goTo = function(link){
            $location.hash(link);
            $anchorScroll();

           };



    $scope.getListingByCity = function(stringValue) {
     
      var city = stringValue;

      var allListings = [];
    $http.get('/getListings').success(function(response){
   
      for(var i= 0; i < response.length; i++) {
        if(response[i].city === city) {
                allListings.push(response[i]);
              }
            }
            console.log("filtered by city? : ", allListings);
               var y = $scope.createMarker(allListings);
               $scope.map.panTo($scope.obj);
                city = "";
                $scope.obj = "";
    
             }).error(function(err) {
                console.log("Did not go to controller", err);
            });
             
           };

  




        $scope.createMarker = function(allListings){
          console.log("here is listings :", allListings);
          var contentString = "";
          allListings.forEach(function(user){

          contentString =
                    '<p><b>Study Name:</b> ' + user.title +
                    '<br><b>Link to Study:</b> ' + user.link +
                    '<br><b>Ages:</b> ' + user.ageRange +
                    '<br><b>Compensation:</b> $' + user.compensation +
                    '<br><b>Type:</b> ' + user.medType +
                    '</p>';
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': user.city
            },
                function (results, status) {
                 
            var newLat = results[0].geometry.location.lat() + (Math.random() -.5) / 1500;// * (Math.random() * (max - min) + min);
            var newLng = results[0].geometry.location.lng() + (Math.random() -.5) / 1500;// * (Math.random() * (max - min) + min);
            var pos = new google.maps.LatLng(newLat,newLng);
            $scope.obj = pos;
             console.log("position: ", pos);
                    if (status == google.maps.GeocoderStatus.OK) {
                        var marker = new google.maps.Marker({
                            position: pos, //results[0].geometry.location
                            map: $scope.map,
                            title: user.city,
                            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                            content: contentString
                        });

                       google.maps.event.addListener(marker, 'click', function () {
                            $scope.infoWindow.setContent('<h4>' + marker.title + '</h4>' + marker.content);
                            $scope.infoWindow.open($scope.map, marker);
                        });


                        $scope.markers.push(marker);

  
                    }
           
                });

        });
 
};

        



    });



