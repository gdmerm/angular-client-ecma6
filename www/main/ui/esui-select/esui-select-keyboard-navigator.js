/**
 * @class  EntersoftUISelectKeyboardNavigator
 * @description applies arrow navigation to the dropdown options list
 */

class EntersoftUISelectKeyboardNavigator {

    constructor() {
        this.restrict = 'A';
        this.require = ['^entersoftSelect', 'entersoftSelectKeyboardNavigator']
        this.scope = {};
        this.controller = EntersoftUISelectKeyboardController;
        this.compile = this.compilefn;
    }

    compilefn(tElem, tAttrs) {
        return ($scope, iElem, iAttrs, controllers) => {
            var selectCtrl = controllers[0];
            var keyboardCtrl = controllers[1];
            keyboardCtrl.parentController = selectCtrl;

            var cleanup = $scope.$on('keyboardNavigator:resetKeyboardSelection', function () {
                keyboardCtrl.resetKeyboardIndex();
                iElem.find('li').removeClass('keyboard-selected');
            });

            $scope.$on('$destroy', () => { cleanup() });
        };
    }

    static create() {
        return new EntersoftUISelectKeyboardNavigator();
    }

}

class EntersoftUISelectKeyboardController {
    constructor($scope, element) {
        this.element = element;
        this.$scope = $scope;
        this.selectedIndex = -1;
        this.applyKeyboard();
        this.scrollerListHeight = 350;
    }

    applyKeyboard() {
        this.element.on('keydown.esui-keyboard-navigator', e => {
            if (e.which === 40) {
                this.handleDownArrow();
            } else if (e.which === 38) {
                this.handleUpArrow();
            } else if (e.which === 13) {
                e.stopPropagation();
                this.handleEnterKey();
            }
        });
    }

    handleDownArrow() {
        var currentOption = this.element.find('.keyboard-selected');
        this.selectedIndex = this.element.find('li').index(currentOption);

        //cycle to the top when last option has been reached
        if (this.selectedIndex === this.parentController.$scope.vm.esOptions.length - 1) {
            currentOption.parent().get(0).scrollTop = 0;
            this.selectedIndex = -1
        }
        var nextOption = this.element.find('li').eq(this.selectedIndex + 1);

        //ignore hidden options
        while (nextOption.hasClass('ng-hide')) {
            this.selectedIndex++;
            nextOption = this.element.find('li').eq(this.selectedIndex + 1);
        }

        currentOption.removeClass('keyboard-selected');
        nextOption.addClass('keyboard-selected');
        this.selectedIndex++;
        this.syncScroll(currentOption, nextOption);
    }

    handleUpArrow() {
        var currentOption = this.element.find('.keyboard-selected');
        this.selectedIndex = this.element.find('li').index(currentOption);
        var nextOption = this.element.find('li').eq(this.selectedIndex - 1);

        //ignore hidden options
        while(nextOption.hasClass('ng-hide')) {
            this.selectedIndex--;
            nextOption = this.element.find('li').eq(this.selectedIndex - 1);
        }

        currentOption.removeClass('keyboard-selected');
        nextOption.addClass('keyboard-selected');
        this.selectedIndex--;
        this.syncScroll(currentOption, nextOption);
    }

    handleEnterKey() {
        var selectedOption = this.element.find('.keyboard-selected');
        var self = this;
        if (selectedOption.length) {
            this.$scope.$apply(function () {
                var option;
                if (self.parentController.selectMode === 'native') {
                    option = self.parentController.$scope.vm.esOptions[self.selectedIndex];
                } else {
                    option = self.parentController.suggestedOptions[self.selectedIndex];
                }
                self.parentController.selectOption(option);
            });
        }
    }

    /**
     * auto scroll the dropdown list while navigating with keyboard
     * @param  {jqueryDomNodeReference} currentItem The item currently highlighted
     * @param  {jqueryDomNodeReference} nextItem    The item which is next to be highlighted
     */
    syncScroll(currentItem, nextItem) {

        if (!(currentItem.length && nextItem.length)) {
            return;
        }

        var currentItemOffsetTop = currentItem.get(0).offsetTop;
        var nextItemOffsetTop = nextItem.get(0).offsetTop;
        var scroller = currentItem.parent();
        var scrollerElementScrollTop = scroller.get(0).scrollTop;
        var normalizedElementScrollTop = Math.abs(scrollerElementScrollTop - nextItemOffsetTop); //normalize to a window of 350px
        var step = currentItemOffsetTop - nextItemOffsetTop; 

        //scroll either up or down when the highlighted item is in the middle of the scroll window
        if ( 
            (step < 0 && (normalizedElementScrollTop >= this.scrollerListHeight / 2)) ||
            (step > 0 && (normalizedElementScrollTop <= this.scrollerListHeight / 2))
        ) {
            scroller.get(0).scrollTop += (step * -1);
        }
    }

    resetKeyboardIndex() {
        this.selectedIndex = -1;
    }
}

EntersoftUISelectKeyboardController.$inject = ['$scope', '$element'];
export default EntersoftUISelectKeyboardNavigator.create;