class auth {
    constructor(User, $log, $q, $routeParams, UrlManager, $location) {
        this.User = User;
        this.$log = $log;
        this.$q = $q;
        this.$routeParams = $routeParams;
        this.UrlManager = UrlManager;
        this.$location = $location;
    }

    authorizeRoute() {
        if (this.User && !this.User.isGuest()) {
            return true;
        } else {
            return this.$q.reject('auth:notauthorized');
        }        
    }

    logout() {
        return WebApi.logout();
    }

    login(credentials) {
        return this.User.openSession.apply(this.User, arguments);
    }

    handlePostLogin() {
        var redirect = (this.$routeParams.onsuccessredirect) ? this.$routeParams.onsuccessredirect : '/demo';
        this.$location.path(redirect);
        this.$location.search('onsuccessredirect', null);
        if (this.UrlManager.redirectQueryString) {
            for (var paramName in this.UrlManager.redirectQueryString) {
                this.$location.search(paramName, this.UrlManager.redirectQueryString[paramName]);
            }
            this.UrlManager.redirectQueryString = '';
        }       
    }
}

auth.$inject = ['User', '$log', '$q', '$routeParams', 'UrlManager', '$location'];


export default auth;