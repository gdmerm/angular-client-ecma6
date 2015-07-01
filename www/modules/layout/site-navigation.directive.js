class SiteNavigationDirective {
    constructor() {
        this.restrict = 'E';
        this.controller = SiteNavigationController;
        this.compile = this.compilefn;
        this.controllerAs = 'vm';
        this.bindToController = true;
        this.templateUrl = 'modules/layout/site-navigation.directive.html';
        this.scope = {};
    }

    compilefn() {
        return {
            pre: ($scope, iElem, iAttrs, controllers) => {},
            post: ($scope, iElem, iAttrs, controllers) => {}
        }
    }

    static create() {
        return new SiteNavigationDirective();
    }
}

class SiteNavigationController {
    constructor(User, Environment) {
        this.Environment = Environment;
        this.session = User;
        console.log(this.session);
        this.userOptions = [{
            text: "Αρχική",
            href: "#/home"
        }, {
            text: "Δημιουργία πελάτη",
            href: "#/customer"
        }, {
            text: "Λίστα πελατών",
            href: "#/list"
        }, {
            divider: true
        }, {
            text: "Αποσύνδεση",
            click: "ctrl.logout()"
        }];

    }
}

SiteNavigationController.$inject = ['User', 'Environment'];
export default SiteNavigationDirective.create;