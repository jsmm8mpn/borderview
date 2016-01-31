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