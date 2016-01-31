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