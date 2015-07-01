//import _ from 'underscore';
class EntersoftUISelect {
    constructor() {
        this.restrict = 'EA';
        this.scope = {
            esOptions: '=',
            name: '@',
            esModel: '=ngModel',
            disabled: '@',
            esSelectMode: '@',
            esOptionText: '@',
            esOptionValue: '@',
            esPlaceholder: '@',
            esTransliterate: '@'
        };
        this.require = ['ngModel', 'entersoftSelect'];
        this.bindToController = true;
        this.controllerAs = 'vm';
        this.controller = EntersoftUISelectController;
        this.template = EntersoftUISelect.template;
        this.compile = this.compileFn;
    }

    compileFn(tElem, tAttrs) {

        //replace some bindings when esOptions is an array of objects [{}, {}]
        if (typeof tAttrs.esOptionText !== 'undefined') {
            let template = tElem.html();
            template = template
                .replace(/\:\:option/g, '::option.' + tAttrs.esOptionText);
            tElem.html('').append(angular.element(template));
        }

        return {
            pre: ($scope, iElem, iAttrs) => {},
            post: ($scope, iElem, iAttrs, controllers) => {
                var selectCtrl = controllers[1];
                var selectToggleButton = iElem.find('button');
                var hiddenInput = iElem.find('input[type="hidden"]');
                var searchInput = iElem.find('input[type="text"]');

                //cache some elements in the controller
                iElem.addClass('es-select');
                selectCtrl.getElementsCache().hiddenInput = hiddenInput;
                selectCtrl.getElementsCache().toggleButton = selectToggleButton;
                selectCtrl.getElementsCache().searchInput = searchInput;
                selectCtrl.applyValidationListeners();
                selectCtrl.bindKeyboard();

                //stop propagation of click event to document level when clicking
                //anywhere within the dropdown control
                iElem.on('click', e => {
                    e.stopPropagation();
                });

                //close dropdown on document click
                selectCtrl.getElementsCache().$body.on('click.esui-select', e => {
                    selectCtrl.$scope.$apply(function _closeDropdownFromDocument() {
                        selectCtrl.collapse(false);    
                    });
                });

                //clean up
                $scope.$on('$destroy', function cleanup() {
                    selectCtrl.getElementsCache().$body.off('click.esui-select');
                    iElem.off('keydown');
                    iElem.off('keypress');
                    iElem.off('blur');
                    selectCtrl.getElementsCache().toggleButton
                        .off('esuiselect:collapsed')
                        .off('blur');
                });
            }
        };
    }

    static create() {
        return new EntersoftUISelect();
    }

    static template() {
        return `
            <div class="es-select">
                <span ng-class="{'es-select-toggle-expanded': vm.active}" class="fa fa-sort-down es-select-toggle-icon"></span>
                <button ng-click="vm.toggle($event)" class="btn btn-default btn-block" type="button">{{ vm.displayLabel }}</button>
                <input id="{{ ::vm.uuid }}" type="hidden" required ng-model="vm.esModel" name="{{ ::vm.name }}" />
                <ul entersoft-select-keyboard-navigator ng-show="vm.active" ng-class="{show: vm.active}" class="es-select-options select dropdown-menu am-fade">
                    <input type="text" ng-model="vm.search" ng-change="(vm.selectMode === 'native') ? vm.filterOptions() : vm.suggestOptions()" ng-model-options="{debounce: (vm.selectMode === 'native' ? 200 : 500)}" placeholder="{{ 'search' }}" />
                    <span class="fa fa-search"></span>
                    <div class="es-select-option-scroller" ng-if="vm.selectMode === 'native'">
                        <li entersoft-select-option ng-class="{'es-select-option-selected': vm.selectedOption === option, 'keyboard-selected': vm.selectedOption === option && vm.touched}" ng-repeat="option in vm.esOptions" class="es-select-option" ng-click="vm.selectOption(option)" ><a href>{{ ::option }}</a></li>
                    </div>
                    <div class="es-select-option-scroller" ng-if="vm.selectMode === 'suggest'">
                        <li entersoft-select-option ng-repeat="option in vm.suggestedOptions" ng-click="vm.selectOption(option)"><a href>{{ ::option }}</a></li>
                    </div>
                </ul>
            </div>
        `;
    }
}

class EntersoftUISelectController {
    constructor($scope, element, $q, $window, $timeout) {
        this.$scope = $scope;
        this.element = element;
        this.allOptionsRendered = $q.defer();
        this.$q = $q;
        this.$timeout = $timeout;

        /**
         * property used only when our dropdown is on `suggest` mode.
         * Used in template binding to render the suggested options
         * @type {Array}
         */
        this.suggestedOptions = [];

        /**
         * dropdown mode, can be
         * a. `native` [default] behaves as a standard dropdown control
         * b. `suggest` Will only render options that match the texbox search
         * @type {String}
         */
        this.selectMode = 'native';

        /**
         * track whether the control is readonly
         * @type {Boolean}
         */
        this.isDisabled = false;

        /**
         * cache the value of the selected option
         * @type {string|number|object}
         */
        this.selectedOption = null;

        /**
         * track whether the select is expanded
         * @type {Boolean}
         */
        this.active = false;

        /**
         * search term to filter select options
         * @type {String}
         */
        this.search = '';

        /**
         * this is the label that displays the selected option label
         * @type {String}
         */
        this.displayLabel = 'choose...';

        /**
         * track whether the user has already interacted with the control or not
         * @type {Boolean}
         */
        this.touched = false;

        /**
         * track if character transliteration to greek from latin is switched on
         * @type {Boolean}
         */
        this.transliterationEnabled = false;

        /**
         * a map of accented characters to non accented ones.
         * @todo : move this and its foldAccent() method to some other place.
         * @type {Object}
         */
        this.accentMap = {
            'ά': 'α',
            'ό': 'ο',
            'έ': 'ε',
            'ύ': 'υ',
            'ή': 'η',
            'ί': 'ι',
            'ώ': 'ω'
        };

        /**
         * a map of greek characters based on latin keyboard layouts
         * @type {Object}
         */
        this.tranlisterateMap = {
            'a': 'α',
            'b': 'β',
            'c': 'ψ',
            'd': 'δ',
            'e': 'ε',
            'f': 'φ',
            'g': 'γ',
            'h': 'η',
            'i': 'ι',
            'j': 'ξ',
            'k': 'κ',
            'l': 'λ',
            'm': 'μ',
            'n': 'ν',
            'o': 'ο',
            'p': 'π',
            'q': 'κ',
            'r': 'ρ',
            's': 'σ',
            't': 'τ',
            'u': 'θ',
            'v': 'ω',
            'w': 'ς',
            'x': 'χ',
            'y': 'υ',
            'z': 'ζ'
        };

        /**
         * cache some DOM elements so we dont have to select them again and again
         * @type {Object}
         */
        this.cachedElements = {
            options: null,
            hiddenInput: null,
            toggleButton: null,
            searchInput: null,
            element: null,
            $body: angular.element($window.document)
        };

        //initialize
        this.init();
    }

    init() {
        this.uuid = this.uuid();
        this.selectMode = this.$scope.vm.esSelectMode || 'native';
        this.transliterationEnabled = this.$scope.vm.esTransliterate || false;

        //all child options have rendered, do some more work now
        //note: this promise is resolved only on `native` mode
        this.ready().then(options => {
            this.setOptions(options);
            if (this.element.attr('disabled') === 'disabled') {
                this.disable();
            }
        });

        //select option
        //this.selectedOption = this.displayLabel = this.$scope.vm.esModel || 'choose...';
        this.selectOption(this.$scope.vm.esModel);
    }

    ready() {
        return this.allOptionsRendered.promise;
    }

    /**
     * generate a unique random id.
     * @todo : consider moving this to a more central location
     * @return {[type]} [description]
     */
    uuid() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    }

    /**
     * remove accents from characters
     * @param  {string} s the accented character
     * @return {[type]}   the character without accent
     */
    foldAccent(s) {
        if (!s) {
            return '';
        }
        var ret = '';
        for (var i = 0; i < s.length; i++) {
            ret += this.accentMap[s.charAt(i)] || s.charAt(i);
        }
        return ret;
    }

    /**
     * swaps latin characters for greek
     * @param  {string} s [description]
     * @return {string} the greek version of the character
     */
    transliterate(s) {
        if (!s) {
            return '';
        }
        var ret = '';
        for (var i = 0; i < s.length; i++) {
            ret += this.tranlisterateMap[s.charAt(i)] || s.charAt(i);
        }
        return ret;
    }

    /**
     * used in `native` mode. Uses DOM selection to show / hide options based
     * on the search term on the search textbox.
     */
    filterOptions() {
        var options = this.getElementsCache().options;
        var search = this.foldAccent(this.search);
        if (this.transliterationEnabled) {
            search = this.transliterate(search);
        }
        angular.forEach(options, option => {
            var haystack = this.foldAccent(option.firstChild.innerHTML);
            var regexp = new RegExp(search, 'i');
            if (haystack.search(regexp) === 0) {
                //option.className = option.className.replace('ng-hide', '').replace('  ', ' ');
                angular.element(option).removeClass('ng-hide');
            } else {
                //option.className = option.className.replace('ng-hide', '').replace('  ', ' ') + ' ng-hide';
                angular.element(option).addClass('ng-hide');
            }
        });
    }

    /**
     * used in 'suggest' mode. 
     * Binds to `this.suggestedOptions` to draw the dropdown list
     */
    suggestOptions() {
        var options = this.$scope.vm.esOptions;
        var search = this.foldAccent(this.search);
        if (this.transliterationEnabled) {
            search = this.transliterate(search);
        }
        this.suggestedOptions = [];
        if (this.search === '') return;
        angular.forEach(options, option => {
            var haystack = this.foldAccent(option);
            var regexp = new RegExp(search, 'i');

            if (haystack.search(regexp) === 0) {
                this.suggestedOptions.push(option);
            }
        });
    }

    /**
     * will reset any hidden options back to visible
     */
    resetOptionFilters() {
        var options = this.getElementsCache().options;
        angular.forEach(options, option => {
            option.className = option.className.replace('ng-hide', '');
        });
        this.suggestedOptions = [];
    }

    /**
     * select the option and update our internal model
     * @param  {string | number | object} option
     */
    selectOption(option) {
        this.$scope.$broadcast('keyboardNavigator:resetKeyboardSelection');
        this.selectedOption = this.$scope.vm.esModel = option;
        this.displaySelectedOption();
        this.collapse();
    }

    /**
     * set the display of the selected option
     */
    displaySelectedOption() {
        var option = this.selectedOption;
        if (typeof option === 'string' && option) {
            this.displayLabel = this.selectedOption
        } else if (typeof option === 'object' && option !== null) {
            this.displayLabel = option[this.$scope.vm.esOptionText];
        } else {
            this.displayLabel = this.$scope.vm.esPlaceholder || 'choose...'
        }
    }

    /**
     * methods to manipulate cached dom elements
     * @method  getElementsCache()
     * @method  setOptions()
     */
    getElementsCache() {
        return this.cachedElements;
    }
    setOptions(options) {
        this.cachedElements.options = options;
    }

    /**
     * toggle the dropdown
     * @return {[type]} [description]
     */
    toggle($event) {
        //readonly control
        if (this.checkReadOnly()) return;

        //toggle the control
        if (this.active)  {
            this.collapse()
        } else {
            this.expand();
        }
    }

    /**
     * expand the dropdown
     */
    expand() {
        var deferred = this.$q.defer();
        if (this.checkReadOnly()) return;
        this.active = true;
        this.autofocus();
        deferred.resolve();
        return deferred.promise;
    }

    /**
     * collapse the dropdown into its selected state
     * @param {boolean} withFocus If true, then the dropdown focus is preserved
     */
    collapse(withFocus=true) {
        if (this.checkReadOnly() || !this.active) return;
        this.touched = true;
        this.active = false;
        this.search = '';
        this.resetOptionFilters();
        if (withFocus) {
            this.getElementsCache().toggleButton.trigger('esuiselect:collapsed');
        }
    }

    disable() {
        this.isDisabled = true;
    }

    //check readonly (disabled) control
    checkReadOnly() {
        this.isDisabled = (this.element.attr('disabled') === 'disabled');
        return this.isDisabled;
    }

    /**
     * apply some dom event listeners
     */
    applyValidationListeners() {
        var cachedElements = this.getElementsCache();
        var toggleButton = cachedElements.toggleButton;
        var hiddenInput = cachedElements.hiddenInput;

        toggleButton.on('esuiselect:collapsed', e => {
            this.element.removeClass('ng-untouched').addClass('ng-touched');
            this.getElementsCache().toggleButton.focus();
        });

        toggleButton.on('blur.esui-select', e => {
            this.element.removeClass('ng-untouched').addClass('ng-touched')
        });
    }

    /**
     * handles all keyboard control for our dropdown control.
     * @todo : consider refactoring this method into more reusable bits
     */
    bindKeyboard() {
        if (this.isDisabled) return;
        this.element.on('keydown.esui-select', (e) => {
            var code = (e.keyCode) ? e.keyCode : e.which;

            //esc while close the dropdown
            if (code === 27) {
                this.$scope.$apply(this.collapse.bind(this)); 
            }

            //enter toggles the dropdown while we are focused on the button
            if (code === 13) {
                e.preventDefault();
                this.$scope.$apply(this.toggle.bind(this));
            }

        });

        this.element.on('keypress.esui-select', (e) => {
            //alphanumeric character pressed and the dropdown is collapsed. Let's autoexpand
            //(Simulates the keyboard search in native select elements)
            var code = (e.keyCode) ? e.keyCode : e.which;

            //do nothing if this is the escape, TAB keys
            if (code === 27 || code === 9) return;

            //expand the dropdown on any other keypress
            if (!this.active) {
                this.$scope.$apply(() => {
                    this.expand().then(() => {
                        this.$timeout(() => {
                            this.getElementsCache().searchInput.val(String.fromCharCode(e.which));
                        }, 50);
                    })
                });
            }
        });

        this.getElementsCache().searchInput.on('keydown.esui-select', e => {
            //enter is pressed while searching on textbox. Do nothing.
            var code = (e.keyCode) ? e.keyCode : e.which;
            if (code === 13) {
                e.preventDefault();
            }
        });

        this.getElementsCache().searchInput.on('keypress', e => {
            //typing into the search box should reset any previous selected items
            var code = (e.keyCode) ? e.keyCode : e.which;
            //exclude the arrow keys
            if (code < 37 && code > 40 ) {
                this.$scope.$broadcast('keyboardNavigator:resetKeyboardSelection');
            }
        });

    }

    /**
     * methods that reference the DOM
     */
    autofocus() {
        setTimeout( () => { this.getElementsCache().searchInput.focus(); }, 50);
    }
}


EntersoftUISelectController.$inject = ['$scope', '$element', '$q', '$window', '$timeout'];
export default EntersoftUISelect.create;