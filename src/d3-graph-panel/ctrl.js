import {MetricsPanelCtrl} from 'app/plugins/sdk';
import _ from 'lodash';
import $ from 'jquery';
import * as d3 from './external/d3.v4.min.js';
import './css/d3_graph.css!';
import d3graphRenderer from './renderer';


export class D3GraphPanelCtrl extends MetricsPanelCtrl {

  constructor($scope, $injector) {
    super($scope, $injector);
    this.initialized = false;
    this.panelContainer = null;
    this.svg = null;
    this.scoperef = $scope;

    console.log("D3GraphPanelCtrl constructor!");
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    console.log("D3GraphPanelCtrl constructor done!");
    var tmpPanelHeight = $scope.ctrl.panel.height;
    if (typeof tmpPanelHeight === 'undefined') {
      // get from the row instead
      tmpPanelHeight = $scope.ctrl.row.height;
      if (typeof tmpPanelHeight === 'undefined') {
        tmpPanelHeight = "250px";
      }
    }
    // lastly remove the px from our height, we don't need it...
    tmpPanelHeight = tmpPanelHeight.replace("px","");
    this.panelHeight = parseInt(tmpPanelHeight);
    var tmpPanelWidthPx = $("div.panel").css("width");
    tmpPanelWidthPx = tmpPanelWidthPx.replace("px","");
    this.panelWidth = parseInt(tmpPanelWidthPx);
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

  onRender() {
    console.log("d3graph onRender entered");
    //debugger;
    if (this.panelContainer === null) {
      console.log("d3graph panel container object null");
      return;
    }
    if (this.initialized) {
      var tmpPanelWidthPx = $("div.panel").css("width");
      tmpPanelWidthPx = tmpPanelWidthPx.replace("px","");
      this.panelWidth = parseInt(tmpPanelWidthPx);
      //debugger;
      //var pc = $("div.panel-container");
      //var tmpPanelHeightPx = $("div.panel-container").css("height");
      //var svgElement = $("#mystuff");
      //var svgElementHeight = $("#mystuff").css("height", "550px");
      //var svgElementWidth = $("#mystuff").css("width", "1200px");
      //svgElement.height = tmpPanelHeightPx;
      //tmpPanelHeightPx = tmpPanelHeightPx.replace("px","");
      //this.panelHeight = parseInt(tmpPanelHeightPx);
      console.log("d3graph panel is already initialized");
      //var myCenter = d3.event.transform(-417.611,64.791,2.209);
      //this.svg.attr("transform", "translate(-417.611,64.791,2.209)");
      return;
    }
    this.initializeD3();
    // apply our zoom
    //this.svg.attr("transform", "translate(-417.611,64.791)scale(2.209)");
    this.initialized = true;
  }

  initializeD3() {
    console.log("initializeD3");
    //var width = 1400;
    //var height = 500;

    // use jQuery to get the height on our container
    //$('#someDiv').height();
    //debugger;
    //var ugh = this.panelContainer[0].containerHeight;
    //debugger;
    //var meh = $('#panel-container');
    //var meh_h = meh.outerHeight();
    //var meh2 = $('#panel-container').css("minHeight");
    //var meh4 = $('#panel-container').css("containerHeight");
    //var meh3 = $('#panel-container')[0].css("min-height");
    //debugger;
    //var meh1 = $("div.panel");
    // locate our panel?
    var tmpPanelWidthPx = $("div.panel").css("width");
    //var tmpPanelWidthPx = meh1.css("width");
    //var tmpWPx = this.panelContainer;
    //var ugh = tmpWPx.css("width");
    tmpPanelWidthPx = tmpPanelWidthPx.replace("px","");
    this.panelWidth = parseInt(tmpPanelWidthPx);

    //var meh2 = $('#panel').outerHeight();
    //var meh3 = $('#panel').outerHeight();

    //var meh3 = $("#panel-container").style;

    //var meh4 = $("#panel-container").style.min-height;

    //var h = meh.context.document.getElementById('someDiv').style.offsetHeight;


    var data = d3.range(1000).map(d3.randomBates(10));

    var formatCount = d3.format(",.0f");

    var margin = {top: 10, right: 0, bottom: 30, left: 0};
    //var width = this.panelWidth - margin.left - margin.right;
    var width = this.panelWidth;
    var height = this.panelHeight; // - margin.top - margin.bottom;
    console.log("panelWidth = " + width + " height = " + height);
    // this is a grafana minimum for a panel
    if (height < 250) {
      this.panelHeight = 250;
      height = 250;
    }
    //width = 1000;
    //height=400;
    //height = 325;
    console.log("init panel height " + height);
    var x = d3.scaleLinear()
        .rangeRound([0, width]);

    var bins = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(20))
        (data);

    var y = d3.scaleLinear()
        .domain([0, d3.max(bins, function(d) { return d.length; })])
        .range([height, 0]);

//        .attr("width", width + margin.left + margin.right)
//        .attr("height", height + margin.top + margin.bottom)


//.attr("width", width + margin.left + margin.right)
//.attr("height", height + margin.top + margin.bottom)
//.attr("viewBox", "0 0 " + width + " " + height)

/*
var svg = d3.select(this.panelContainer[0])
    .append("div")
    .classed("svg-container", true) //container class to make it responsive
    .append("svg")
    .attr("width", 800)
    .attr("height", 500)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " 500")
    .attr("id", "mystuff")
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
*/
//.attr("preserveAspectRatio", "xMidYMid meet")
//.attr("viewBox", "0 0 600 450")
    var svg = d3.select(this.panelContainer[0])
        .append("div")
        .classed("svg-container", true) //container class to make it responsive
        .append("svg")
        .attr("width", width + "px")
        .attr("height", (height + 50) + "px")
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
        .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
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
  
    console.log("leaving initializeD3");
  }

  link(scope, elem, attrs, ctrl) {
    console.log("d3graph inside link");
    d3graphRenderer(scope, elem, attrs, ctrl);
  }

}
D3GraphPanelCtrl.templateUrl = 'd3-graph-panel/partials/template.html';
