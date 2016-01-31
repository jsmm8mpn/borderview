var borderlayout = require('./borderlayout');
var borderregion = require('./borderregion');
require('./templates');

angular.module('borderlayout', ['templates'])
	.directive('borderLayout', borderlayout)
	.directive('borderRegion', borderregion)
;