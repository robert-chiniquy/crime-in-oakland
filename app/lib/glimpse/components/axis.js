/**
 * @fileOverview
 * Axis component.
 */
define([
  'core/object',
  'core/config',
  'core/string',
  'mixins/mixins',
  'd3-ext/util'
],
function(obj, config, string, mixins, d3util) {
  'use strict';

  return function() {

    var config_,
      defaults_,
      root_,
      d3axis_;

    config_ = {};

    defaults_ = {
      type: 'axis',
      axisType: 'x',
      gap: 0,
      target: null,
      color: '#333',
      opacity: 0.8,
      fontFamily: 'arial',
      fontSize: 10,
      textBgColor: '#fff',
      textBgSize: 3,
      tickSize: 0,
      ticks: 3,
      hiddenStates: null
    };

    /**
     * Translates the zero tick on the Y-axis by 10
     * @private
     */
    function setZeroTickTranslate(selection) {
      var transform, translate, x, y;
      transform = selection.attr('transform');
      translate = transform.split(',');
      x = translate[0].split('(')[1];
      y = translate[1].split(')')[0];
      selection.attr('transform', 'translate(' + [x, y-10] + ')');
    }

    /**
     * Changes the default formatting of the d3 axis.
     * @private
     */
    function formatAxis() {
      var zeroTick, zeroTickLabel;
      // remove boldness from default axis path
      root_.selectAll('path')
        .attr({
          'fill': 'none'
        });

      // update fonts
      root_.selectAll('text')
        .attr({
          'stroke': 'none',
          'fill': config_.color
        });

      //Apply padding to the first tick on Y axis
      if (config_.axisType === 'y') {
        zeroTick = root_.select('g');

        if (zeroTick.node()) {
          zeroTickLabel = zeroTick.text() +
            (config_.unit ? ' ' + config_.unit : '');
          zeroTick.select('text').text(zeroTickLabel);
          setZeroTickTranslate(zeroTick);
        }
      }

      // apply text background for greater readability.
      root_.selectAll('.gl-axis text').each(function() {

        var textBg = this.cloneNode(true);
        d3.select(textBg).attr({
          stroke: config_.textBgColor,
          'stroke-width': config_.textBgSize
        });
        this.parentNode.insertBefore(textBg, this);
      });

      // remove axis line
      root_.selectAll('.domain')
        .attr({
          'stroke': 'none'
        });
    }

    /**
     * Repositions the root node within the parent DOM to ensure it's always
     * last and therefore appears above other elements.
     *
     * @private
     */
    function repositionDOM() {
      var rootNode, parentNode;

      // Not rendered yet.
      if (!root_) {
        return;
      }
      rootNode = root_.node();
      if (rootNode.nextElementSibling) {
        parentNode = rootNode.parentNode;
        root_.remove();
        parentNode.appendChild(rootNode);
      }
    }

    /**
     * Main function for Axis component.
     */
    function axis() {
      obj.extend(config_, defaults_);
      d3axis_ = d3.svg.axis();
      axis.rebind(
        d3axis_,
        'scale',
        'orient',
        'ticks',
        'tickValues',
        'tickSubdivide',
        'tickSize',
        'tickPadding',
        'tickFormat');
      return axis;
    }

    // Apply mixins.
    obj.extend(
      axis,
      config.mixin(
        config_,
        'cid'),
      mixins.lifecycle,
      mixins.toggle);

    /**
     * Event dispatcher.
     * @public
     */
    axis.dispatch = mixins.dispatch();

    /**
     * Apply updates to the axis.
     */
    axis.update = function() {
      if (!root_) {
        return axis;
      }
      root_.selectAll('g').remove();
      axis.reapply();
      root_.call(d3axis_);
      root_.attr({
        'font-family': config_.fontFamily,
        'font-size': config_.fontSize,
        'class': string.classes('component',
            'axis', config_.axisType + '-axis '),
        'stroke': config_.color,
        'opacity': config_.opacity
      });
      if (config_.cid) {
        root_.attr('gl-cid', config_.cid);
      }

      formatAxis();
      repositionDOM();
      axis.dispatch.update.call(this);
      return axis;
    };

    /**
     * Render the axis to the selection
     * @param {d3.selection|String} selection A d3 selection
     * @return {component.axis}
     */
    axis.render = function(selection) {
      if (!root_) {
        root_ = d3util.applyTarget(axis, selection, function(target) {
          return target.append('g')
            .attr({
              'fill': 'none',
              'shape-rendering': 'crispEdges',
              'stroke-width': 1
            });
        });
      }
      axis.update();
      axis.dispatch.render.call(this);
      return axis;
    };

    /**
     * Gets or sets the d3axis function
     * @param  {d3.svg.axis} d3Axis
     * @return {component.axis}
     */
    axis.d3axis = function(d3Axis) {
      if (d3Axis) {
        d3axis_ = d3Axis;
        return axis;
      }
      return d3axis_;
    };

    /**
     * Returns the root_
     * @return {d3.selection}
     */
    axis.root = function() {
      return root_;
    };

    /**
     * Destroys the axis and removes everything from the DOM.
     * @public
     */
    axis.destroy = function() {
      if (root_) {
        root_.remove();
      }
      root_ = null;
      config_ = null;
      defaults_ = null;
      d3axis_ = null;
      axis.dispatch.destroy.call(this);
    };

    return axis();
  };

});
