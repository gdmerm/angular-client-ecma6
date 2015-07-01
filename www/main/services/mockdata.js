class MockData {
    constructor() {
        /**
         * mock a user session
         * @type {Object}
         */
        this.session = {
            Administrator: true,
            Inactive: false
        }
    }

    /**
     * access mutator
     * @return {SessionDataObject}
     */
    getSession() {
        return this.session;
    }

}

export default MockData;