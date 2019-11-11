/**
* https://github.com/firehol/netdata/blob/e91f00d99f4965e985981b93fa46ef33f94dd726/web/dashboard.js#L3793
**/

        state.dygraph_options = {
            colors: self.data('dygraph-colors') || state.chartColors(),

            // leave a few pixels empty on the right of the chart
            rightGap: self.data('dygraph-rightgap') || 5,
            showRangeSelector: self.data('dygraph-showrangeselector') || false,
            showRoller: self.data('dygraph-showroller') || false,

            title: self.data('dygraph-title') || state.title,
            titleHeight: self.data('dygraph-titleheight') || 19,

            legend: self.data('dygraph-legend') || 'always', // 'onmouseover',
            labels: data.result.labels,
            labelsDiv: self.data('dygraph-labelsdiv') || state.element_legend_childs.hidden,
            labelsDivStyles: self.data('dygraph-labelsdivstyles') || { 'fontSize':'1px' },
            labelsDivWidth: self.data('dygraph-labelsdivwidth') || state.chartWidth() - 70,
            labelsSeparateLines: self.data('dygraph-labelsseparatelines') || true,
            labelsShowZeroValues: self.data('dygraph-labelsshowzerovalues') || true,
            labelsKMB: false,
            labelsKMG2: false,
            showLabelsOnHighlight: self.data('dygraph-showlabelsonhighlight') || true,
            hideOverlayOnMouseOut: self.data('dygraph-hideoverlayonmouseout') || true,

            includeZero: self.data('dygraph-includezero') || false,
            xRangePad: self.data('dygraph-xrangepad') || 0,
            yRangePad: self.data('dygraph-yrangepad') || 1,

            valueRange: self.data('dygraph-valuerange') || null,

            ylabel: state.units,
            yLabelWidth: self.data('dygraph-ylabelwidth') || 12,

            // the function to plot the chart
            plotter: null,

            // The width of the lines connecting data points. This can be used to increase the contrast or some graphs.
            strokeWidth: self.data('dygraph-strokewidth') || strokeWidth,
            strokePattern: self.data('dygraph-strokepattern') || undefined,

            // The size of the dot to draw on each point in pixels (see drawPoints). A dot is always drawn when a point is "isolated",
            // i.e. there is a missing point on either side of it. This also controls the size of those dots.
            drawPoints: self.data('dygraph-drawpoints') || false,

            // Draw points at the edges of gaps in the data. This improves visibility of small data segments or other data irregularities.
            drawGapEdgePoints: self.data('dygraph-drawgapedgepoints') || true,

            connectSeparatedPoints: self.data('dygraph-connectseparatedpoints') || false,
            pointSize: self.data('dygraph-pointsize') || 1,

            // enabling this makes the chart with little square lines
            stepPlot: self.data('dygraph-stepplot') || false,

            // Draw a border around graph lines to make crossing lines more easily distinguishable. Useful for graphs with many lines.
            strokeBorderColor: self.data('dygraph-strokebordercolor') || NETDATA.themes.current.background,
            strokeBorderWidth: self.data('dygraph-strokeborderwidth') || (chart_type === 'stacked')?0.0:0.0,

            fillGraph: self.data('dygraph-fillgraph') || (chart_type === 'area' || chart_type === 'stacked')?true:false,
            fillAlpha: self.data('dygraph-fillalpha') || (chart_type === 'stacked')?NETDATA.options.current.color_fill_opacity_stacked:NETDATA.options.current.color_fill_opacity_area,
            stackedGraph: self.data('dygraph-stackedgraph') || (chart_type === 'stacked')?true:false,
            stackedGraphNaNFill: self.data('dygraph-stackedgraphnanfill') || 'none',

            drawAxis: self.data('dygraph-drawaxis') || true,
            axisLabelFontSize: self.data('dygraph-axislabelfontsize') || 10,
            axisLineColor: self.data('dygraph-axislinecolor') || NETDATA.themes.current.axis,
            axisLineWidth: self.data('dygraph-axislinewidth') || 0.3,

            drawGrid: self.data('dygraph-drawgrid') || true,
            drawXGrid: self.data('dygraph-drawxgrid') || undefined,
            drawYGrid: self.data('dygraph-drawygrid') || undefined,
            gridLinePattern: self.data('dygraph-gridlinepattern') || null,
            gridLineWidth: self.data('dygraph-gridlinewidth') || 0.3,
            gridLineColor: self.data('dygraph-gridlinecolor') || NETDATA.themes.current.grid,

            maxNumberWidth: self.data('dygraph-maxnumberwidth') || 8,
            sigFigs: self.data('dygraph-sigfigs') || null,
            digitsAfterDecimal: self.data('dygraph-digitsafterdecimal') || 2,
            valueFormatter: self.data('dygraph-valueformatter') || function(x){ return x.toFixed(2); },

            highlightCircleSize: self.data('dygraph-highlightcirclesize') || highlightCircleSize,
            highlightSeriesOpts: self.data('dygraph-highlightseriesopts') || null, // TOO SLOW: { strokeWidth: 1.5 },
            highlightSeriesBackgroundAlpha: self.data('dygraph-highlightseriesbackgroundalpha') || null, // TOO SLOW: (chart_type === 'stacked')?0.7:0.5,

            pointClickCallback: self.data('dygraph-pointclickcallback') || undefined,
            visibility: state.dimensions_visibility.selected2BooleanArray(state.data.dimension_names),
            axes: {
                x: {
                    pixelsPerLabel: 50,
                    ticker: Dygraph.dateTicker,
                    axisLabelFormatter: function (d, gran) {
                        return NETDATA.zeropad(d.getHours()) + ":" + NETDATA.zeropad(d.getMinutes()) + ":" + NETDATA.zeropad(d.getSeconds());
                    },
                    valueFormatter: function (ms) {
                        var d = new Date(ms);
                        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
                        // return NETDATA.zeropad(d.getHours()) + ":" + NETDATA.zeropad(d.getMinutes()) + ":" + NETDATA.zeropad(d.getSeconds());
                    }
                },
                y: {
                    pixelsPerLabel: 15,
                    valueFormatter: function (x) {
                        // we format legends with the state object
                        // no need to do anything here
                        // return (Math.round(x*100) / 100).toLocaleString();
                        // return state.legendFormatValue(x);
                        return x;
                    }
                }
            },
            legendFormatter: function(data) {
                var elements = state.element_legend_childs;

                // if the hidden div is not there
                // we are not managing the legend
                if(elements.hidden === null) return;

                if (typeof data.x !== 'undefined') {
                    state.legendSetDate(data.x);
                    var i = data.series.length;
                    while(i--) {
                        var series = data.series[i];
                        if(!series.isVisible) continue;
                        state.legendSetLabelValue(series.label, series.y);
                    }
                }

                return '';
            },
            drawCallback: function(dygraph, is_initial) {
                if(state.current.name !== 'auto' && state.dygraph_user_action === true) {
                    state.dygraph_user_action = false;

                    var x_range = dygraph.xAxisRange();
                    var after = Math.round(x_range[0]);
                    var before = Math.round(x_range[1]);

                    if(NETDATA.options.debug.dygraph === true)
                        state.log('dygraphDrawCallback(dygraph, ' + is_initial + '): ' + (after / 1000).toString() + ' - ' + (before / 1000).toString());

                    if(before <= state.netdata_last && after >= state.netdata_first)
                        state.updateChartPanOrZoom(after, before);
                }
            },
            zoomCallback: function(minDate, maxDate, yRanges) {
                if(NETDATA.options.debug.dygraph === true)
                    state.log('dygraphZoomCallback()');

                state.globalSelectionSyncStop();
                state.globalSelectionSyncDelay();
                state.setMode('zoom');

                // refresh it to the greatest possible zoom level
                state.dygraph_user_action = true;
                state.dygraph_force_zoom = true;
                state.updateChartPanOrZoom(minDate, maxDate);
            },
            highlightCallback: function(event, x, points, row, seriesName) {
                if(NETDATA.options.debug.dygraph === true || state.debug === true)
                    state.log('dygraphHighlightCallback()');

                state.pauseChart();

                // there is a bug in dygraph when the chart is zoomed enough
                // the time it thinks is selected is wrong
                // here we calculate the time t based on the row number selected
                // which is ok
                var t = state.data_after + row * state.data_update_every;
                // console.log('row = ' + row + ', x = ' + x + ', t = ' + t + ' ' + ((t === x)?'SAME':(Math.abs(x-t)<=state.data_update_every)?'SIMILAR':'DIFFERENT') + ', rows in db: ' + state.data_points + ' visible(x) = ' + state.timeIsVisible(x) + ' visible(t) = ' + state.timeIsVisible(t) + ' r(x) = ' + state.calculateRowForTime(x) + ' r(t) = ' + state.calculateRowForTime(t) + ' range: ' + state.data_after + ' - ' + state.data_before + ' real: ' + state.data.after + ' - ' + state.data.before + ' every: ' + state.data_update_every);

                state.globalSelectionSync(x);

                // fix legend zIndex using the internal structures of dygraph legend module
                // this works, but it is a hack!
                // state.dygraph_instance.plugins_[0].plugin.legend_div_.style.zIndex = 10000;
            },
            unhighlightCallback: function(event) {
                if(NETDATA.options.debug.dygraph === true || state.debug === true)
                    state.log('dygraphUnhighlightCallback()');

                state.unpauseChart();
                state.globalSelectionSyncStop();
            },
            interactionModel : {
                mousedown: function(event, dygraph, context) {
                    if(NETDATA.options.debug.dygraph === true || state.debug === true)
                        state.log('interactionModel.mousedown()');

                    state.dygraph_user_action = true;
                    state.globalSelectionSyncStop();

                    if(NETDATA.options.debug.dygraph === true)
                        state.log('dygraphMouseDown()');

                    // Right-click should not initiate a zoom.
                    if(event.button && event.button === 2) return;

                    context.initializeMouseDown(event, dygraph, context);

                    if(event.button && event.button === 1) {
                        if (event.altKey || event.shiftKey) {
                            state.setMode('pan');
                            state.globalSelectionSyncDelay();
                            Dygraph.startPan(event, dygraph, context);
                        }
                        else {
                            state.setMode('zoom');
                            state.globalSelectionSyncDelay();
                            Dygraph.startZoom(event, dygraph, context);
                        }
                    }
                    else {
                        if (event.altKey || event.shiftKey) {
                            state.setMode('zoom');
                            state.globalSelectionSyncDelay();
                            Dygraph.startZoom(event, dygraph, context);
                        }
                        else {
                            state.setMode('pan');
                            state.globalSelectionSyncDelay();
                            Dygraph.startPan(event, dygraph, context);
                        }
                    }
                },
                mousemove: function(event, dygraph, context) {
                    if(NETDATA.options.debug.dygraph === true || state.debug === true)
                        state.log('interactionModel.mousemove()');

                    if(context.isPanning) {
                        state.dygraph_user_action = true;
                        state.globalSelectionSyncStop();
                        state.globalSelectionSyncDelay();
                        state.setMode('pan');
                        Dygraph.movePan(event, dygraph, context);
                    }
                    else if(context.isZooming) {
                        state.dygraph_user_action = true;
                        state.globalSelectionSyncStop();
                        state.globalSelectionSyncDelay();
                        state.setMode('zoom');
                        Dygraph.moveZoom(event, dygraph, context);
                    }
                },
                mouseup: function(event, dygraph, context) {
                    if(NETDATA.options.debug.dygraph === true || state.debug === true)
                        state.log('interactionModel.mouseup()');

                    if (context.isPanning) {
                        state.dygraph_user_action = true;
                        state.globalSelectionSyncDelay();
                        Dygraph.endPan(event, dygraph, context);
                    }
                    else if (context.isZooming) {
                        state.dygraph_user_action = true;
                        state.globalSelectionSyncDelay();
                        Dygraph.endZoom(event, dygraph, context);
                    }
                },
                click: function(event, dygraph, context) {
                    if(NETDATA.options.debug.dygraph === true || state.debug === true)
                        state.log('interactionModel.click()');

                    event.preventDefault();
                },
                dblclick: function(event, dygraph, context) {
                    if(NETDATA.options.debug.dygraph === true || state.debug === true)
                        state.log('interactionModel.dblclick()');
                    NETDATA.resetAllCharts(state);
                },
                mousewheel: function(event, dygraph, context) {
                    if(NETDATA.options.debug.dygraph === true || state.debug === true)
                        state.log('interactionModel.mousewheel()');

                    // Take the offset of a mouse event on the dygraph canvas and
                    // convert it to a pair of percentages from the bottom left.
                    // (Not top left, bottom is where the lower value is.)
                    function offsetToPercentage(g, offsetX, offsetY) {
                        // This is calculating the pixel offset of the leftmost date.
                        var xOffset = g.toDomCoords(g.xAxisRange()[0], null)[0];
                        var yar0 = g.yAxisRange(0);

                        // This is calculating the pixel of the higest value. (Top pixel)
                        var yOffset = g.toDomCoords(null, yar0[1])[1];

                        // x y w and h are relative to the corner of the drawing area,
                        // so that the upper corner of the drawing area is (0, 0).
                        var x = offsetX - xOffset;
                        var y = offsetY - yOffset;

                        // This is computing the rightmost pixel, effectively defining the
                        // width.
                        var w = g.toDomCoords(g.xAxisRange()[1], null)[0] - xOffset;

                        // This is computing the lowest pixel, effectively defining the height.
                        var h = g.toDomCoords(null, yar0[0])[1] - yOffset;

                        // Percentage from the left.
                        var xPct = w === 0 ? 0 : (x / w);
                        // Percentage from the top.
                        var yPct = h === 0 ? 0 : (y / h);

                        // The (1-) part below changes it from "% distance down from the top"
                        // to "% distance up from the bottom".
                        return [xPct, (1-yPct)];
                    }

                    // Adjusts [x, y] toward each other by zoomInPercentage%
                    // Split it so the left/bottom axis gets xBias/yBias of that change and
                    // tight/top gets (1-xBias)/(1-yBias) of that change.
                    //
                    // If a bias is missing it splits it down the middle.
                    function zoomRange(g, zoomInPercentage, xBias, yBias) {
                        xBias = xBias || 0.5;
                        yBias = yBias || 0.5;

                        function adjustAxis(axis, zoomInPercentage, bias) {
                            var delta = axis[1] - axis[0];
                            var increment = delta * zoomInPercentage;
                            var foo = [increment * bias, increment * (1-bias)];

                            return [ axis[0] + foo[0], axis[1] - foo[1] ];
                        }

                        var yAxes = g.yAxisRanges();
                        var newYAxes = [];
                        for (var i = 0; i < yAxes.length; i++) {
                            newYAxes[i] = adjustAxis(yAxes[i], zoomInPercentage, yBias);
                        }

                        return adjustAxis(g.xAxisRange(), zoomInPercentage, xBias);
                    }

                    if(event.altKey || event.shiftKey) {
                        state.dygraph_user_action = true;

                        state.globalSelectionSyncStop();
                        state.globalSelectionSyncDelay();

                        // http://dygraphs.com/gallery/interaction-api.js
                        var normal = (event.detail) ? event.detail * -1 : event.wheelDelta / 40;
                        var percentage = normal / 50;

                        if (!(event.offsetX && event.offsetY)){
                            event.offsetX = event.layerX - event.target.offsetLeft;
                            event.offsetY = event.layerY - event.target.offsetTop;
                        }

                        var percentages = offsetToPercentage(dygraph, event.offsetX, event.offsetY);
                        var xPct = percentages[0];
                        var yPct = percentages[1];

                        var new_x_range = zoomRange(dygraph, percentage, xPct, yPct);

                        var after = new_x_range[0];
                        var before = new_x_range[1];

                        var first = state.netdata_first + state.data_update_every;
                        var last = state.netdata_last + state.data_update_every;

                        if(before > last) {
                            after -= (before - last);
                            before = last;
                        }
                        if(after < first) {
                            after = first;
                        }

                        state.setMode('zoom');
                        if(state.updateChartPanOrZoom(after, before) === true)
                            dygraph.updateOptions({ dateWindow: [ after, before ] });

                        event.preventDefault();
                    }
                },
                touchstart: function(event, dygraph, context) {
                    if(NETDATA.options.debug.dygraph === true || state.debug === true)
                        state.log('interactionModel.touchstart()');

                    state.dygraph_user_action = true;
                    state.setMode('zoom');
                    state.pauseChart();

                    Dygraph.defaultInteractionModel.touchstart(event, dygraph, context);

                    // we overwrite the touch directions at the end, to overwrite
                    // the internal default of dygraphs
                    context.touchDirections = { x: true, y: false };

                    state.dygraph_last_touch_start = new Date().getTime();
                    state.dygraph_last_touch_move = 0;

                    if(typeof event.touches[0].pageX === 'number')
                        state.dygraph_last_touch_page_x = event.touches[0].pageX;
                    else
                        state.dygraph_last_touch_page_x = 0;
                },
                touchmove: function(event, dygraph, context) {
                    if(NETDATA.options.debug.dygraph === true || state.debug === true)
                        state.log('interactionModel.touchmove()');

                    state.dygraph_user_action = true;
                    Dygraph.defaultInteractionModel.touchmove(event, dygraph, context);

                    state.dygraph_last_touch_move = new Date().getTime();
                },
                touchend: function(event, dygraph, context) {
                    if(NETDATA.options.debug.dygraph === true || state.debug === true)
                        state.log('interactionModel.touchend()');

                    state.dygraph_user_action = true;
                    Dygraph.defaultInteractionModel.touchend(event, dygraph, context);

                    // if it didn't move, it is a selection
                    if(state.dygraph_last_touch_move === 0 && state.dygraph_last_touch_page_x !== 0) {
                        // internal api of dygraphs
                        var pct = (state.dygraph_last_touch_page_x - (dygraph.plotter_.area.x + state.element.getBoundingClientRect().left)) / dygraph.plotter_.area.w;
                        var t = Math.round(state.data_after + (state.data_before - state.data_after) * pct);
                        if(NETDATA.dygraphSetSelection(state, t) === true)
                            state.globalSelectionSync(t);
                    }

                    // if it was double tap within double click time, reset the charts
                    var now = new Date().getTime();
                    if(typeof state.dygraph_last_touch_end !== 'undefined') {
                        if(state.dygraph_last_touch_move === 0) {
                            var dt = now - state.dygraph_last_touch_end;
                            if(dt <= NETDATA.options.current.double_click_speed)
                                NETDATA.resetAllCharts(state);
                        }
                    }

                    // remember the timestamp of the last touch end
                    state.dygraph_last_touch_end = now;
                }
            }
        };

        if(NETDATA.chartLibraries.dygraph.isSparkline(state)) {
            state.dygraph_options.drawGrid = false;
            state.dygraph_options.drawAxis = false;
            state.dygraph_options.title = undefined;
            state.dygraph_options.units = undefined;
            state.dygraph_options.ylabel = undefined;
            state.dygraph_options.yLabelWidth = 0;
            state.dygraph_options.labelsDivWidth = 120;
            state.dygraph_options.labelsDivStyles.width = '120px';
            state.dygraph_options.labelsSeparateLines = true;
            state.dygraph_options.rightGap = 0;
            state.dygraph_options.yRangePad = 1;
        }

        if(smooth === true) {
            state.dygraph_smooth_eligible = true;

            if(NETDATA.options.current.smooth_plot === true)
                state.dygraph_options.plotter = smoothPlotter;
        }
        else state.dygraph_smooth_eligible = false;

        state.dygraph_instance = new Dygraph(state.element_chart,
            data.result.data, state.dygraph_options);

        state.dygraph_force_zoom = false;
        state.dygraph_user_action = false;
        state.dygraph_last_rendered = new Date().getTime();
        return true;
    };
