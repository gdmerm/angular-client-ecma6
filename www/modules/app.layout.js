/**
 * @namespace loreal.layout
 * @description Common UI/UX components
 */
import templateServiceModule from '../main/services/template';
import layoutNavigationDirective from './layout/site-navigation.directive';

angular.module('app.layout', [templateServiceModule])
    .directive('layoutSiteNavigation', layoutNavigationDirective);

export default 'app.layout';
