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
angular.module('gingerAssignment.dashboard', [
    'ui.router'
])

        /**
         * Each section or module of the site can also have its own routes. AngularJS
         * will handle ensuring they are all available at run-time, but splitting it
         * this way makes each module more "self-contained".
         */
        .config(function config($stateProvider) {
            $stateProvider.state('dashboard', {
                url: '/dashboard',
                views: {
                    "main": {
                        controller: 'DashboardCtrl',
                        templateUrl: 'dashboard/dashboard.tpl.html'
                    }
                },
                data: {pageTitle: 'Dashboard'}
            });
        })

        /**
         * And of course we define a controller for our route.
         */
        .controller('DashboardCtrl', function DashboardController($scope, GingerService, MESSAGES) {


            $scope.services = [
                {name: 'Definitions', value: 1},
                {name: 'Synonyms', value: 2},
                {name: 'Rephrase', value: 3}
            ];

            //Set some defaults
            for (var i in $scope.services) {
                $scope.services[i].isMaximized = true;
                $scope.services[i].maximizedStatusText = MESSAGES.minText;
            }

            $scope.service = $scope.services[0];

            $scope.activeServices = [];

            /**
             * Add a new service
             */
            $scope.addService = function(service) {
                if ($scope.activeServices.indexOf(service) < 0) {
                    $scope.activeServices.push(service);
                } else {
                    alert('This service is already active');
                }
            };

            /**
             * Use the service
             */
            $scope.useService = function(service, text) {
                if ($scope.activeServices.indexOf(service) > -1) {
                    if (text) {
                        $scope.setServiceBoxViews(service);
                        switch (service.value) {
                            case 1:// Definitions
                                console.log('Definitions');
                                GingerService.getDefinition(text).then(function(response) {
                                    console.log(response);
                                    var content = '';
                                    // @todo
                                    service.content = content;
                                });
                                break;
                            case 2:// Synonyms
                                console.log('Synonyms');
                                GingerService.getSynonyms(text).then(function(response) {
                                    console.log(response);
                                    var content = '';
                                    // @todo
                                    service.content = content;
                                });
                                break;
                            case 3:// Rephrase
                                console.log('Rephrase');
                                GingerService.getRephrase(text).then(function(response) {
                                    console.log(response);
                                    var content = '';
                                    angular.forEach(Sentences, function(key, value) {
                                        content += value.Sentence + '\n';
                                    });
                                    service.content = content;
                                });
                                break;
                            default:
                                alert('No such service, please try again');
                        }
                    }
                } else {
                    alert('You need to activate ' + service.name + ' first');
                }
            };

            $scope.setServiceBoxViews = function(selectedService) {
                angular.forEach($scope.activeServices, function(value, key) {
                    value.maximizedStatusText = MESSAGES.maxText;
                    value.isMaximized = false;
                });
                selectedService.isMaximized = true;
                selectedService.maximizedStatusText = MESSAGES.minText;
            };


        })

        .constant('MESSAGES', {
            maxText: 'Maximize',
            minText: 'Minimize'
        })
        /**
         * Our API calls
         */
        .service('GingerService', function($http) {
            var baseUrl = 'http://services.gingersoftware.com/',
                    apiKey = 'BrowserStandalone';
            /**
             * General function for ajax calls
             */
            var doServerCall = function(apiRequest) {
                return $http.get(baseUrl + apiRequest).then(
                        function(res) {
                            return res;
                        });
            };

            /*** PUBLIC METHODS ***/

            /**
             * Get definition
             */
            this.getDefinition = function(string) {
                var request = 'dictionary/json/GetDefinitions' +
                        '?apiKey=' + apiKey +
                        '&userIdentifier=ginger' +
                        '&clientVersion=1.2' +
                        '&word=' + string +
                        '&lang=us';
                return doServerCall(request);
            };

            /**
             * Get Synonyms
             */
            this.getSynonyms = function(string) {
                var request = 'dictionary/json/GetSynonyms' +
                        '?apiKey=' + apiKey +
                        '&userIdentifier=ginger' +
                        '&clientVersion=1.2' +
                        '&word=' + string +
                        '&lang=us';
                return doServerCall(request);
            };

            /**
             * Get Synonyms
             */
            this.getRephrase = function(string) {
                var request = 'rephrase/rephrase' +
                        '?apiKey=' + apiKey +
                        '&version=1' +
                        '&clientVersion=1.2' +
                        '&s=' + string;
                return doServerCall(request);
            };

        })
        /**
         * The service box below
         */
        .directive('serviceBox', function(MESSAGES) {
            return {
                restrict: 'A',
                replace: true,
                link: function(scope, elem, attrs) {

                    elem.find('button').bind('click', function() {

                        scope.$apply(function() {
                            if (scope.service.isMaximized) {
                                scope.service.isMaximized = false;
                                scope.service.maximizedStatusText = MESSAGES.maxText;
                            } else {
                                scope.setServiceBoxViews(scope.service);
                            }
                        });
                    });
                }
            };
        });

