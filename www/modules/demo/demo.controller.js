class DemoController {
    constructor() {
        /**
         * a list of technologies
         * @type {Object}
         */
        this.dropdowns = {technologies: [
            'Java',
            'JavaScript',
            'Objective C',
            'Swift',
            'Scala',
            'CSharp',
            '.NET',
            'angular',
            'react',
            'ember',
            'knockout',
            'git',
            'c++',
            'c',
            'gulp',
            'grunt'
        ]}; 

        /**
         * object where ng-model is bound
         * @type {Object}
         */
        this.formModel = {
            technologies: null
        };
    }
}

export default DemoController;