System.config({
  "baseURL": "/angular-client-ecma6/www",
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "bower:*": "jspm_packages/bower/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "angular": "bower:angular@1.4.1",
    "angular-animate": "bower:angular-animate@1.4.1",
    "angular-route": "bower:angular-route@1.4.1",
    "angular-sanitize": "bower:angular-sanitize@1.4.1",
    "angular-strap": "main/ui/angular-strap@2.2.4",
    "bootstrap": "bower:bootstrap@3.3.5",
    "jquery": "bower:jquery@2.1.4",
    "lodash": "npm:lodash@3.10.0",
    "moment": "npm:moment@2.10.3",
    "traceur": "github:jmcriffey/bower-traceur@0.0.87",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.87",
    "bower:angular-animate@1.4.1": {
      "angular": "bower:angular@1.4.1"
    },
    "bower:angular-route@1.4.1": {
      "angular": "bower:angular@1.4.1"
    },
    "bower:angular-sanitize@1.4.1": {
      "angular": "bower:angular@1.4.1"
    },
    "bower:angular-strap@2.2.4": {
      "angular": "bower:angular@1.4.1"
    },
    "bower:bootstrap@3.3.5": {
      "jquery": "bower:jquery@2.1.4"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:lodash@3.10.0": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:moment@2.10.3": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

