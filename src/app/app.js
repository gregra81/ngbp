
angular.module('gingerAssignment', [
    'templates-app',
    'templates-common',
    'gingerAssignment.dashboard',
    'ui.router'
])

        .config(function myAppConfig($stateProvider, $urlRouterProvider, $httpProvider) {
            $urlRouterProvider.otherwise('/dashboard');

            // It appears angular native http methods
            // don't fire well when there are CORS issues
            // instead of putting GET in the header it uses OPTIONS
            // this is the fix
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
        })

        .run(function run() {
        })

        .controller('AppCtrl', function AppCtrl($scope, $location) {
            $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                if (angular.isDefined(toState.data.pageTitle)) {
                    $scope.pageTitle = toState.data.pageTitle + ' | Ginger Dashboard';
                }
            });
        })

        ;

