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
                                GingerService.getDefinition(text).then(function(response) {
                                    if (response.data.DefsByWord[0]){
                                        var definitions = response.data.DefsByWord[0].DefsByPos[0].Defs;
                                        service.content = [];
                                        angular.forEach(definitions, function(key, value) {
                                           service.content.push(key.Def);
                                        });
                                    }else{
                                         alert('No definitions found');
                                    }
                                });
                                break;
                            case 2:// Synonyms
                                GingerService.getSynonyms(text).then(function(response) {
                                    if (response.data.SynsByPos[0]){
                                        var synonyms = response.data.SynsByPos[0].Syns;
                                        service.content = [];
                                        angular.forEach(synonyms, function(key, value) {
                                           service.content.push(key.Word);
                                        });
                                    }else{
                                         alert('No synonyms found');
                                    }
                                });
                                break;
                            case 3:// Rephrase
                                GingerService.getRephrase(text).then(function(response) {
                                    if (response.data.Sentences.length>0){
                                        service.content = [];
                                        angular.forEach(response.data.Sentences, function(key, value) {
                                            service.content.push(key.Sentence);
                                        });
                                    }else{
                                        alert('No rephrases found');
                                    }
                                });
                                break;
                            default:
                                alert('No such service, please try again');
                        }
                    }
                } else {
                    alert('You need to add the service ' + service.name + ' first');
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
                apiKey = 'BrowserStandalone',
                userIdentifier='66a36867-b666-44c0-9ffe-8ddf90f966ac';
           /**
            * General function for ajax calls
            */
            var doServerCall = function(apiRequest) {
                apiRequest += '&callback=JSON_CALLBACK';
                return $http.jsonp(baseUrl + apiRequest).success(
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
                        '&userIdentifier=' + userIdentifier +
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
                        '&userIdentifier=' + userIdentifier +
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

