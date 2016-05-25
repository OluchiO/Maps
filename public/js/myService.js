angular.module("mapsApp")

.factory("myService", function($http, $q) {

  var obj = {};

  obj.postListing = function(form) {
    var dfd = $q.defer();
    $http.post('/postListing', form).success(function(response){
      console.log("service received form");
      dfd.resolve(response);
    }).error(function(err){
      console.log(err);
    })
    return dfd.promise;
  };
return obj;

});