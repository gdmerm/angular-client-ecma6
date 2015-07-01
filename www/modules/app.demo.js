let moduleName = 'app.demo';
import DemoController from './demo/demo.controller';

angular.module(moduleName, [])
    .controller('app.controllers.demo', DemoController);

export default moduleName;