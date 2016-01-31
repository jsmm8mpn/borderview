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