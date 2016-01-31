(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./region":7}],2:[function(require,module,exports){
var injections = [

];

var BorderRegion = function(

) {
	return {
		restrict: 'EAC',
		transclude: true,
		templateUrl: 'borderregion.html',
		scope: {
			region: '@',
			handleSize: '@',
			defaultSize: '@',
			handleTitle: '@',
			locked: '=',
			maxSize: '@',
			minSize: '@'
		},
		require: '^borderLayout',
		link: function($scope, element, attrs, borderLayoutCtrl) {
			$scope.regionObj = borderLayoutCtrl.register($scope, element);
		}
	}
};


BorderRegion.$inject = injections;
module.exports = BorderRegion;
},{}],3:[function(require,module,exports){
var Center = function() {
	this.resize = function(regions) {
		this.element.css({
			top: regions.north?regions.north.getTotalSize():0,
			right: regions.east?regions.east.getTotalSize():0,
			bottom: regions.south?regions.south.getTotalSize():0,
			left: regions.west?regions.west.getTotalSize():0,
			width: 'auto',
			height: 'auto'
		});
	};
};

module.exports = Center;
},{}],4:[function(require,module,exports){
var East = function() {
	this.resize = function(regions) {
		this.element.css({
			top: this.getDynamicSize(regions.north),
			bottom: this.getDynamicSize(regions.south),
			width: this.getTotalSize()
		});
		this.getContent().css({
			width: this.size + "px"
		});
		this.getHandle().css({
			width: this.handleSize +"px"
		});
	};
	this.getDragPosition = function(pos) {
		return this.size - pos.left;
	};
	this.dragAxis = 'x';
	this.getContainment = function() {
		return {
			top: 0,
			bottom: 0,
			right: 0,
			width: 'calc(' + this.maxSize + ' - ' + this.minSize + ')'
		};
	};
};

module.exports = East;
},{}],5:[function(require,module,exports){
var borderlayout = require('./borderlayout');
var borderregion = require('./borderregion');
require('./templates');

angular.module('borderlayout', ['templates'])
	.directive('borderLayout', borderlayout)
	.directive('borderRegion', borderregion)
;
},{"./borderlayout":1,"./borderregion":2,"./templates":9}],6:[function(require,module,exports){
var North = function() {
	this.dragAxis = 'y';
	this.resize = function (regions) {
		this.element.css({
			left: this.getDynamicSize(regions.west),
			right: this.getDynamicSize(regions.east),
			height: this.getTotalSize()
		});
		this.getContent().css({
			height: this.size
		});
		this.getHandle().css({
			height: this.handleSize
		});
	};
	this.getDragPosition = function (pos) {
		return pos.top;
	};
	this.getContainment = function () {
		return {
			top: 0,
			left: 0,
			right: 0,
			height: 'calc(' + this.maxSize + ' - ' + this.minSize + ')'
		};
	};
};

module.exports = North;
},{}],7:[function(require,module,exports){
var North = require('./north');
var South = require('./south');
var West = require('./west');
var East = require('./east');
var Center = require('./center');

var Region = function(config, element, parent) {

	var region = config.region;
	var defaultSize = config.defaultSize;
	var handleSize = config.handleSize;
	var maxSize = config.maxSize;
	var minSize = config.minSize;
	var locked = config.locked;

	if (!defaultSize) {
		defaultSize = '400';
	}

	handleSize = parseInt(handleSize || 20);

	if (!defaultSize.match(/.*%$/)) {
		defaultSize = parseInt(defaultSize);
	}

	this.locked = locked;
	this.parent = parent;
	this.size = defaultSize;
	this.maxSize = maxSize || '50%';
	this.minSize = minSize || '0px';
	this.handleSize = handleSize;
	this.element = element;
	this.lastSize = defaultSize;
	this.priority = config.priority;

	switch(region) {
		case 'north':
			North.call(this);
			break;
		case 'south':
			South.call(this);
			break;
		case 'west':
			West.call(this);
			break;
		case 'east':
			East.call(this);
			break;
		case 'center':
			Center.call(this);
			break;
	}
};

Region.prototype.getContent = function() {
	if (!this.content) {
		this.content = this.element.children('.content');	
	}
	return this.content;
};

Region.prototype.getHandle = function() {
	if (!this.handle) {
		this.handle = this.element.children('.handle');	
	}
	return this.handle;
};

Region.prototype.getTotalSize = function() {
	if (typeof this.size === 'string') {
		return 'calc(' + this.size + ' + ' + this.handleSize + 'px)';
	} else {
		return (this.size + this.handleSize);
	}
};

Region.prototype.getContentSize = function() {
	if (typeof this.size === 'string') {
		return 'calc(100%' + ' - ' + this.handleSize + 'px)';
	} else {
		return (this.size);
	}
};

Region.prototype.setIconSize = function() {
	if (this.handleSize >= 10) {
		this.element.find('.handleIcon').css({
			'font-size': (this.handleSize - 2) + 'px'
		});
	}
};

Region.prototype.toggle = function() {
	if (this.size) {
		this.lastSize = this.size;
		this.size = 0;
	} else {
		this.size = this.lastSize;
	}
	this.parent.resize();
};

Region.prototype.getDynamicSize = function(dynamicRegion) {
	if (dynamicRegion && this.priority > dynamicRegion.priority) {
		return dynamicRegion.getTotalSize();
	} else {
		return 0;
	}
};

Region.prototype.setupDrag = function() {
	this.setIconSize();
	if (this.dragAxis) {
		var me = this;
		this.element.find('.handle').draggable({
			cancel: '.handleIcon',
			axis: this.dragAxis,
			containment: '.borderDragContainment',
			cursor: 'move',
			helper: function (event) {
				var containmentDiv = $('<div class="borderDragContainment"></div>');
				containmentDiv.css(me.getContainment());
				me.element.closest('.borderLayout').append(containmentDiv);

				var original = $(event.target);
				var helper = original.clone();
				helper.find('.handleIcon,.handleVerticalTitle').remove();
				helper.addClass('handleHelper');
				return helper;
			},
			stop: function (e, ui) {
				me.element.closest('.borderLayout').find('.borderDragContainment').remove();
				var newSize = me.getDragPosition(ui.position);
				me.size = newSize < 50 ? 0 : newSize;
				me.parent.resize(true);
			}
		});
	}
};

module.exports = Region;
},{"./center":3,"./east":4,"./north":6,"./south":8,"./west":10}],8:[function(require,module,exports){
var South = function() {
	this.resize = function(regions) {
		this.element.css({
			left: this.getDynamicSize(regions.west),
			right: this.getDynamicSize(regions.east),
			height: this.getTotalSize()
		});
		this.getContent().css({
			height: this.size +"px"
		});
		this.getHandle().css({
			height: this.handleSize +"px"
		});
	};
	this.getDragPosition = function(pos) {
		return this.size - pos.top;
	};
	this.dragAxis = 'y';
	this.getContainment = function() {
		return {
			bottom: 0,
			left: 0,
			right: 0,
			height: 'calc(' + this.maxSize + ' - ' + this.minSize + ')'
		};
	};
};

module.exports = South;
},{}],9:[function(require,module,exports){
angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("borderregion.html","<div ng-if=\"region != \'center\' &amp;&amp; regionObj.handleSize\" ng-class=\"{locked: locked,handleLarge:regionObj.handleSize &gt;= 5,open:regionObj.size}\" ng-dblclick=\"regionObj.toggle()\" class=\"handle\"><div ng-click=\"regionObj.toggle()\" ng-show=\"!locked &amp;&amp; regionObj.handleSize &gt;= 5\" class=\"handleIcon\"><img src=\"src/arrow-down.svg\"/></div><!--.handleTitle(ng-if=\"handleTitle\", ng-show=\"!regionObj.size\")//span {{handleTitle | translate}}--></div><div ng-transclude=\"\" class=\"content\"></div>");}]);
},{}],10:[function(require,module,exports){
var West = function() {
	this.resize = function(regions) {
		this.element.css({
			top: this.getDynamicSize(regions.north),
			bottom: this.getDynamicSize(regions.south),
			width: this.getTotalSize()
		});
		this.getContent().css({
			width: this.getContentSize(),
			right: 'auto'
		});
		this.getHandle().css({
			width: this.handleSize + "px"
		});
	};
	this.getDragPosition = function(pos) {
		return pos.left;
	};
	this.dragAxis = 'x';
	this.getContainment = function() {
		return {
			top: 0,
			bottom: 0,
			left: this.minSize,
			width: 'calc(' + this.maxSize + ' - ' + this.minSize + ')'
		};
	};
};

module.exports = West;
},{}]},{},[5])