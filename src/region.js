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