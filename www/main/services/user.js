import _ from 'lodash';

class User {
    constructor($q, mockdata) {
        this.$q = $q;
        this.mockdata = mockdata;
        this.connectionModel = null;
    }

    /**
     * emulate a login session request.
     */
    openSession() {
        var deferred = this.$q.defer();
        this.connectionModel = this.mockdata.getSession();
        deferred.resolve(this.connectionModel);
        return deferred.promise;
    }

    getSession() {
        return this.connectionModel;
    }

    isGuest() {
        var guest = true;
        if (this.connectionModel !== null && typeof this.connectionModel !== 'undefined') {
            guest = false;
        }
        return guest;
    }

    isAdmin() {
        return (!this.isGuest() && this.connectionModel.Administrator);
    }

    isInactive() {
        return (!this.isGuest() && this.connectionModel.Inactive);
    }

    authorizeRoute() {
        if (!this.isGuest()) {
            return true;
        } else {
            return this.$q.reject('auth:notauthorized');
        }
    } 

    static create($q, mockdata) {
        return new User($q, mockdata);
    }
}

User.create.$inject = ['$q', 'mockdata'];
export default User.create;