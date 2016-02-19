(function () {
    var css = require('../css/style.css');
    var Delegator = require("dom-delegator");
    Delegator();
    function constructor(opts){
        var router = require('./services/router.js');
        var dataService = require('./services/data');
        var confService = require('./services/config');
        var optionsService = require('./services/options');
        var initializer = require('./services/initializer');
        var templateService = require('./services/templates');
        var mediator = require('mediatorjs');
        var h = require('virtual-dom/h');
        var Api = require('./services/api');
        var mInstance = new mediator.Mediator();
        var data = new dataService(mInstance);
        var config = new confService(mInstance, data);
        var services = {
            data: data,
            config: new confService(mInstance, data),
            mediator: mInstance,
            options: new optionsService(mInstance),
            templates: new templateService()
        };
        var states = {
            'import': {
                title: 'Import',
                dependencies: function(){
                    var that = {};
                    that.import = require('./components/import.js')(services);
                    return that;
                },
                template: function (dependencies) {
                    return h('div', [dependencies.import.template()]);
                },
                destroy: function(dependencies){
                    dependencies.import.destroy()
                }
            },
            'templates': {
                title: 'Templates',
                dependencies: function(){
                    var that = {};
                    that.templateSelection = require('./components/templateSelection.js')(services);
                    return that;
                },
                template: function (dependencies) {
                    return h('div', [dependencies.templateSelection.template()]);
                }
            }
        };
        // initialise the application with given options
        initializer(opts, services);
        if(typeof opts.element !== 'undefined'){
            opts.element.className += ' ec';
            var mainRouter = new router(opts.element, states , services);
            mainRouter.goToState('import');
        }

        return new Api(services);
    }

    window.ec = constructor;
})();

