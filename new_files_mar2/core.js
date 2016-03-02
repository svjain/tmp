/*
 * Class
 * Fannie Mae Demo
 * Date - 2016-01-08
 * 
 */
 
var urlObj = {
	alerts: 'http://192.168.7.81:9200/ns_1_sax_alerts_ialias/_search',				// Alerts Index URL
	bizADSAlerts: 'http://192.168.7.81:9200/ns_1_sax_alerts_ialias/_search',	// Alerts Index URL
	bizLDNGAlerts: 'http://192.168.7.81:9200/ns_1_sax_alerts_ialias/_search',	// Alerts Index URL
	ads: 'http://192.168.7.81:9200/ns_1_adspayloaddata_ialias/_search',				// ADS Index URL
	mbs: 'http://192.168.7.81:9200/ns_1_mbspayloaddata_ialias/_search',				// MBS Index URL
	ediCdh: 'http://192.168.7.81:9200/ns_1_edicmhpayload_ialias/_search',
	bizAds: 'http://192.168.7.81:9200/ns_1_businessads2edi_ialias/_search',			// Business ADS Index URL
	bizMbs: 'http://192.168.7.81:9200/ns_1_businessldng2edi_ialias/_search',		// Business MBS Index URL
	stomp: 'http://192.168.7.81:15674/stomp',										// Stomp URL
	adsPerMinuteQueue: '/queue/TwoMinData1',										// ADS Per Minute Data Queue
	adsTotalQueue: '/queue/AllData2',												// ADS Total Data Queue
	alertsQueue: '/queue/HighThresholdUI',											// Alerts Data Queue
	bizADSAlertsQueue: '/queue/BusinessAlerts',										// Business Alerts Data Queue
	bizLDNGAlertsQueue: '/queue/BusinessAlerts1',									// Business Alerts Data Queue
	mbsPerMinuteQueue: '/queue/MBSTwoMinData',										// MBS Per Minute Data Queue
	mbsTotalQueue: '/queue/MBSAllData',												// MBS Total Data Queue
	mqUsername: 'guest',															// Stomp User Name
	mqPassword: 'guest',															// Stomp Password
	mqHost: '/',																	// Stomp Host
	ediCmhPerMinuteQueue: '/queue/EDICMHTwoMinData',									// MBS Per Minute Data Queue
	ediCmhTotalQueue: '/queue/EDICMHAllData',											// MBS Total Data Queue
};

var curPage = {
	'payload': 'ads',
	'business': 'ads'
};
var adsData = [];
var stackData = [];
var entityData = [];
var adsEventData = [];
var eventData = [];
var MBSStackData = [];
var ADSGroupData = [];
var MBSGroupData = [];
var ediCdhEntityData = [];
var ediCdhEventData = [];
var EDICDHStackData = [];
var EDICDHGroupData = [];
var loanLineData = [
	{ "label": 'Total Loan', data: [], yaxis: 2 },
	{ "label": 'Loan Per Minute', data: [], yaxis: 1 }
];
var poolLineData = [
	{ "label": 'Total Pool', data: [], yaxis: 2 },
	{ "label": 'Pool Per Minute', data: [], yaxis: 1 }
];
var mbsLineData = {
	"POOL": [
		{ "label": 'Total', data: [], yaxis: 2 },
		{ "label": 'Per Minute', data: [], yaxis: 1 }
	],
	"PPC": [
		{ "label": 'Total', data: [], yaxis: 2 },
		{ "label": 'Per Minute', data: [], yaxis: 1 }
	],
	"CMMPilot_MBSToEDI_EVENT1": [
		{ "label": 'Total', data: [], yaxis: 2 },
		{ "label": 'Per Minute', data: [], yaxis: 1 }
	],
	"CMMPilot_MBSToEDI_EVENT2": [
		{ "label": 'Total', data: [], yaxis: 2 },
		{ "label": 'Per Minute', data: [], yaxis: 1 }
	],
	"CMMPilot_MBSToEDI_EVENT3": [
		{ "label": 'Total', data: [], yaxis: 2 },
		{ "label": 'Per Minute', data: [], yaxis: 1 }
	]
};

var ediCmhLineData = {
	"POOL": [
		{ "label": 'Total', data: [], yaxis: 2 },
		{ "label": 'Per Minute', data: [], yaxis: 1 }
	],
	"PPC": [
		{ "label": 'Total', data: [], yaxis: 2 },
		{ "label": 'Per Minute', data: [], yaxis: 1 }
	],
	"MANIFEST": [
		{ "label": 'Total', data: [], yaxis: 2 },
		{ "label": 'Per Minute', data: [], yaxis: 1 }
	]
};

var colorsArr = ["#93e0f8","#7a53a3","#de8ff6","#da4f12","#eadc6b","#6b988f","#29eef1","#fc68cc","#c5c164","#609c2f","#e5ce17","#905fe6","#e093a0","#e51361"];

var lineChartOptions = {
	xaxis: {
		mode: "time",
		timeformat: "%H:%M:%S",
		timezone: 'browser'
	},
	yaxis: {min:0, ticks: 10},
	series: {
		lines: {show: true, lineWidth: 2},
		points: {show: true, radius: 1},
		shadowSize: 0
	},
	colors: ['#93e0f8', '#7a53a3'],
	grid: {
		hoverable: true,
		clickable: false,
		borderColor: "#ccc",
		borderWidth: 1,
		markings: []
	},
	yaxes: [
		{ position: 'left' },
		{ alignTicksWithAxis: "right", position: "right" }
	],
	legend: { show: false }
};
var loanChartOpts = $.extend(true, {}, lineChartOptions);
loanChartOpts.grid.markings = [
	{color: '#FFB31A', lineWidth: 0.8, yaxis: {from: 7, to: 7}},
	{color: '#FB1924', lineWidth: 0.8, yaxis: {from: 13, to: 13}}
];

var poolChartOpts = $.extend(true, {}, lineChartOptions);
poolChartOpts.grid.markings = [
	{color: '#FFB31A', lineWidth: 0.8, yaxis: {from: 9, to: 9}},
	{color: '#FB1924', lineWidth: 0.8, yaxis: {from: 15, to: 15}}
];

var mbsLineChartOpts = $.extend(true, {}, lineChartOptions);
mbsLineChartOpts.grid.markings = [
	{color: '#FFB31A', lineWidth: 0.8, yaxis: {from: 9, to: 9}},
	{color: '#FB1924', lineWidth: 0.8, yaxis: {from: 15, to: 15}}
];

var ediCmhLineChartOpts = $.extend(true, {}, lineChartOptions);
ediCmhLineChartOpts.grid.markings = [
	{color: '#FFB31A', lineWidth: 0.8, yaxis: {from: 9, to: 9}},
	{color: '#FB1924', lineWidth: 0.8, yaxis: {from: 15, to: 15}}
];

var pieChartOptions = {
	series: {
		pie: {
			show: true,
			label: {
				show: true,
				formatter: function(label, series){
					var percent = Math.round(series.percent);
					var number = series.data[0][1];
					return ('<div class="text-center">' + number + ' <small>(' + percent + '%)</small></div>');
				}
			}
		}
	},
	grid: { clickable: true },
	colors: ['#93e0f8', '#7a53a3', '#de8ff6'],
	legend: { show: false }
};

var entityPieChartOptins = $.extend(true, {}, pieChartOptions);
entityPieChartOptins.colors = [];

var eventPieChartOptins = $.extend(true, {}, pieChartOptions);
eventPieChartOptins.colors = [];

var adsEventPieChartOptins = $.extend(true, {}, pieChartOptions);
adsEventPieChartOptins.colors = [];

var barGraphOptions = {
	series: {
		stack: true,
		bars: {show: true, lineWidth: .5},
		barWidth: 0.8,
		lineWidth: 0,
		lines: {show: false}
	},
	bars: {
		align: "center",
		horizontal: false,
		barWidth: .8
	},
	grid: {
		borderWidth: 0,
		borderColor: null,
		backgroundColor: null,
		labelMargin: 10,
		minBorderMargin: 10,
		aboveData: true,
		hoverable: true
	},
	xaxis: { },
	colors: ['#93e0f8', '#7a53a3', '#de8ff6'],
	legend: { show: false }
};

var adsBarGraphOptions = $.extend(true, {}, barGraphOptions);
adsBarGraphOptions.colors = [];

var mbsBarGraphOptions = $.extend(true, {}, barGraphOptions);
mbsBarGraphOptions.colors = [];

var groupBarGraphOptions = {
	series: {
		bars: {
			show: true,
			barWidth: 0.3,
			order: 1,
			lineWidth: .5
		}
	},
	grid: {
		borderWidth: 0,
		borderColor: null,
		backgroundColor: null,
		labelMargin: 10,
		minBorderMargin: 10,
		aboveData: true,
		hoverable: true
	},
	xaxis: {},
	colors: [],
	legend: { show: false }
};

var fannieMaeApp = new function() {
	var _this = this;
	
	_this.init = function() {
		$('#pageTabs a').on('click', function() {
			var isActive = $(this).closest('li').hasClass('active');
			if ( !isActive ) {
				curPage.payload = $(this).closest('li').data('page');
				setTimeout(function() {				
					if ( curPage.payload == 'mbs' ) {
						_this.getEntityPieData();
						_this.getGroupBarData();
						_this.createMBSLineChart();
					} else if (curPage.payload == 'ediCdh') {
						_this.getEdiCdhPieData();
						_this.getGroupBarData();
						_this.createEdiCdhSLineChart();
					} else {
						_this.getPayloadPieData();
						_this.getGroupBarData();
						_this.createLineChart();
						_this.getAlertData();
					}
				}, 300);
				
				$('ul.legends > li.inactive').removeClass('inactive');
				$('#mbsRTLineLegends li').addClass('inactive');
				$('#mbsRTLineLegends li:first').removeClass('inactive');

				$('#ediCdhRTLineLegends li').addClass('inactive');
				$('#ediCdhRTLineLegends li:first').removeClass('inactive');
			}
		});
		
		$('#submitBtn').on('click', function() {
			var value = $('#fromDatetimepicker input').val();
			if ( value != '' ) {
				_this.adsDataRefresh();
			}
		});
		
		$('#submitBtnMBS').on('click', function() {
			var value = $('#fromDatetimepickerMBS input').val();
			if ( value != '' ) {
				_this.mbsDataRefresh();
			}
		});

		$('#submitBtnEdiCdh').on('click', function() {
			var value = $('#fromDatetimepickerEdiCdh input').val();
			if ( value != '' ) {
				_this.ediCdhDataRefresh();
			}
		});
		
		$('#mainNavbar a').on('click', function() {
			var target = $(this).data('target');
			$(this).closest('li')
					.addClass('active')
					.siblings('li')
					.removeClass('active');
			
			$(target).removeClass('hidden')
					.siblings('div')
					.addClass('hidden');
					
			var actTabSize = $(target).find('.nav.nav-tabs > li.active').size();
			if ( actTabSize > 0 ) {
				$(target).find('.nav.nav-tabs > li.active').removeClass('active').find('a').trigger('click');
			} else {
				$(target).find('.nav.nav-tabs > li:first').find('a').trigger('click');
			}
			
			$('ul.legends > li.inactive').removeClass('inactive');
		});
		
		$('#fromDatetimepicker input, #fromDatetimepickerMBS input, #bizADSFromDatetimepicker input, #bizMBSFromDatetimepicker input, #fromDatetimepickerEdiCdh input').on('keydown', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        $('#fromDatetimepicker, #fromDatetimepickerMBS, #bizADSFromDatetimepicker, #bizMBSFromDatetimepicker, #fromDatetimepickerEdiCdh').datetimepicker({
            language: 'en',
            pick12HourFormat: true,
            endDate: new Date()
        });

        var curDate = new Date(); 
        $('#fromDatetimepicker, #fromDatetimepickerMBS, #bizADSFromDatetimepicker, #bizMBSFromDatetimepicker, #fromDatetimepickerEdiCdh').datetimepicker('setValue', curDate);
		
		
		$('#loanLineLegends a').on('click', function() {
			$(this).parent().toggleClass('inactive');
			_this.updateLoadLineChart();
		});
		
		$('#poolLineLegends a').on('click', function() {
			$(this).parent().toggleClass('inactive');
			_this.updatePoolLineChart();
		});
		
		$('#adsPieLegends a').on('click', function() {
			$(this).parent().toggleClass('inactive');
			_this.updatePayloadPieChart();
		});
		
		$(document).on('click', '#stackLegends a', function() {
			$(this).parent().toggleClass('inactive');
			_this.updateLoanBarChart();
		});
		
		$('#mbsRTLineLegends a').on('click', function() {
			$(this).parent().siblings('li').addClass('inactive');
			$(this).parent().removeClass('inactive');
			_this.createMBSLineChart();
		});
		
		$(document).on('click', '#entityTypePieLegends a', function() {
			$(this).parent().toggleClass('inactive');
			_this.updateEntityPieChart();
		});
		
		$(document).on('click', '#adsEventTypePieLegends a', function() {
			$(this).parent().toggleClass('inactive');
			_this.updateADSEventPieChart();
		});
		
		$(document).on('click', '#eventTypePieLegends a', function() {
			$(this).parent().toggleClass('inactive');
			_this.updateEventPieChart();
		});
		
		$(document).on('click', '#mbsStackLegends a', function() {
			$(this).parent().toggleClass('inactive');
			_this.updateMBSStackBarChart();
		});
		
		$(document).on('click', '#adsGroupLegends a', function() {
			$(this).parent().toggleClass('inactive');
			_this.updateADSGroupBarChart();
		});
		
		$(document).on('click', '#mbsGroupLegends a', function() {
			$(this).parent().toggleClass('inactive');
			_this.updateMBSGroupBarChart();
		});

		// ------------
		$(document).on('click', '#ediCdhEntityTypePieLegends a', function() {
			$(this).parent().toggleClass('inactive');
			_this.updateEdiCdhEntityPieChart();
		});

		$(document).on('click', '#ediCdhEventTypePieLegends a', function() {
			$(this).parent().toggleClass('inactive');
			_this.updateEdiCdhEventPieChart();
		});

		$(document).on('click', '#ediCdhStackLegends a', function() {
			$(this).parent().toggleClass('inactive');
			_this.updateEdiCdhStackBarChart();
		});

		$(document).on('click', '#ediCdhGroupLegends a', function() {
			$(this).parent().toggleClass('inactive');
			_this.updateEdiCdhGroupBarChart();
		});

		$('#ediCdhRTLineLegends a').on('click', function() {
			$(this).parent().siblings('li').addClass('inactive');
			$(this).parent().removeClass('inactive');
			_this.createEdiCdhSLineChart();
		});
		
		$('#pageTabs > li:first > a').trigger('click');
	};
	
	
	/** PIE CHARTS START **/
	_this.getPayloadPieData = function() {
		var start, end, sel_date;
		var from = $("#fromDatetimepicker input[type='text']").val();
		if ( from == '' ) {
			sel_date = new Date();
		} else {
			sel_date = new Date(from);
		}

		start = sel_date.setHours(0, 0, 0, 0);
		end = sel_date.setHours(23, 59, 59, 999);

		var piePostData = {
			"size": 0,
			"query": {
				"bool": {
					"must": [{"range": {"paylaodgrp.payloadTime": {"from": start, "to": end}}}],
					"must_not": [],
					"should": []
				}
			},
			"aggs": {
				"group_by_messageSubType": {
					"terms": {
						"field": "MessageSubtype"
					}
				}
			}
		}

		jQuery.ajax({
			type: "POST",
			url: urlObj.ads,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: true,
			data: JSON.stringify(piePostData),
			success: function (data) {
				var responsePieData = data.aggregations.group_by_messageSubType.buckets;
				adsData = _this.modifyPayloadPieData(responsePieData);
				_this.createPayloadPieChart();
				
				_this.getADSEventPieData();
				_this.getLoanStackData();
			},
			error: function () {
				// TODO
			}
		});
	};
	
	_this.getADSEventPieData = function(entity) {
		var start, end, sel_date;
		var from = $("#fromDatetimepicker input[type='text']").val();
		if ( from == '' ) {
			sel_date = new Date();
		} else {
			sel_date = new Date(from);
		}

		start = sel_date.setHours(0, 0, 0, 0);
		end = sel_date.setHours(23, 59, 59, 999);
		
		var query = {};
		if (entity) {
			query = {"bool":{"must":[{"term":{"MessageSubtype":entity}},{"range":{"payloadTime":{"gt":start,"lt":end}}}],"must_not":[],"should":[]}};
		} else {
			query = {"bool":{"must":[{"range":{"payloadTime":{"gt":start,"lt":end}}}],"must_not":[],"should":[]}};
		}
		
		var piePostData = {
			"size":0,
			"query": query,
			"aggs": {
			  "group_by_EventType": {
				"terms": {
				"field": "EventType"
				}
			  }
			}
		}
		
		jQuery.ajax({
			type: "POST",
			url: urlObj.ads,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: true,
			data: JSON.stringify(piePostData),
			success: function (data) {
				adsEventData = (data.aggregations.group_by_EventType.buckets.length > 0) ? data.aggregations.group_by_EventType.buckets : [];
				_this.createADSEventPieChart();
			},
			error: function () {
				// TODO
			}
		});
	};
	
	_this.createADSEventPieChart = function() {
		var newData = [];
		$('#adsEventTypePieLegends').empty();
		for ( var i=0; i<adsEventData.length; i++ ) {
			$('#adsEventTypePieLegends').append('<li>' +
												'<a href="javascript:void(0)">' +
													'<span style="background: '+ colorsArr[i] +'" class="box"></span>' +
													'<span class="lbl">'+ adsEventData[i].key +'</span>' +
												'</a>' +
											'</li>');
		
			adsEventPieChartOptins.colors.push(colorsArr[i]);
			newData.push({"label": adsEventData[i].key, "data": adsEventData[i].doc_count});
		}
		
		adsEventData = newData;
		
		var total = 0;
		for ( var i=0; i<newData.length; i++ ) {
			if ( newData[i].data != undefined )
				total += parseInt(newData[i].data);
		}
		$('#adsEventCount').text('('+total+')');
		
		newData = (newData.length == 0) ? [{}] : newData;
		var pieChart = $.plot('#adsEventTypePieChart', newData, adsEventPieChartOptins);
		
		_this.warningIfNoData(pieChart, 'pie');
	};
	
	_this.updateADSEventPieChart = function() {
		var newPieData = $.extend(true, [], adsEventData);
		var newPieOpts = $.extend(true, {}, adsEventPieChartOptins);
		
		var pieActLegends = [];
		newPieOpts.colors = [];
		$('#adsEventTypePieLegends li').each(function(i, elm) {
			var isInactive = $(elm).hasClass('inactive');
			if ( !isInactive ) {
				var lbl = $(elm).find('.lbl').text();
				var clr = adsEventPieChartOptins.colors[i];
				pieActLegends.push(lbl);
				newPieOpts.colors.push(clr);
			}
		});
		
		newPieData = $.grep(newPieData, function(o) {
			return $.inArray(o.label, pieActLegends) > -1;
		});
		
		if ( newPieData.length == 0 ) {
			newPieData = [{}];
		}
		
		var pieChart = $.plot('#adsEventTypePieChart', newPieData, newPieOpts);
		_this.warningIfNoData(pieChart, 'pie');
	};
	
	_this.modifyPayloadPieData = function(origData) {
		var pieData = [
			{"label": "Pool", "data": "0"},
			{"label": "Loan", "data": "0"},
			{"label": "Major Pool", "data": "0"}
		];

		for (var i = 0; i < origData.length; i++) {
			if (origData[i]["key"] == "majorpool") {
				pieData[2].data = origData[i]["doc_count"]
			}

			if (origData[i]["key"] == "pool") {
				pieData[0].data = origData[i]["doc_count"]
			}

			if (origData[i]["key"] == "loan") {
				pieData[1].data = origData[i]["doc_count"]
			}
		}

		return pieData;
	};
	
	_this.createPayloadPieChart = function() {
		var adsPieChart = $.plot('#adsPieChart', adsData, pieChartOptions);
		
		var total = 0;
		for ( var i=0; i<adsData.length; i++ ) {
			if ( adsData[i].data != undefined )
				total += parseInt(adsData[i].data);
		}
		
		$('#adsEntityCount').text('('+total+')');
		_this.warningIfNoData(adsPieChart, 'pie');
		
		$("#adsPieChart").bind("plotclick", function (event, pos, item) {
			if ( item ) {
				var lbl = item.series.label.replace(/\s/g, '');
				lbl = lbl.toLowerCase();
				_this.getADSEventPieData(lbl);
				_this.getLoanStackData(lbl);
			}
		});
	};
	
	_this.updatePayloadPieChart = function() {
		var newPieData = $.extend(true, [], adsData);
		var newPieOpts = $.extend(true, {}, pieChartOptions);
		
		var pieActLegends = [];
		newPieOpts.colors = [];
		$('#adsPieLegends li').each(function(i, elm) {
			var isInactive = $(elm).hasClass('inactive');
			if ( !isInactive ) {
				var lbl = $(elm).find('.lbl').text();
				var clr = pieChartOptions.colors[i];
				pieActLegends.push(lbl);
				newPieOpts.colors.push(clr);
			}
		});
		
		newPieData = $.grep(newPieData, function(o) {
			return $.inArray(o.label, pieActLegends) > -1;
		});
		
		if ( newPieData.length == 0 ) {
			newPieData = [{}];
		}
		
		var adsPieChart = $.plot('#adsPieChart', newPieData, newPieOpts);
		_this.warningIfNoData(adsPieChart, 'pie');
	};	
	
	_this.getEntityPieData = function() {
		var start, end, sel_date;
		var from = $("#fromDatetimepickerMBS input[type='text']").val();
		if ( from == '' ) {
			sel_date = new Date();
		} else {
			sel_date = new Date(from);
		}

		start = sel_date.setHours(0, 0, 0, 0);
		end = sel_date.setHours(23, 59, 59, 999);

		var piePostData = {
			"size": 0, 
			"query": {
				"bool": {
					"must": [
						{
							"range": {
								"paylaodgrp.payloadTime": {
									"from": start, 
									"to": end
								}
							}
						}
					], 
					"must_not": [ ], 
					"should": [ ]
				}
			}, 
			"aggs": {
				"group_by_EntityType": {
					"terms": {
						"field": "EntityType"
					}
				}
			}
		}
		
		jQuery.ajax({
			type: "POST",
			url: urlObj.mbs,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: true,
			data: JSON.stringify(piePostData),
			success: function (data) {
				entityData = data.aggregations.group_by_EntityType.buckets;
				_this.createEntityPieChart();
				
				_this.getEventPieData();
				_this.getMBSStackBarData();
			},
			error: function () {
				// TODO
			}
		});
	};
	
	_this.createEntityPieChart = function() {
		var newData = [];
		$('#entityTypePieLegends').empty();
		for ( var i=0; i<entityData.length; i++ ) {
			$('#entityTypePieLegends').append('<li>' +
												'<a href="javascript:void(0)">' +
													'<span style="background: '+ colorsArr[i] +'" class="box"></span>' +
													'<span class="lbl">'+ entityData[i].key +'</span>' +
												'</a>' +
											'</li>');
		
			entityPieChartOptins.colors.push(colorsArr[i]);
			newData.push({"label": entityData[i].key, "data": entityData[i].doc_count});
		}
		
		entityData = newData;
		newData = (newData.length == 0) ? [{}] : newData;
		var pieChart = $.plot('#entityTypePieChart', newData, entityPieChartOptins);
		
		var total = 0;
		for ( var i=0; i<newData.length; i++ ) {
			if ( newData[i].data != undefined )
				if ( newData[i].data != undefined )
					total += parseInt(newData[i].data);
		}
		
		$('#mbsEntityCount').text('('+total+')');
		
		_this.warningIfNoData(pieChart, 'pie');
		
		$("#entityTypePieChart").bind("plotclick", function (event, pos, item) {
			if ( item ) {
				_this.getEventPieData(item.series.label);
				_this.getMBSStackBarData(item.series.label);
			}
		});
	};
	
	_this.updateEntityPieChart = function() {
		var newPieData = $.extend(true, [], entityData);
		var newPieOpts = $.extend(true, {}, entityPieChartOptins);
		
		var pieActLegends = [];
		newPieOpts.colors = [];
		$('#entityTypePieLegends li').each(function(i, elm) {
			var isInactive = $(elm).hasClass('inactive');
			if ( !isInactive ) {
				var lbl = $(elm).find('.lbl').text();
				var clr = entityPieChartOptins.colors[i];
				pieActLegends.push(lbl);
				newPieOpts.colors.push(clr);
			}
		});
		
		newPieData = $.grep(newPieData, function(o) {
			return $.inArray(o.label, pieActLegends) > -1;
		});
		
		if ( newPieData.length == 0 ) {
			newPieData = [{}];
		}
		
		var pieChart = $.plot('#entityTypePieChart', newPieData, newPieOpts);
		_this.warningIfNoData(pieChart, 'pie');
	};
	
	_this.getEventPieData = function(entity) {
		var start, end, sel_date;
		var from = $("#fromDatetimepickerMBS input[type='text']").val();
		if ( from == '' ) {
			sel_date = new Date();
		} else {
			sel_date = new Date(from);
		}

		start = sel_date.setHours(0, 0, 0, 0);
		end = sel_date.setHours(23, 59, 59, 999);
		
		var query = {};
		if (entity) {
			query = {"bool":{"must":[{"term":{"EntityType":entity}},{"range":{"payloadTime":{"gt":start,"lt":end}}}],"must_not":[],"should":[]}};
		} else {
			query = {"bool":{"must":[{"range":{"payloadTime":{"gt":start,"lt":end}}}],"must_not":[],"should":[]}};
		}
		
		var piePostData = {
			"size":0,
			"query": query,
			"aggs": {
			  "group_by_EventType": {
				"terms": {
					"field": "EventType"
				}
			  }
			}
		}
		
		jQuery.ajax({
			type: "POST",
			url: urlObj.mbs,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: true,
			data: JSON.stringify(piePostData),
			success: function (data) {
				eventData = (data.aggregations.group_by_EventType.buckets.length > 0) ? data.aggregations.group_by_EventType.buckets : [];
				_this.createEventPieChart();
			},
			error: function () {
				// TODO
			}
		});
	};
	
	_this.createEventPieChart = function() {
		var newData = [];
		$('#eventTypePieLegends').empty();
		for ( var i=0; i<eventData.length; i++ ) {
			$('#eventTypePieLegends').append('<li>' +
												'<a href="javascript:void(0)">' +
													'<span style="background: '+ colorsArr[i] +'" class="box"></span>' +
													'<span class="lbl">'+ eventData[i].key +'</span>' +
												'</a>' +
											'</li>');
		
			eventPieChartOptins.colors.push(colorsArr[i]);
			newData.push({"label": eventData[i].key, "data": eventData[i].doc_count});
		}
		
		eventData = newData;
		
		var total = 0;
		for ( var i=0; i<newData.length; i++ ) {
			if ( newData[i].data != undefined )
				total += parseInt(newData[i].data);
		}
		$('#mbsEventCount').text('('+total+')');
		
		newData = (newData.length == 0) ? [{}] : newData;
		var pieChart = $.plot('#eventTypePieChart', newData, eventPieChartOptins);
		
		_this.warningIfNoData(pieChart, 'pie');
	};
	
	_this.updateEventPieChart = function() {
		var newPieData = $.extend(true, [], eventData);
		var newPieOpts = $.extend(true, {}, eventPieChartOptins);
		
		var pieActLegends = [];
		newPieOpts.colors = [];
		$('#eventTypePieLegends li').each(function(i, elm) {
			var isInactive = $(elm).hasClass('inactive');
			if ( !isInactive ) {
				var lbl = $(elm).find('.lbl').text();
				var clr = eventPieChartOptins.colors[i];
				pieActLegends.push(lbl);
				newPieOpts.colors.push(clr);
			}
		});
		
		newPieData = $.grep(newPieData, function(o) {
			return $.inArray(o.label, pieActLegends) > -1;
		});
		
		if ( newPieData.length == 0 ) {
			newPieData = [{}];
		}
		
		var pieChart = $.plot('#eventTypePieChart', newPieData, newPieOpts);
		_this.warningIfNoData(pieChart, 'pie');
	};
	/** PIE CHARTS END **/
	
	
	/** BAR CHARTS START **/
	_this.getLoanStackData = function(entity) {
		var start, end, sel_date;
		var from = $("#fromDatetimepicker input[type='text']").val();
		if ( from == '' ) {
			sel_date = new Date();
		} else {
			sel_date = new Date(from);
		}

		start = sel_date.setHours(0, 0, 0, 0);
		end = sel_date.setHours(23, 59, 59, 999);
		
		var query = {};
		if ( entity ) {
			query = { "bool": { "must": [ {"term":{"MessageSubtype": entity}},{"range": {"paylaodgrp.payloadTime": {"from": start, "to": end}}}], "must_not": [], "should": [] } };
		} else {
			query = { "bool": { "must": [ {"range": {"paylaodgrp.payloadTime": {"from": start, "to": end}}}], "must_not": [], "should": [] } };
		}
		
		var stackPostData = {
			"size": 0,
			"query": query,
			"aggs": {
				"group_by_Hour": {
					"terms": {
						"field": "HourWODate"
					},
					"aggs": {
						"group_by_eventType": {
							"terms": {
								"field": "EventType"
							}
						}
					}
				}
			}
		}


		jQuery.ajax({
			type: "POST",
			url: urlObj.ads,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(stackPostData),
			success: function (data) {
				stackData = (data.aggregations.group_by_Hour.buckets.length > 0) ? data.aggregations.group_by_Hour.buckets : [];
				_this.createLoanStackedBarChart();
			},
			error: function () {

			}
		});
	};
	
	_this.createLoanStackedBarChart = function() {
		var obj = {};
		var newData = [];
		var hourKey = [];
		$('#stackLegends').empty();
		var legendsArr = [];
		for ( var i=0; i<stackData.length; i++ ) {
			var hourData = stackData[i].group_by_eventType.buckets;
			for ( var j=0; j<hourData.length; j++ ) {
				if ( typeof obj[hourData[j].key] === 'undefined' ) {
					obj[hourData[j].key] = [];
				}
				
				obj[hourData[j].key][stackData[i].key] = [stackData[i].key, hourData[j].doc_count];
			
				if ( $.inArray(hourData[j].key, legendsArr) == -1 ) {
					adsBarGraphOptions.colors.push(colorsArr[j]);
					$('#stackLegends').append('<li>' +
													'<a href="javascript:void(0)">' +
														'<span style="background: '+ colorsArr[j] +'" class="box"></span>' +
														'<span class="lbl">'+ hourData[j].key +'</span>' +
													'</a>' +
												'</li>');
				}
				legendsArr.push(hourData[j].key);
			
			}
		}
		
		var idx = 0;
		$.each(obj, function(key, d) {
			newData.push({label: key, data: []});
			for ( var k=0; k<24; k++ ) {
				if ( typeof d[k] === 'undefined' ) {
					newData[idx].data.push([k, 0]);
				} else {
					newData[idx].data.push(d[k]);
				}
				hourKey.push([k, k]);
			}
			idx++;
		});
		
		stackData = newData;
		adsBarGraphOptions.xaxis.ticks = hourKey;
		var barChart = $.plot($("#barChartContainer"), stackData, adsBarGraphOptions);
		_this.warningIfNoData(barChart, 'bar');
		
		$("#barChartContainer").bind("plothover", function (event, pos, item) {
			if ( item ) {
				/*var content = "<div class='popover-content text-center'>";
				content += "<p style='margin:5px 0;'>" + item.series.label + ": " + (item.datapoint[1] - item.datapoint[2]) + "</p>";
				content += "</div>";
		
				_this.showTooltip(item.pageX, item.pageY, content);*/
			} else {
				$('#graphTooltip').remove();
			}
		});
	};
	
	_this.updateLoanBarChart = function() {
		var newStackData = $.extend(true, [], stackData);
		var newBarOpts = $.extend(true, {}, adsBarGraphOptions);
		
		var barLegends = [];
		newBarOpts.colors = [];
		$('#stackLegends li').each(function(i, elm) {
			var isInactive = $(elm).hasClass('inactive');
			if ( !isInactive ) {
				var lbl = $(elm).find('.lbl').text();
				var clr = adsBarGraphOptions.colors[i];
				barLegends.push(lbl);
				newBarOpts.colors.push(clr);
			}
		});
		
		newStackData = $.grep(newStackData, function(o) {
			return $.inArray(o.label, barLegends) > -1;
		});
		
		/*if ( newStackData.length == 0 ) {
			newStackData = [{}];
		}*/
		
		var barChart = $.plot('#barChartContainer', newStackData, newBarOpts);
		_this.warningIfNoData(barChart, 'bar');
	};
	
	_this.getMBSStackBarData = function(entity) {
		var start, end, sel_date;
		var from = $("#fromDatetimepickerMBS input[type='text']").val();
		if ( from == '' ) {
			sel_date = new Date();
		} else {
			sel_date = new Date(from);
		}

		start = sel_date.setHours(0, 0, 0, 0);
		end = sel_date.setHours(23, 59, 59, 999);
		
		var query = {};
		if ( entity ) {
			query = { "bool": { "must": [ {"term":{"EntityType": entity}},{"range": {"paylaodgrp.payloadTime": {"from": start, "to": end}}}], "must_not": [], "should": [] } };
		} else {
			query = { "bool": { "must": [ {"range": {"paylaodgrp.payloadTime": {"from": start, "to": end}}}], "must_not": [], "should": [] } };
		}
		
		var stackPostData = {
			"size": 0,
			"query": query,
			"aggs": {
				"group_by_Hour": {
					"terms": {
						"field": "HourWODate"
					},
					"aggs": {
						"group_by_eventType": {
							"terms": {
								"field": "EventType"
							}
						}
					}
				}
			}
		}

		jQuery.ajax({
			type: "POST",
			url: urlObj.mbs,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(stackPostData),
			success: function (data) {
				MBSStackData = (data.aggregations.group_by_Hour.buckets.length > 0) ? data.aggregations.group_by_Hour.buckets : [];
				_this.createMBSStackedBarChart();
			},
			error: function () {

			}
		});
	};
	
	_this.createMBSStackedBarChart = function() {
		var obj = {};
		var newData = [];
		var hourKey = [];
		$('#mbsStackLegends').empty();
		var legendsArr = [];
		for ( var i=0; i<MBSStackData.length; i++ ) {
			var hourData = MBSStackData[i].group_by_eventType.buckets;
			for ( var j=0; j<hourData.length; j++ ) {
				if ( typeof obj[hourData[j].key] === 'undefined' ) {
					obj[hourData[j].key] = [];
				}
				
				obj[hourData[j].key][MBSStackData[i].key] = [MBSStackData[i].key, hourData[j].doc_count];
				
				if ( $.inArray(hourData[j].key, legendsArr) == -1 ) {
					mbsBarGraphOptions.colors.push(colorsArr[j]);
					$('#mbsStackLegends').append('<li>' +
												'<a href="javascript:void(0)">' +
													'<span style="background: '+ colorsArr[j] +'" class="box"></span>' +
													'<span class="lbl">'+ hourData[j].key +'</span>' +
												'</a>' +
											'</li>');
				}
				legendsArr.push(hourData[j].key);
			}
		}
		
		var idx = 0;
		$.each(obj, function(key, d) {
			newData.push({label: key, data: []});
			for ( var k=0; k<24; k++ ) {
				if ( typeof d[k] === 'undefined' ) {
					newData[idx].data.push([k, 0]);
				} else {
					newData[idx].data.push(d[k]);
				}
				hourKey.push([k, k]);
			}
			idx++;
		});
		
		MBSStackData = newData;
		mbsBarGraphOptions.xaxis.ticks = hourKey;
		var barChart = $.plot($("#mbsBarChartContainer"), MBSStackData, mbsBarGraphOptions);
		_this.warningIfNoData(barChart, 'bar');
		
		$("#mbsBarChartContainer").bind("plothover", function (event, pos, item) {
			if ( item ) {
				/*var content = "<div class='popover-content text-center'>";
				content += "<p style='margin:5px 0;'>" + item.series.label + ": " + (item.datapoint[1] - item.datapoint[2]) + "</p>";
				content += "</div>";
		
				_this.showTooltip(item.pageX, item.pageY, content);*/
			} else {
				$('#graphTooltip').remove();
			}
		});
	};
	
	_this.updateMBSStackBarChart = function() {
		var newStackData = $.extend(true, [], MBSStackData);
		var newBarOpts = $.extend(true, {}, mbsBarGraphOptions);
		
		var barLegends = [];
		newBarOpts.colors = [];
		$('#mbsStackLegends li').each(function(i, elm) {
			var isInactive = $(elm).hasClass('inactive');
			if ( !isInactive ) {
				var lbl = $(elm).find('.lbl').text();
				var clr = mbsBarGraphOptions.colors[i];
				barLegends.push(lbl);
				newBarOpts.colors.push(clr);
			}
		});
		
		newStackData = $.grep(newStackData, function(o) {
			return $.inArray(o.label, barLegends) > -1;
		});
		
		/*if ( newStackData.length == 0 ) {
			newStackData = [{}];
		}*/
		
		var barChart = $.plot('#mbsBarChartContainer', newStackData, newBarOpts);
		_this.warningIfNoData(barChart, 'bar');
	};
	
	/*_this.getGroupBarData = function() {
		var start, end, sel_date;
		if ( curPage.payload == 'ads' ) {
			var url = urlObj.ads;
			var from = $("#fromDatetimepicker input[type='text']").val();
		} else {
			var url = urlObj.mbs;
			var from = $("#fromDatetimepickerMBS input[type='text']").val();
		}
		
		if ( from == '' ) {
			sel_date = new Date();
		} else {
			sel_date = new Date(from);
		}
		
		var month = sel_date.getMonth();
		var year = sel_date.getFullYear();
		var days = new Date(year, month+1, 0).getDate() - 1;
		
		sel_date.setDate(1);
		start = sel_date.setHours(0, 0, 0, 0);
		end = sel_date.setHours(days*24+23, 59, 59, 999);
		
		var fldType = '';
		if ( curPage.payload == 'ads' ) {
			fldType = 'MessageSubtype';
		} else {
			fldType = 'EntityType';
		}

		var groupPostData = {
			"size": 32, 
			"query": {
				"bool": {
					"must": [
						{
							"range": {
								"payloadTime": {
									"gt": start, 
									"lt": end
								}
							}
						}
					], 
					"must_not": [ ], 
					"should": [ ]
				}
			}, 
			"aggs": {
				"group_by_DayOfMonth": {
					"terms": {
						"field": "DayOfMonth"
					}, 
					"aggs": {
						"group_by_Entity": {
							"terms": {
								"field": fldType
							}
						}
					}
				}
			}
		}
		
		jQuery.ajax({
			type: "POST",
			url: url,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(groupPostData),
			success: function (data) {
				if ( curPage.payload == 'ads' ) {
					ADSGroupData = data.aggregations.group_by_DayOfMonth.buckets;
					_this.createADSGroupBarChart(days);
				} else {
					MBSGroupData = data.aggregations.group_by_DayOfMonth.buckets;
					_this.createMBSGroupBarChart(days);
				}
			},
			error: function () {

			}
		});
	};*/

	_this.getGroupBarData = function() {
		var start, end, sel_date;
		if ( curPage.payload == 'ads' ) {
			var url = urlObj.ads;
			var from = $("#fromDatetimepicker input[type='text']").val();
		} else if ( curPage.payload == 'ediCdh' ) {
			var url = urlObj.ediCdh;
			var from = $("#fromDatetimepickerEdiCdh input[type='text']").val();
		} else {
			var url = urlObj.mbs;
			var from = $("#fromDatetimepickerMBS input[type='text']").val();
		}
		
		if ( from == '' ) {
			sel_date = new Date();
		} else {
			sel_date = new Date(from);
		}
		
		var month = sel_date.getMonth();
		var year = sel_date.getFullYear();
		var days = new Date(year, month+1, 0).getDate() - 1;
		
		sel_date.setDate(1);
		start = sel_date.setHours(0, 0, 0, 0);
		end = sel_date.setHours(days*24+23, 59, 59, 999);
		
		var fldType = '';
		if ( curPage.payload == 'ads' ) {
			fldType = 'MessageSubtype';
		} else {
			fldType = 'EntityType';
		}

		var groupPostData = {
			"size": 32, 
			"query": {
				"bool": {
					"must": [
						{
							"range": {
								"payloadTime": {
									"gt": start, 
									"lt": end
								}
							}
						}
					], 
					"must_not": [ ], 
					"should": [ ]
				}
			}, 
			"aggs": {
				"group_by_DayOfMonth": {
					"terms": {
						"field": "DayOfMonth"
					}, 
					"aggs": {
						"group_by_Entity": {
							"terms": {
								"field": fldType
							}
						}
					}
				}
			}
		}
		
		jQuery.ajax({
			type: "POST",
			url: url,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(groupPostData),
			success: function (data) {
				if ( curPage.payload == 'ads' ) {
					ADSGroupData = data.aggregations.group_by_DayOfMonth.buckets;
					_this.createADSGroupBarChart(days);
				} else if ( curPage.payload == 'ediCdh' ) {
					EDICDHGroupData = data.aggregations.group_by_DayOfMonth.buckets;
					_this.createEDICDHGroupBarChart(days);
				} else {
					MBSGroupData = data.aggregations.group_by_DayOfMonth.buckets;
					_this.createMBSGroupBarChart(days);
				}
			},
			error: function () {

			}
		});
	};
	
	_this.createADSGroupBarChart = function(days) {
		var newData = [];
		var hourKey = [];
		$('#adsGroupLegends').empty();
		var obj = {};
		
		for ( var i=0; i<ADSGroupData.length; i++ ) {
			var entities = ADSGroupData[i].group_by_Entity.buckets;
			var index = ADSGroupData[i].key;
			for ( var j=0; j<entities.length; j++ ) {
				var label = entities[j].key;
				var count = entities[j].doc_count;
				if(label == "pool"){
					label = "Pool";
				}else if(label == "loan"){
					label = "Loan";
				}else if(label == "majorpool"){
					label = "Major Pool";
				}
				if ( typeof obj[label] === 'undefined' ) {
					obj[label] = {
						label: label,
						data: []
					};
				}
				
				obj[label].data[index] = [index, count];
			}
		}
		
		days++;
		var counter=0;
		$.each(obj, function(k, d) {
			for ( var j=0; j<days; j++ ) {
				if ( typeof d.data[j] === 'undefined' ) {
					d.data[j] = [j, 0];
				}
				hourKey.push([j, j]);
			}
			newData.push(d);
			
			groupBarGraphOptions.colors.push(colorsArr[counter]);
			$('#adsGroupLegends').append('<li>' +
										'<a href="javascript:void(0)">' +
											'<span style="background: '+ colorsArr[counter] +'" class="box"></span>' +
											'<span class="lbl">'+ k +'</span>' +
										'</a>' +
									'</li>');
			
			counter++;
		});
		
		ADSGroupData = newData;
		groupBarGraphOptions.xaxis.ticks = hourKey;
		var barChart = $.plot($("#adsGroupBarChartContainer"), ADSGroupData, groupBarGraphOptions);
		_this.warningIfNoData(barChart, 'bar');
		
		$("#adsGroupBarChartContainer").bind("plothover", function (event, pos, item) {
			if ( item ) {
				/*var content = "<div class='popover-content text-center'>";
				content += "<p style='margin:5px 0;'>" + item.series.label + ": " + (item.datapoint[1] - item.datapoint[2]) + "</p>";
				content += "</div>";
		
				_this.showTooltip(item.pageX, item.pageY, content);*/
			} else {
				$('#graphTooltip').remove();
			}
		});
	};
	
	_this.createMBSGroupBarChart = function(days) {
		var newData = [];
		var hourKey = [];
		$('#mbsGroupLegends').empty();
		var obj = {};
		
		for ( var i=0; i<MBSGroupData.length; i++ ) {
			var entities = MBSGroupData[i].group_by_Entity.buckets;
			var index = MBSGroupData[i].key;
			for ( var j=0; j<entities.length; j++ ) {
				var label = entities[j].key;
				var count = entities[j].doc_count;
				if ( typeof obj[label] === 'undefined' ) {
					obj[label] = {
						label: label,
						data: []
					};
				}
				
				obj[label].data[index] = [index, count];
			}
		}
		
		days++;
		var counter=0;
		$.each(obj, function(k, d) {
			for ( var j=0; j<days; j++ ) {
				if ( typeof d.data[j] === 'undefined' ) {
					d.data[j] = [j, 0];
				}
				hourKey.push([j, j]);
			}
			newData.push(d);
			
			groupBarGraphOptions.colors.push(colorsArr[counter]);
			$('#mbsGroupLegends').append('<li>' +
										'<a href="javascript:void(0)">' +
											'<span style="background: '+ colorsArr[counter] +'" class="box"></span>' +
											'<span class="lbl">'+ k +'</span>' +
										'</a>' +
									'</li>');
			
			counter++;
		});
		
		MBSGroupData = newData;
		groupBarGraphOptions.xaxis.ticks = hourKey;
		var barChart = $.plot($("#mbsGroupBarChartContainer"), MBSGroupData, groupBarGraphOptions);
		_this.warningIfNoData(barChart, 'bar');
		
		$("#mbsGroupBarChartContainer").bind("plothover", function (event, pos, item) {
			if ( item ) {
				/*var content = "<div class='popover-content text-center'>";
				content += "<p style='margin:5px 0;'>" + item.series.label + ": " + (item.datapoint[1] - item.datapoint[2]) + "</p>";
				content += "</div>";
		
				_this.showTooltip(item.pageX, item.pageY, content);*/
			} else {
				$('#graphTooltip').remove();
			}
		});
	};
	
	_this.updateADSGroupBarChart = function() {
		var newData = $.extend(true, [], ADSGroupData);
		var newBarOpts = $.extend(true, {}, groupBarGraphOptions);
		
		var barLegends = [];
		newBarOpts.colors = [];
		$('#adsGroupLegends li').each(function(i, elm) {
			var isInactive = $(elm).hasClass('inactive');
			if ( !isInactive ) {
				var lbl = $(elm).find('.lbl').text();
				var clr = groupBarGraphOptions.colors[i];
				barLegends.push(lbl);
				newBarOpts.colors.push(clr);
			}
		});
		
		newData = $.grep(newData, function(o) {
			return $.inArray(o.label, barLegends) > -1;
		});
		
		var barChart = $.plot('#adsGroupBarChartContainer', newData, newBarOpts);
		_this.warningIfNoData(barChart, 'bar');
	};
	
	_this.updateMBSGroupBarChart = function() {
		var newData = $.extend(true, [], MBSGroupData);
		var newBarOpts = $.extend(true, {}, groupBarGraphOptions);
		
		var barLegends = [];
		newBarOpts.colors = [];
		$('#mbsGroupLegends li').each(function(i, elm) {
			var isInactive = $(elm).hasClass('inactive');
			if ( !isInactive ) {
				var lbl = $(elm).find('.lbl').text();
				var clr = groupBarGraphOptions.colors[i];
				barLegends.push(lbl);
				newBarOpts.colors.push(clr);
			}
		});
		
		newData = $.grep(newData, function(o) {
			return $.inArray(o.label, barLegends) > -1;
		});
		
		var barChart = $.plot('#mbsGroupBarChartContainer', newData, newBarOpts);
		_this.warningIfNoData(barChart, 'bar');
	};
	/** BAR CHARTS END **/
	
	
	/** LINE CHARTS START **/
	_this.createLineChart = function() {
		var loanLineChartHolder = $("#loanLineChart");
		var poolLineChartHolder = $("#poolLineChart");
		poolLineChartHolder.height(230).empty();
		loanLineChartHolder.height(230).empty();
		
		var loanLineChart = $.plot(loanLineChartHolder, loanLineData, loanChartOpts);
		_this.warningIfNoData(loanLineChart, 'line');

		var loanYaxisLabelLeft = $("<div class='axisLabel yaxisLabel-L'></div>").text("Loan Per Minute").appendTo(loanLineChartHolder);
		loanYaxisLabelLeft.css("margin-top", loanYaxisLabelLeft.width() / 2 - 20);
		var loanYaxisLabelright = $("<div class='axisLabel yaxisLabel-R'></div>").text("Total Loan").appendTo(loanLineChartHolder);
		loanYaxisLabelright.css("margin-top", loanYaxisLabelLeft.width() / 2 - 20);
		
		var poolLineChart = $.plot(poolLineChartHolder, poolLineData, poolChartOpts);
		_this.warningIfNoData(poolLineChart, 'line');

		var poolYaxisLabelLeft = $("<div class='axisLabel yaxisLabel-L'></div>").text("Pool Per Minute").appendTo(poolLineChartHolder);
		loanYaxisLabelLeft.css("margin-top", poolYaxisLabelLeft.width() / 2 - 20);
		var poolYaxisLabelright = $("<div class='axisLabel yaxisLabel-R'></div>").text("Total Pool").appendTo(poolLineChartHolder);
		poolYaxisLabelright.css("margin-top", poolYaxisLabelright.width() / 2 - 20);	
		
	};
	
	_this.updateLoadLineChart = function() {
		var newLoadLineData = $.extend(true, [], loanLineData);
		var loadActLegends = [];
		var loadLineOpts = $.extend(true, {}, loanChartOpts);
		
		loadLineOpts.colors = [];
		$('#loanLineLegends li').each(function(i, elm) {
			var isInactive = $(elm).hasClass('inactive');
			if ( !isInactive ) {
				var lbl = $(elm).find('.lbl').text();
				var clr = loanChartOpts.colors[i];
				loadActLegends.push(lbl);
				loadLineOpts.colors.push(clr);
			}
		});
		
		newLoadLineData = $.grep(newLoadLineData, function(o) {
			return $.inArray(o.label, loadActLegends) > -1;
		});
		
		var loanLineChartHolder = $("#loanLineChart");
		var loanLineChart = $.plot(loanLineChartHolder, newLoadLineData, loadLineOpts);
		_this.warningIfNoData(loanLineChart, 'line');

		var loanYaxisLabelLeft = $("<div class='axisLabel yaxisLabel-L'></div>").text("Loan Per Minute").appendTo(loanLineChartHolder);
		loanYaxisLabelLeft.css("margin-top", loanYaxisLabelLeft.width() / 2 - 20);
	
		var loanYaxisLabelLeft = $("<div class='axisLabel yaxisLabel-R'></div>").text("Total Loan").appendTo(loanLineChartHolder);
		loanYaxisLabelLeft.css("margin-top", loanYaxisLabelLeft.width() / 2 - 20);
	};
	
	_this.updatePoolLineChart = function() {
		var newPoolLineData = $.extend(true, [], poolLineData);
		var poolActLegends = [];
		var poolLineOpts = $.extend(true, {}, poolChartOpts);
		
		poolLineOpts.colors = [];
		$('#poolLineLegends li').each(function(i, elm) {
			var isInactive = $(elm).hasClass('inactive');
			if ( !isInactive ) {
				var lbl = $(elm).find('.lbl').text();
				var clr = poolChartOpts.colors[i];
				poolActLegends.push(lbl);
				poolLineOpts.colors.push(clr);
			}
		});
		
		newPoolLineData = $.grep(newPoolLineData, function(o) {
			return $.inArray(o.label, poolActLegends) > -1;
		});
		
		var poolLineChartHolder = $("#poolLineChart");
		var poolLineChart = $.plot(poolLineChartHolder, newPoolLineData, poolLineOpts);
		_this.warningIfNoData(poolLineChart, 'line');

		var poolYaxisLabelLeft = $("<div class='axisLabel yaxisLabel-L'></div>").text("Pool Per Minute").appendTo(poolLineChartHolder);
		poolYaxisLabelLeft.css("margin-top", poolYaxisLabelLeft.width() / 2 - 20);

		var poolYaxisLabelright = $("<div class='axisLabel yaxisLabel-R'></div>").text("Total Pool").appendTo(poolLineChartHolder);
		poolYaxisLabelright.css("margin-top", loanYaxisLabelright.width() / 2 - 20);
		
	};
	
	_this.updateLineData = function(d, index) {
		var timestamp = _this.getCurrentTime();
		
		if ( $.isArray(d) && d.length > 0 ) {
			for ( var i=0; i<d.length; i++ ) {
				if ( d[i].MessageSubtype == 'POOL' ) {
					poolLineData[index].data.push([timestamp, d[i].countPayLoaDCount]);
				} else if ( d[i].MessageSubtype == 'LOAN' ) {
					loanLineData[index].data.push([timestamp, d[i].countPayLoaDCount]);
				}
			}
		} else if ( !$.isEmptyObject(d) ) {
			if ( d.MessageSubtype == 'POOL' ) {
				poolLineData[index].data.push([timestamp, d.countPayLoaDCount]);
			} else if ( d.MessageSubtype == 'LOAN' ) {
				loanLineData[index].data.push([timestamp, d.countPayLoaDCount]);
			}
		}
		
		_this.updateLoadLineChart();
		_this.updatePoolLineChart();
	};
	
	_this.createMBSLineChart = function() {
		var lineChartHolder = $("#mbsRTLineChart");
		lineChartHolder.height(230).empty();
		
		var entity = $('#mbsRTLineLegends li:not(.inactive) .lbl').text();
		var data = (mbsLineData[entity]) ? mbsLineData[entity] : [{}];
		
		var mbsRTLineChart = $.plot(lineChartHolder, data, mbsLineChartOpts);
		_this.warningIfNoData(mbsRTLineChart, 'line');
	};
	
	_this.updateMBSLineData = function(d, index) {
		var timestamp = _this.getCurrentTime();
		
		if ( $.isArray(d) && d.length > 0 ) {
			for ( var i=0; i<d.length; i++ ) {
				var entity = d[i].EntityType;
				mbsLineData[entity][index].data.push([timestamp, d[i].countMBSMessageCount]);
			}
		} else if ( !$.isEmptyObject(d) ) {
			var entity = d.EntityType;
			mbsLineData[entity][index].data.push([timestamp, d.countMBSMessageCount]);
		}
		var str = JSON.stringify(mbsLineData);
		_this.updateMBSLineChart();
	};
	
	_this.updateMBSLineChart = function() {
		var lineChartHolder = $("#mbsRTLineChart");
		var entity = $('#mbsRTLineLegends li:not(.inactive) .lbl').text();
		var data = mbsLineData[entity];
		var mbsRTLineChart = $.plot(lineChartHolder, data, mbsLineChartOpts);
		_this.warningIfNoData(mbsRTLineChart, 'line');
	};
	/** LINE CHARTS END **/
	
	
	/** ALERTS TABLE START **/
	_this.getAlertData = function() {
		/*var alertQueryData = {
			"query": {"bool": {"must": [{"match_all": {}}], "must_not": [], "should": []}},
			"from": 0,
			"size": 10,
			"sort": [{"timestamp": {"order": "desc", "mode": "avg"}}],
			"facets": {}
		};*/

		var alertQueryData = { 
			"size":10,
		    "query": {
		        "match": {
		            "data": "\"MessageSubtype\":"
		        }
		    },
			"sort":[{"timestamp" : {"order" : "desc", "mode" : "avg"}}]
		};
		
		jQuery.ajax({
			type: "POST",
			url: urlObj.alerts,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(alertQueryData),
			success: function (data) {
				_this.createAlertTable(data.hits.hits);
			},
			error: function () {

			}
		});
	};
	
	_this.createAlertTable = function(alertData) {
		$('#alertTable tbody, #mbsAlertTable tbody, #ediCdhAlertTable tbody').empty();
		alertData.forEach(function (obj) {
			var trElem = '';
			var hourOfDay = 0; // Todo : not received yet
			var alertInfo = jQuery.parseJSON(obj._source.data);
			var alertType, count, alertHighLowSubType, timeStamp, date, alertDesc, keyType;
			if ( alertInfo.MessageSubtype || alertInfo.EntityType ) {
				keyType = (alertInfo.MessageSubtype) ? 'MessageType' : 'EntityType';
                alertType = (alertInfo.MessageSubtype) ? alertInfo.MessageSubtype : alertInfo.EntityType;
				hourOfDay = alertInfo.HourOfDay;
				if ( alertInfo.sumPayLoaDCount > 0) {
					count = alertInfo.sumPayLoaDCount;
					alertHighLowSubType = "High";
				} else if ( alertInfo.sumMessageCount > 0 ) {
					count = alertInfo.sumMessageCount;
					alertHighLowSubType = "High";
				} else if ( alertInfo.countPayLoaDCount > 0 ) {
					count = alertInfo.countPayLoaDCount;
					alertHighLowSubType = "Low";
				} else if ( alertInfo.countMessageCount > 0 ) {
					count = alertInfo.countMessageCount;
					alertHighLowSubType = "Low";
				} else if ( alertInfo.sumMBSMessageCount > 0 ) {
					count = alertInfo.sumMBSMessageCount;
					alertHighLowSubType = "High";
				} else if ( alertInfo.countMBSMessageCount > 0 ) {
					count = alertInfo.countMBSMessageCount;
					alertHighLowSubType = "Low";
				} else if ( alertInfo.sumManifestTotalRecordCount > 13 ) {
					count = alertInfo.sumManifestTotalRecordCount;
					alertHighLowSubType = "High";
				} else if ( alertInfo.sumManifestTotalRecordCount < 7 ) {
					count = alertInfo.sumManifestTotalRecordCount;
					alertHighLowSubType = "Low";
				}

				timeStamp = Number(alertInfo.timetsamp);
				date = new Date(timeStamp);

				alertDesc = _this.generateAlertDesc(keyType , alertType, alertHighLowSubType, hourOfDay); // Todo
				trElem = trElem + '<tr>' +
					'<td>' + alertType + ' ' + alertHighLowSubType + '</td>' +
					'<td>' + date + '</td>' +
					'<td>' + alertDesc + '</td>' +
					'</tr>';
				
				$('#alertTable tbody, #mbsAlertTable tbody, #ediCdhAlertTable tbody').append(trElem);
			}
		});
	};
	
	_this.generateAlertDesc = function(keyType , alertType, alertHighLowSubType, hourOfDay) {
		var highLowDescObj = {
			"High": "crossed",
			"Low": "fall short of",
		};

		var countLimitObj = {
			"LOAN": {
				"High": 13,
				"Low": 7
			},

			"POOL": {
				"High": 9,
				"Low": 15
			}
		}

		var msg = alertHighLowSubType + " Threshold alert occured at Hour: " + hourOfDay + " for " + keyType + " " + alertType;
		return msg;
	};
	/** ALERTS TABLE END **/
	
	
	_this.warningIfNoData = function(fChart, type) {
		var showNoData = false;
		if ( type == 'pie' ) {
			if ( fChart.getData().length == 0 || (fChart.getData()[0] && isNaN(fChart.getData()[0].percent)) ) {
				showNoData = true;
			}
		} else {
			if ( fChart.getData().length == 0 ) {
				showNoData = true;
			}
		}
		
		if ( showNoData ) {
			var canvas = fChart.getCanvas();
			var ctx = canvas.getContext("2d");
			var x = canvas.width / 2;
			var y = canvas.height / 2;
			ctx.font = '14pt Calibri';
			ctx.textAlign = 'center';
			ctx.fillStyle = '#999999';
			ctx.fillText('No Data!', x, y);
		}
	};
	
	_this.getCurrentTime = function() {
		var offset = -5.0
		var clientDate = new Date();
		var utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);
		var serverDate = new Date(utc + (3600000*offset));
		return serverDate.getTime();
		
		//return new Date().getTime();
	};
	
	_this.adsDataRefresh = function() {
		_this.getPayloadPieData();
		_this.getGroupBarData();
		_this.createLineChart();
		_this.getAlertData();
	};
	
	_this.mbsDataRefresh = function() {
		_this.getEntityPieData();
		_this.getGroupBarData();
		_this.createMBSLineChart();
	};
	
	_this.showTooltip = function(x, y, content) {
		$('#graphTooltip').remove();
		$tooltip = $('<div/>', {
			'id': 'graphTooltip',
			'class': 'popover'
		}).css({
			position: "absolute",
			display: "none",
			top: 0,
			left: 0
		}).appendTo('body');
		
		$tooltip.html(content);
		var winW = $(document).width();
		var tipW = 0;
		
		if ( x > winW/2 ) {
			tipW = $tooltip.width() + 15;
		}
		
		$tooltip.css({
				left: x + 10 - tipW,
				top: y + 5
			}).html(content).show();
	};

	// added by .... - { 01-03-16 }
	_this.ediCdhDataRefresh = function() {
		_this.getEdiCdhPieData();
		_this.getGroupBarData();
		_this.createEdiCdhSLineChart();
	};

	_this.getEdiCdhPieData = function() {
		var start, end, sel_date;
		var from = $("#fromDatetimepickerEdiCdh input[type='text']").val();
		if ( from == '' ) {
			sel_date = new Date();
		} else {
			sel_date = new Date(from);
		}

		start = sel_date.setHours(0, 0, 0, 0);
		end = sel_date.setHours(23, 59, 59, 999);

		var piePostData = {
			"size": 0, 
			"query": {
				"bool": {
					"must": [
						{
							"range": {
								"paylaodgrp.payloadTime": {
									"from": start, 
									"to": end
								}
							}
						}
					], 
					"must_not": [ ], 
					"should": [ ]
				}
			}, 
			"aggs": {
				"group_by_EntityType": {
					"terms": {
						"field": "EntityType"
					}
				}
			}
		}
		
		jQuery.ajax({
			type: "POST",
			url: urlObj.ediCdh,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: true,
			data: JSON.stringify(piePostData),
			success: function (data) {

				ediCdhEntityData = data.aggregations.group_by_EntityType.buckets;
				_this.createEdiCdhEntityPieChart();
				
				_this.getEdiCdhEventPieData();
				_this.getEdiCdhStackBarData();
			},
			error: function () {
				// TODO
			}
		});
	};

	_this.createEdiCdhEntityPieChart = function() {
		var newData = [];
		$('#ediCdhEntityTypePieLegends').empty();
		for ( var i=0; i<ediCdhEntityData.length; i++ ) {
			$('#ediCdhEntityTypePieLegends').append('<li>' +
												'<a href="javascript:void(0)">' +
													'<span style="background: '+ colorsArr[i] +'" class="box"></span>' +
													'<span class="lbl">'+ ediCdhEntityData[i].key +'</span>' +
												'</a>' +
											'</li>');
		
			entityPieChartOptins.colors.push(colorsArr[i]);
			newData.push({"label": ediCdhEntityData[i].key, "data": ediCdhEntityData[i].doc_count});
		}
		
		ediCdhEntityData = newData;
		newData = (newData.length == 0) ? [{}] : newData;
		newDataa = [{}];
		var pieChart = $.plot('#ediCdhEntityTypePieChart', ediCdhEntityData, entityPieChartOptins);
		
		var total = 0;
		for ( var i=0; i<newData.length; i++ ) {
			if ( newData[i].data != undefined )
				total += parseInt(newData[i].data);
		}
		
		$('#ediCdhEntityCount').text('('+total+')');
		
		_this.warningIfNoData(pieChart, 'pie');
		
		$("#ediCdhEntityTypePieChart").bind("plotclick", function (event, pos, item) {
			if ( item ) {
				_this.getEdiCdhEventPieData(item.series.label);
				_this.getEdiCdhStackBarData(item.series.label);
			}
		});
	};

	_this.getEdiCdhEventPieData = function(entity) {
		var start, end, sel_date;
		var from = $("#fromDatetimepickerEdiCdh input[type='text']").val();
		if ( from == '' ) {
			sel_date = new Date();
		} else {
			sel_date = new Date(from);
		}

		start = sel_date.setHours(0, 0, 0, 0);
		end = sel_date.setHours(23, 59, 59, 999);
		
		var query = {};
		if (entity) {
			query = {"bool":{"must":[{"term":{"EntityType":entity}},{"range":{"payloadTime":{"gt":start,"lt":end}}}],"must_not":[],"should":[]}};
		} else {
			query = {"bool":{"must":[{"range":{"payloadTime":{"gt":start,"lt":end}}}],"must_not":[],"should":[]}};
		}
		
		var piePostData = {
			"size":0,
			"query": query,
			"aggs": {
			  "group_by_EventType": {
				"terms": {
					"field": "EventType"
				}
			  }
			}
		}
		
		jQuery.ajax({
			type: "POST",
			url: urlObj.ediCdh,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: true,
			data: JSON.stringify(piePostData),
			success: function (data) {
				ediCdhEventData = (data.aggregations.group_by_EventType.buckets.length > 0) ? data.aggregations.group_by_EventType.buckets : [];
				_this.createEdiCdhEventPieChart();
			},
			error: function () {
				// TODO
			}
		});
	};

	_this.createEdiCdhEventPieChart = function() {
		var newData = [];
		$('#ediCdhEventTypePieLegends').empty();
		for ( var i=0; i<ediCdhEventData.length; i++ ) {
			$('#ediCdhEventTypePieLegends').append('<li>' +
												'<a href="javascript:void(0)">' +
													'<span style="background: '+ colorsArr[i] +'" class="box"></span>' +
													'<span class="lbl">'+ ediCdhEventData[i].key +'</span>' +
												'</a>' +
											'</li>');
		
			eventPieChartOptins.colors.push(colorsArr[i]);
			newData.push({"label": ediCdhEventData[i].key, "data": ediCdhEventData[i].doc_count});
		}
		
		ediCdhEventData = newData;
		
		var total = 0;
		for ( var i=0; i<newData.length; i++ ) {
			if ( newData[i].data != undefined )
				total += parseInt(newData[i].data);
		}
		$('#ediCdhEventCount').text('('+total+')');
		
		newData = (newData.length == 0) ? [{}] : newData;
		var pieChart = $.plot('#ediCdhEventTypePieChart', newData, eventPieChartOptins);
		
		_this.warningIfNoData(pieChart, 'pie');
	};

	_this.getEdiCdhStackBarData = function(entity) {
		var start, end, sel_date;
		var from = $("#fromDatetimepickerEdiCdh input[type='text']").val();
		if ( from == '' ) {
			sel_date = new Date();
		} else {
			sel_date = new Date(from);
		}

		start = sel_date.setHours(0, 0, 0, 0);
		end = sel_date.setHours(23, 59, 59, 999);
		
		var query = {};
		if ( entity ) {
			query = { "bool": { "must": [ {"term":{"EntityType": entity}},{"range": {"paylaodgrp.payloadTime": {"from": start, "to": end}}}], "must_not": [], "should": [] } };
		} else {
			query = { "bool": { "must": [ {"range": {"paylaodgrp.payloadTime": {"from": start, "to": end}}}], "must_not": [], "should": [] } };
		}
		
		var stackPostData = {
			"size": 0,
			"query": query,
			"aggs": {
				"group_by_Hour": {
					"terms": {
						"field": "HourWODate"
					},
					"aggs": {
						"group_by_eventType": {
							"terms": {
								"field": "EventType"
							}
						}
					}
				}
			}
		}

		jQuery.ajax({
			type: "POST",
			url: urlObj.ediCdh,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(stackPostData),
			success: function (data) {
				EDICDHStackData = (data.aggregations.group_by_Hour.buckets.length > 0) ? data.aggregations.group_by_Hour.buckets : [];
				_this.createEdiCdhStackedBarChart();
			},
			error: function () {

			}
		});
	};

	_this.createEdiCdhStackedBarChart = function() {
		var obj = {};
		var newData = [];
		var hourKey = [];
		$('#ediCdhStackLegends').empty();
		var legendsArr = [];
		for ( var i=0; i<EDICDHStackData.length; i++ ) {
			var hourData = EDICDHStackData[i].group_by_eventType.buckets;
			for ( var j=0; j<hourData.length; j++ ) {
				if ( typeof obj[hourData[j].key] === 'undefined' ) {
					obj[hourData[j].key] = [];
				}
				
				obj[hourData[j].key][EDICDHStackData[i].key] = [EDICDHStackData[i].key, hourData[j].doc_count];
				
				if ( $.inArray(hourData[j].key, legendsArr) == -1 ) {
					mbsBarGraphOptions.colors.push(colorsArr[j]);
					$('#ediCdhStackLegends').append('<li>' +
												'<a href="javascript:void(0)">' +
													'<span style="background: '+ colorsArr[j] +'" class="box"></span>' +
													'<span class="lbl">'+ hourData[j].key +'</span>' +
												'</a>' +
											'</li>');
				}
				legendsArr.push(hourData[j].key);
			}
		}
		
		var idx = 0;
		$.each(obj, function(key, d) {
			newData.push({label: key, data: []});
			for ( var k=0; k<24; k++ ) {
				if ( typeof d[k] === 'undefined' ) {
					newData[idx].data.push([k, 0]);
				} else {
					newData[idx].data.push(d[k]);
				}
				hourKey.push([k, k]);
			}
			idx++;
		});
		
		EDICDHStackData = newData;
		mbsBarGraphOptions.xaxis.ticks = hourKey;
		var barChart = $.plot($("#ediCdhBarChartContainer"), EDICDHStackData, mbsBarGraphOptions);
		_this.warningIfNoData(barChart, 'bar');
		
		$("#ediCdhBarChartContainer").bind("plothover", function (event, pos, item) {
			if ( item ) {
				/*var content = "<div class='popover-content text-center'>";
				content += "<p style='margin:5px 0;'>" + item.series.label + ": " + (item.datapoint[1] - item.datapoint[2]) + "</p>";
				content += "</div>";
		
				_this.showTooltip(item.pageX, item.pageY, content);*/
			} else {
				$('#graphTooltip').remove();
			}
		});
	};

	_this.createEDICDHGroupBarChart = function(days) {
		var newData = [];
		var hourKey = [];
		$('#ediCdhGroupLegends').empty();
		var obj = {};
		for ( var i=0; i<EDICDHGroupData.length; i++ ) {
			var entities = EDICDHGroupData[i].group_by_Entity.buckets;
			var index = EDICDHGroupData[i].key;
			for ( var j=0; j<entities.length; j++ ) {
				var label = entities[j].key;
				var count = entities[j].doc_count;
				if ( typeof obj[label] === 'undefined' ) {
					obj[label] = {
						label: label,
						data: []
					};
				}
				
				obj[label].data[index] = [index, count];
			}
		}
		
		days++;
		var counter=0;
		$.each(obj, function(k, d) {
			for ( var j=0; j<days; j++ ) {
				if ( typeof d.data[j] === 'undefined' ) {
					d.data[j] = [j, 0];
				}
				hourKey.push([j, j]);
			}
			newData.push(d);
			
			groupBarGraphOptions.colors.push(colorsArr[counter]);
			$('#ediCdhGroupLegends').append('<li>' +
										'<a href="javascript:void(0)">' +
											'<span style="background: '+ colorsArr[counter] +'" class="box"></span>' +
											'<span class="lbl">'+ k +'</span>' +
										'</a>' +
									'</li>');
			
			counter++;
		});
		
		EDICDHGroupData = newData;
		groupBarGraphOptions.xaxis.ticks = hourKey;
		var barChart = $.plot($("#ediCdhGroupBarChartContainer"), EDICDHGroupData, groupBarGraphOptions);
		_this.warningIfNoData(barChart, 'bar');
		
		$("#ediCdhGroupBarChartContainer").bind("plothover", function (event, pos, item) {
			if ( item ) {
				/*var content = "<div class='popover-content text-center'>";
				content += "<p style='margin:5px 0;'>" + item.series.label + ": " + (item.datapoint[1] - item.datapoint[2]) + "</p>";
				content += "</div>";
		
				_this.showTooltip(item.pageX, item.pageY, content);*/
			} else {
				$('#graphTooltip').remove();
			}
		});
	};

	_this.updateEdiCdhEntityPieChart = function() {
		var newPieData = $.extend(true, [], ediCdhEntityData);
		var newPieOpts = $.extend(true, {}, entityPieChartOptins);
		
		var pieActLegends = [];
		newPieOpts.colors = [];
		$('#ediCdhEntityTypePieLegends li').each(function(i, elm) {
			var isInactive = $(elm).hasClass('inactive');
			if ( !isInactive ) {
				var lbl = $(elm).find('.lbl').text();
				var clr = entityPieChartOptins.colors[i];
				pieActLegends.push(lbl);
				newPieOpts.colors.push(clr);
			}
		});
		
		newPieData = $.grep(newPieData, function(o) {
			return $.inArray(o.label, pieActLegends) > -1;
		});
		
		if ( newPieData.length == 0 ) {
			newPieData = [{}];
		}
		
		var pieChart = $.plot('#ediCdhEntityTypePieChart', newPieData, newPieOpts);
		_this.warningIfNoData(pieChart, 'pie');
	};

	_this.updateEdiCdhEventPieChart = function() {
		var newPieData = $.extend(true, [], ediCdhEventData);
		var newPieOpts = $.extend(true, {}, eventPieChartOptins);
		
		var pieActLegends = [];
		newPieOpts.colors = [];
		$('#ediCdhEventTypePieLegends li').each(function(i, elm) {
			var isInactive = $(elm).hasClass('inactive');
			if ( !isInactive ) {
				var lbl = $(elm).find('.lbl').text();
				var clr = eventPieChartOptins.colors[i];
				pieActLegends.push(lbl);
				newPieOpts.colors.push(clr);
			}
		});
		
		newPieData = $.grep(newPieData, function(o) {
			return $.inArray(o.label, pieActLegends) > -1;
		});
		
		if ( newPieData.length == 0 ) {
			newPieData = [{}];
		}
		
		var pieChart = $.plot('#ediCdhEventTypePieChart', newPieData, newPieOpts);
		_this.warningIfNoData(pieChart, 'pie');
	};

	_this.updateEdiCdhStackBarChart = function() {
		var newStackData = $.extend(true, [], EDICDHStackData);
		var newBarOpts = $.extend(true, {}, mbsBarGraphOptions);
		
		var barLegends = [];
		newBarOpts.colors = [];
		$('#ediCdhStackLegends li').each(function(i, elm) {
			var isInactive = $(elm).hasClass('inactive');
			if ( !isInactive ) {
				var lbl = $(elm).find('.lbl').text();
				var clr = mbsBarGraphOptions.colors[i];
				barLegends.push(lbl);
				newBarOpts.colors.push(clr);
			}
		});
		
		newStackData = $.grep(newStackData, function(o) {
			return $.inArray(o.label, barLegends) > -1;
		});
		
		/*if ( newStackData.length == 0 ) {
			newStackData = [{}];
		}*/
		
		var barChart = $.plot('#ediCdhBarChartContainer', newStackData, newBarOpts);
		_this.warningIfNoData(barChart, 'bar');
	};

	_this.updateEdiCdhGroupBarChart = function() {
		var newData = $.extend(true, [], EDICDHGroupData);
		var newBarOpts = $.extend(true, {}, groupBarGraphOptions);
		
		var barLegends = [];
		newBarOpts.colors = [];
		$('#ediCdhGroupLegends li').each(function(i, elm) {
			var isInactive = $(elm).hasClass('inactive');
			if ( !isInactive ) {
				var lbl = $(elm).find('.lbl').text();
				var clr = groupBarGraphOptions.colors[i];
				barLegends.push(lbl);
				newBarOpts.colors.push(clr);
			}
		});
		
		newData = $.grep(newData, function(o) {
			return $.inArray(o.label, barLegends) > -1;
		});
		
		var barChart = $.plot('#ediCdhGroupBarChartContainer', newData, newBarOpts);
		_this.warningIfNoData(barChart, 'bar');
	};

	_this.createEdiCdhSLineChart = function() {
		var lineChartHolder = $("#ediCdhRTLineChart");
		lineChartHolder.height(230).empty();
		
		var entity = $('#ediCdhRTLineLegends li:not(.inactive) .lbl').text();
		var data = (ediCmhLineData[entity]) ? ediCmhLineData[entity] : [{}];
		var str = JSON.stringify(ediCmhLineData[entity]);
		var EDICMHRTLineChart = $.plot(lineChartHolder, data, ediCmhLineChartOpts);
		_this.warningIfNoData(EDICMHRTLineChart, 'line');
	};

	_this.updateEDICMHLineData = function(d, index) {
		var timestamp = _this.getCurrentTime();
		if ( $.isArray(d) && d.length > 0 ) {
			
			for ( var i=0; i<d.length; i++ ) {
				var entity = d[i].MessageSubtype;
				ediCmhLineData[entity][index].data.push([timestamp, d[i].sumManifestTotalRecordCount]);
			}
		} else if ( !$.isEmptyObject(d) ) {
			var entity = d.MessageSubtype;
			ediCmhLineData[entity][index].data.push([timestamp, d.sumManifestTotalRecordCount]);
		}
		var str = JSON.stringify(ediCmhLineData);
		
		_this.updateEDICMHLineChart();
	};

	_this.updateEDICMHLineChart = function() {

		var lineChartHolder = $("#ediCdhRTLineChart");
		var entity = $('#ediCdhRTLineLegends li:not(.inactive) .lbl').text();
		var data = ediCmhLineData[entity];
		var EDICMHRTLineChart = $.plot(lineChartHolder, data, ediCmhLineChartOpts);
		_this.warningIfNoData(EDICMHRTLineChart, 'line');
	};
	
	window.onload = function() {
		_this.init();
		fannieMaeBizApp.init();
	};
};
