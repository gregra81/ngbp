
angular.module('gingerAssignment', [
  'templates-app',
  'templates-common',
  'gingerAssignment.dashboard',
  'ui.router',
  'gingerAssignment.box'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/dashboard' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | Ginger Dashboard' ;
    }
  });
})

;

