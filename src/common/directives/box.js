(function() {
	'use strict';

	angular.module('gingerAssignment.box', [])

	.directive('serviceBox', function(MESSAGES) {
		return {
			restrict : 'A',
			replace : true,
			link : function(scope, elem, attrs) {

				elem.find('button').bind('click', function() {


					scope.$apply(function() {
						console.log(scope.service);
						if (scope.service.isMaximized){
							scope.service.isMaximized = false;
							scope.service.maximizedStatusText = MESSAGES.maxText;
						}else{
							scope.setServiceBoxViews(scope.service);
						}	
					});
				});
			}
		};
	});

}());