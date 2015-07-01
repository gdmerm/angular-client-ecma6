import entersoftSelectDirective from './esui-select/esui-select';
import entersoftSelectOptionDirective from './esui-select/esui-select-option';
import entersoftSelectKeyboardNavigator from './esui-select/esui-select-keyboard-navigator';

angular.module('entersoft.ui', [])
    .directive('entersoftSelect', entersoftSelectDirective)
    .directive('entersoftSelectOption', entersoftSelectOptionDirective)
    .directive('entersoftSelectKeyboardNavigator', entersoftSelectKeyboardNavigator);

export default 'entersoft.ui';
