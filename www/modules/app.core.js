import angular from 'angular';
import angularRoute from 'angular-route';
import angularAnimate from 'angular-animate';
import angularStrap from 'angular-strap';
import angularSanitize from 'angular-sanitize';
import environment from '../main/services/environment';
import ui from '../main/ui/esui-select';

let moduleName = 'app.core';

angular.module(moduleName, [
    'ngAnimate',
    'ngSanitize',
    'ngRoute',
    'mgcrea.ngStrap',
    'app.services.environment',
    'entersoft.ui'
]);

export default moduleName;