/**
 * @namespace demo application
 * @version  0.0.1alpha
 * @description  The angular bootstrap file
 * @author G. D. Mermigkas
 * @email gdmerm@gmail.com
 */
import jQuery from 'jquery';
import appCoreModule from 'modules/app.core';
import appServicesModule from 'modules/app.services';
import appDemoModule from 'modules/app.demo';
import layoutModule from 'modules/app.layout';
import loginModule from 'modules/app.login';

/**
 * application main module name
 * @type {String}
 */
let applicationMainModule = 'app';

/**
 * @namespace  demo#main
 * @description  
 * this is the main module manifest for the application. Add top level
 * modules here.
 */
angular.module(applicationMainModule, [
    /**
     * core modules (webapi, ui modules and helpers)
     */
    `${applicationMainModule}.core`,

    /**
     * application specific services that are shared between modules
     */
    `${applicationMainModule}.services`,

    /**
     * application specific modules
     */
    `${applicationMainModule}.layout`,
    `${applicationMainModule}.login`,
    `${applicationMainModule}.demo`
]).
config(_appConfigfn).
run(_appRunnerfn);

/**
 * angular configuration factory
 * @description
 * used to configure angular and user defined providers
 */
function _appConfigfn($routeProvider, EnvironmentProvider) {

    /**
     * ================================
     * configure environment
     * ================================
     */
    EnvironmentProvider
        .addDevelopmentDomains([
            'localhost'
        ])
        .addProductionDomains([
            'herokuapp.com'
        ]);

    //try to detect stage from domain
    EnvironmentProvider.setStageFromDomain();

    /**
     * configure application routes
     */
    //forbid routes based on loggin status
    var routeAuthorizationsChecks = {
        loggedIn: {
            auth: ['auth', '$log', function(auth, $log) {
                return auth.authorizeRoute();
            }]
        }
    };

    $routeProvider
        .when('/', {
            templateUrl: 'modules/login/login.html',
            controller: 'app.controllers.login',
            controllerAs: 'vm'
        })
        .when('/login', {
            templateUrl: 'modules/login/login.html',
            controller: 'app.controllers.login',
            controllerAs: 'vm'
        })
        .when('/demo', {
            templateUrl: 'modules/demo/demo.html',
            resolve: routeAuthorizationsChecks.loggedIn,
            controllerAs: 'vm',
            controller: 'app.controllers.demo'
        });
}

/**
 * angular run method for main application module
 * @description
 * used to define application wide runner code
 */
function _appRunnerfn($rootScope, $log, $location, UrlManager) {
    $rootScope.$on('$routeChangeError', function(e, current, previous, rejection) {
        if (rejection === 'auth:notauthorized') {
            var redirect = $location.path();
            UrlManager.redirectQueryString = $location.search();
            $location.url($location.path());
            $location.path('/login');
            $location.search('onsuccessredirect', redirect);
        }
    });
}

/**
 * minifier friendly injections
 */
_appConfigfn.$inject = ['$routeProvider', 'EnvironmentProvider'];
_appRunnerfn.$inject = ['$rootScope', '$log', '$location', 'UrlManager'];