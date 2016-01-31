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