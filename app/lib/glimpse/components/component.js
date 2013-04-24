define([
  'components/line',
  'components/legend',
  'components/axis',
  'components/label',
  'components/overlay',
  'components/asset',
  'components/area',
  'components/domain-label'
],
function(line, legend, axis, label, overlay, asset, area, domainLabel) {
  'use strict';

  return {
    line: line,
    legend: legend,
    axis: axis,
    label: label,
    overlay: overlay,
    asset: asset,
    area: area,
    domainLabel: domainLabel
  };

});
