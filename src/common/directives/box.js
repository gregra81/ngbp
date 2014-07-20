(function() {
	'use strict';

	angular.module('gingerAssignment.box', [])

	.directive('serviceBox', function() {
		return {
			restrict : 'A',
			replace : true,
			link : function(scope, elem, attrs) {
				elem.bind('click', function() {
					elem.css('background-color', 'black');
					scope.$apply(function() {
						scope.color = "black";
					});
				});
				elem.bind('mouseover', function() {
					elem.css('cursor', 'pointer');
				});
			}
		};
	});

}());