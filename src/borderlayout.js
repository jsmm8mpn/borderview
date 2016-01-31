var Region = require('./region');

var injections = [
	'$rootScope',
	'$timeout',
	'$log'
];

var ConfigTabs = function(
	$rootScope,
	$timeout,
	$log
) {
	return {
		restrict: 'EAC',
		scope: {},
		controllerAs: '',
		controller: ['$scope', function($scope) {
			var regions = {};
			var initTimeout;

			// need to run this after all regions have registered themselves, and have finished rendering
			var me = this;
			function init() {
				initTimeout = $timeout(function() {
					me.resize();

					for (var key in regions) {
						if (!regions[key].locked) {
							regions[key].setupDrag();
						}
					}
				});
			}

			var priority = 0;
			this.register = function(config, element) {
				if (initTimeout) {
					$timeout.cancel(initTimeout);
				}
				init();

				if (!regions[config.region]) {
					config.priority = priority++;
					var region = new Region(config, element, this);
					regions[config.region] = region;
					return region;
				} else {
					$log.error('The ' + config.region + ' region already exists. Not creating another one.');
				}
			};

			function resize() {
				for (var key in regions) {
					regions[key].resize(regions);
				}
			}
			
			this.resize = function(apply) {
				if (apply) {
					$scope.$apply(function() {
						resize();
					});
				} else {
					resize();
				}
			};

		}]
	}
};


ConfigTabs.$inject = injections;
module.exports = ConfigTabs;