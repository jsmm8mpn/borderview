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