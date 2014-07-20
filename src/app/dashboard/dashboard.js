/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module( 'gingerAssignment.dashboard', [
  'ui.router'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'dashboard', {
    url: '/dashboard',
    views: {
      "main": {
        controller: 'DashboardCtrl',
        templateUrl: 'dashboard/dashboard.tpl.html'
      }
    },
    data:{ pageTitle: 'Dashboard' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'DashboardCtrl', function DashboardController( $scope ) {

	$scope.services = [
                   {name:'Definitions', value:1},
                   {name:'Synonyms', value:2},
                   {name:'Rephrase', value:3}
                   ];

	$scope.service = $scope.services[0]; 
	
	$scope.activeServices = [];
	
	/**
	 * Add a new service
	 */
	$scope.addService = function(service){
		if ($scope.activeServices.indexOf(service)<0){
			$scope.activeServices.push(service);
		}else{
			alert('This service is already active');
		}
	};
	
	/**
	 * Use the service
	 */
	$scope.useService = function(service,text){
		if ($scope.activeServices.length){
			service.content = 'foo';
		}else{
			alert('You need to add at least one service to use that feature');
		}
	};	
	
	
})

;

