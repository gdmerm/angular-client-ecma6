class LoginController {
    constructor($location, Environment, auth) {
        this.$location = $location;
        this.auth = auth;
        this.assetsPath = Environment.getAssetsPath();

        this.user = {
            UserID: null,
            Password: null
        };

        this.credentials = {
            UserID: '',
            Password: '',
            BranchID: 1,
            LangID: 'el-GR'
        };
    }

    /**
     * log a user to the system
     */
    doLogin() {
        //abort in case of validation errors
        if (this.user.UserID === '' ||
             this.user.Password === '' || 
             this.user.UserID === null || 
             this.user.Password === null ) { return; }
        var self = this;

        //update with user credentials
        angular.extend(this.credentials, this.user);

        //call webapi to login the user
        var onLoginSuccess = function onLoginSuccessCallback() {
            var handlePostlogin = self.auth.handlePostLogin;
            return function (data) {
                handlePostlogin.apply(self.auth, arguments)
            };
        };

        this.auth
            .login(this.credentials)
            .then(onLoginSuccess());
    } //doLogin()
}

LoginController.$inject = [
    '$location', 
    'Environment',
    'auth'
];
export default LoginController;
