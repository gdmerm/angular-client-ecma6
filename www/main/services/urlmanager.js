class UrlManager {
    constructor($location) {
        this.$location = $location;
        this.redirectQueryString = '';
        this.lastSearch = {
            path: null,
            query: null
        };
    }

    /**
     * [addElasticFilter description]
     * @param {[type]} bucket [description]
     * todo: write logic that uses "result.key" or "result.key_as_string" appropriately. 
     * This also means that we do  not pass "value" anymore, instead we pass the "result" item as a whole.
     */
    updateSearchUrl(field, value) {
        $location.search(field, value);
    };

    /**
     * deletes passed field from the querystring triggering a routeUpdate event
     * @param  {[string]} field
     */
    deleteUrlFilter(field) {
        $location.search(field, null);
    };

    getQueryString() {
        var params = $location.search();
        var qstring = '';
        for (var paramName in params) {
            qstring += paramName + '=' + params[paramName] + '&';
        }
        qstring = qstring.substr(0, qstring.length - 1);
        return qstring;
    };

    clearQueryString() {
        $location.url($location.path());
    };

    saveLastActiveSearch() {
        this.lastSearch.path = $location.path();
        this.lastSearch.query = $location.search();
    };

    getLastActiveSearch() {
        this.clearQueryString();
        $location.path('/search');
        var query = this.lastSearch.query;
        for (var paramName in query) {
            $location.search(paramName, query[paramName]);
        }
    };

    static create() {
        return new UrlManager();
    }
}

UrlManager.$inject = ['$location'];
export default UrlManager.create;