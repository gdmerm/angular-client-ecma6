class EntersoftUISelectOption {
    constructor() {
        this.restrict = 'A';
        this.require ='^entersoftSelect';
        this.compile = this.compileFn;
        this.scope = {};
    }

    compileFn(tElem, tAttrs) {
        var optionIndex = 1;
        var options = null;

        return ($scope, iElem, iAttrs, selectCtrl) => {
            var scroller = iElem.parent();

            //notify parent element that all children have finished rendering
            var totalOptions = selectCtrl.$scope.vm.esOptions.length;
            if (optionIndex === totalOptions) {
                selectCtrl.allOptionsRendered.resolve( options = iElem.parent().children() );
            }
            optionIndex++;
        };
    }

    static create() {
        return new EntersoftUISelectOption();
    }
}

export default EntersoftUISelectOption.create;