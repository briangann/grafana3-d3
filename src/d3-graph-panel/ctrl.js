import {MetricsPanelCtrl} from 'app/plugins/sdk';
import _ from 'lodash';
import $ from 'jquery';
import * as d3 from './external/d3.v4.min.js';
import './css/d3_graph.css!';


export class D3GraphPanelCtrl extends MetricsPanelCtrl {

  constructor($scope, $injector) {
    super($scope, $injector);
    this.initialized = false;
    this.panelContainer = null;
    this.svg = null;
    this.scoperef = $scope;

    console.log("D3GraphPanelCtrl constructor!");
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('render', this.onRender.bind(this));
    console.log("D3GraphPanelCtrl constructor done!");
  }

  // setup the editor
  onInitEditMode() {
    // determine the path to this plugin
    var panels = grafanaBootData.settings.panels;
    var thisPanel = panels[this.pluginId];
    var thisPanelPath = thisPanel.baseUrl + '/';
    // add the relative path to the partial
    var optionsPath = thisPanelPath + 'd3-graph-panel/partials/editor.options.html';
    this.addEditorTab('Options', optionsPath, 2);
  }

  setContainer(container) {
    this.panelContainer = container;
  }

  getPanelWidth() {
    // locate this panel with jQuery
    var tmpPanelWidthCSS = $("div.panel").css("width");
    var tmpPanelWidthPx = tmpPanelWidthCSS.replace("px","");
    var tmpPanelWidth = parseInt(tmpPanelWidthPx);
    // get our "span" setting
    var percentWidth = ((this.panel.span / 1.2) * 10) / 100;
    // calculate actual width
    var actualWidth = tmpPanelWidth * percentWidth;
    return actualWidth;
  }

  getPanelHeight() {
    // panel can have a fixed height via options
    var tmpPanelHeight = this.$scope.ctrl.panel.height;
    // if that is blank, try to get it from our row
    if (typeof tmpPanelHeight === 'undefined') {
      // get from the row instead
      tmpPanelHeight = this.row.height;
      // default to 250px if that was undefined also
      if (typeof tmpPanelHeight === 'undefined') {
        tmpPanelHeight = "250px";
      }
    }
    // convert to numeric value
    tmpPanelHeight = tmpPanelHeight.replace("px","");
    var actualHeight = parseInt(tmpPanelHeight);
    // grafana minimum height for a panel is 250px
    if (actualHeight < 250) {
      actualHeight = 250;
    }
    return actualHeight;
  }

  onRender() {
    console.log("Render D3");
    // use jQuery to get the height on our container
    this.panelWidth = this.getPanelWidth();
    this.panelHeight = this.getPanelHeight();

    var data = d3.range(1000).map(d3.randomBates(10));
    var formatCount = d3.format(",.0f");

    var margin = {top: 10, right: 0, bottom: 30, left: 0};
    var width = this.panelWidth;
    var height = this.panelHeight;
    console.log("panelWidth = " + width + " height = " + height);
    var x = d3.scaleLinear()
        .rangeRound([0, width]);

    var bins = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(10))
        (data);

    var y = d3.scaleLinear()
        .domain([0, d3.max(bins, function(d) { return d.length; })])
        .range([height, 0]);

    // clear out the old div
    var svgElement = $("#mystuff");
    svgElement.replaceWith("");
    var svg = d3.select(this.panelContainer[0])
        .append("div")
        .classed("svg-container", true) //container class to make it responsive
        .append("svg")
        .attr("width", width + "px")
        .attr("height", (height + 24) + "px")
        .attr("id", "mystuff")
        .classed("svg-content-responsive", true)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bar = svg.selectAll(".bar")
        .data(bins)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", x(bins[0].x1) - x(bins[0].x0) - 3)
        .attr("height", function(d) { return height - y(d.length); });

    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", 6)
        .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.length); });

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    this.svg = svg;
    console.log("leaving renderD3");
  }

  link(scope, elem, attrs, ctrl) {
    console.log("d3graph inside link");
    ctrl.setContainer(elem.find('.panel-content'));
    // force a render
    this.onRender();
  }

}
D3GraphPanelCtrl.templateUrl = 'd3-graph-panel/partials/template.html';
