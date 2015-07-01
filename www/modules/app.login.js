/**
 * @namespace app.login
 * @description login module
 */
import loginController from './login/login.controller';
angular.module('app.login', [])
    .controller('app.controllers.login', loginController);
