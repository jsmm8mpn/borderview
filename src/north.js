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