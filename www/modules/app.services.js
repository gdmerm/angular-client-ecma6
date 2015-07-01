let moduleName = 'app.services';
import authService from '../main/services/auth';
import UserFactory from '../main/services/user';
import MockDataService from '../main/services/mockdata';
import UrlManagerService from '../main/services/urlmanager';

angular.module(moduleName, [])
    .service('auth', authService)
    .service('mockdata', MockDataService)
    .service('UrlManager', UrlManagerService)
    .factory('User', UserFactory);

export default moduleName;