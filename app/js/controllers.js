'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('Maps', [function() {

    var
      options = {
        zoom: 12,
        center: new google.maps.LatLng(37.797577,-122.228394),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      },
      map = new google.maps.Map($("#map_canvas")[0], options);

  }])
  .controller('Graphs', [function() {

  }]);
