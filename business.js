/*
 * Class
 * Fannie Mae Demo
 * Date - 2016-01-08
 * 
 */

var alertsConfig = {
	"PoolCountDelta_Pool": [1, 'MBS Pool Difference'],
	"LoanCountDelta_Pool": [1, 'MBS Loan Difference'],
	"LoanCountDelta_Loan": [1, 'Cash Loan Difference'],
	"UPBAmountDelta_Pool": [1, 'MBS Loan UPB Amount Difference'],
	"UPBAmountDelta_Loan": [1, 'Cash Loan UPB Amount Difference'],
	"LoanCountDelta_Cash_LDNG": [1, 'Cash Loan Difference']
};

var bizEDIInterfaceData = {keys: [], data: [{"label": "ADS", "data": [], "total": [], "diff": []}, {"label": "EDI", "data": [], "total": [], "diff": []}]};
var bizEDIEntityMBSCountData = {keys: [], data: [{"label": "ADS Loan Count", "data": [], "total": [], "diff": []}, {"label": "EDI Loan Count", "data": [], "total": [], "diff": []}, {"label": "ADS Pool Count", "data": [], "total": [], "diff": []}, {"label": "EDI Pool Count", "data": [], "total": [], "diff": []}]};
var bizEDIEntityMBSAmountData = {keys: [], data: [{"label": "ADS MBS UPB Amount", "data": [], "total": [], "diff": []}, {"label": "EDI MBS UPB Amount", "data": [], "total": [], "diff": []}]};
var bizEDIEntityCashCountData = {keys: [], data: [{"label": "ADS Cash Count", "data": [], "total": [], "diff": []}, {"label": "EDI Cash Count", "data": [], "total": [], "diff": []}]};
var bizEDIEntityCashAmountData = {keys: [], data: [{"label": "ADS Cash UPB Amount", "data": [], "total": [], "diff": []}, {"label": "EDI Cash UPB Amount", "data": [], "total": [], "diff": []}]};

var bizLDNGInterfaceData = {keys: [], data: [{"label": "ADS", "data": [], "total": [], "diff": []}, {"label": "LDNG", "data": [], "total": [], "diff": []}]};
var bizLDNGEntityMBSCountData = {keys: [], data: [{"label": "ADS Loan Count", "data": [], "total": [], "diff": []}, {"label": "LDNG Loan Count", "data": [], "total": [], "diff": []}]};
var bizLDNGEntityMBSAmountData = {keys: [], data: [{"label": "ADS MBS UPB Amount", "data": [], "total": [], "diff": []}, {"label": "LDNG MBS UPB Amount", "data": [], "total": [], "diff": []}]};
var bizLDNGEntityCashCountData = {keys: [], data: [{"label": "ADS Cash Count", "data": [], "total": [], "diff": []}, {"label": "LDNG Cash Count", "data": [], "total": [], "diff": []}]};
var bizLDNGEntityCashAmountData = {keys: [], data: [{"label": "ADS Cash UPB Amount", "data": [], "total": [], "diff": []}, {"label": "LDNG Cash UPB Amount", "data": [], "total": [], "diff": []}]};

var bizEDIBarOptions = $.extend(true, {}, groupBarGraphOptions);
bizEDIBarOptions.colors = ["#93e0f8","#7a53a3","#de8ff6","#da4f12"];
bizEDIBarOptions.yaxis = { min: 0 };
bizEDIBarOptions.xaxis = {
	mode: "time",
	timezone: 'browser',
	tickSize: [3, "day"]
};
bizEDIBarOptions.bars = {
		align: "center",
		horizontal: false,
		barWidth: 7 * 60 * 60 * 600
	};

var fannieMaeBizApp = new function() {
	var _this = this;
	
	_this.init = function() {
		$('#page2Tabs a').on('click', function() {
			var isActive = $(this).closest('li').hasClass('active');
			if ( !isActive ) {
				curPage.business = $(this).closest('li').data('page');
				setTimeout(function() {				
					_this.getBizStackData();
				}, 300);
				
				$('ul.legends > li.inactive').removeClass('inactive');
			}
		});
		
		$('#bizADSSubmitBtn').on('click', function() {
			var value = $('#bizADSFromDatetimepicker input').val();
			if ( value != '' ) {
				_this.bizDataRefresh();
			}
		});
		
		$('#bizMBSSubmitBtn').on('click', function() {
			var value = $('#bizMBSFromDatetimepicker input').val();
			if ( value != '' ) {
				_this.bizDataRefresh();
			}
		});
		
		$('#bizEDIInterfaceLegends a').on('click', function() {
			$(this).parent().toggleClass('inactive');
			_this.updateBizStackGraph("#bizEDIInterfaceGraph", "#bizEDIInterfaceLegends", bizEDIInterfaceData, bizEDIBarOptions);
		});
		
		$('#bizEDIEntityMBSCountLegends a').on('click', function() {
			$(this).parent().toggleClass('inactive');
			_this.updateBizStackGraph("#bizEDIEntityMBSCountGraph", "#bizEDIEntityMBSCountLegends", bizEDIEntityMBSCountData, bizEDIBarOptions);
		});
		
		$('#bizEDIEntityMBSAmountLegends a').on('click', function() {
			$(this).parent().toggleClass('inactive');
			_this.updateBizStackGraph("#bizEDIEntityMBSAmountGraph", "#bizEDIEntityMBSAmountLegends", bizEDIEntityMBSAmountData, bizEDIBarOptions);
		});
		
		$('#bizEDIEntityCashCountLegends a').on('click', function() {
			$(this).parent().toggleClass('inactive');
			_this.updateBizStackGraph("#bizEDIEntityCashCountGraph", "#bizEDIEntityCashCountLegends", bizEDIEntityCashCountData, bizEDIBarOptions);
		});
		
		$('#bizEDIEntityCashAmountLegends a').on('click', function() {
			$(this).parent().toggleClass('inactive');
			_this.updateBizStackGraph("#bizEDIEntityCashAmountGraph", "#bizEDIEntityCashAmountLegends", bizEDIEntityCashAmountData, bizEDIBarOptions);
		});
		
		$('#bizLDNGInterfaceLegends a').on('click', function() {
			$(this).parent().toggleClass('inactive');
			_this.updateBizStackGraph("#bizLDNGInterfaceGraph", "#bizLDNGInterfaceLegends", bizLDNGInterfaceData, bizEDIBarOptions);
		});
		
		$('#bizLDNGEntityMBSCountLegends a').on('click', function() {
			$(this).parent().toggleClass('inactive');
			_this.updateBizStackGraph("#bizLDNGEntityMBSCountGraph", "#bizLDNGEntityMBSCountLegends", bizLDNGEntityMBSCountData, bizEDIBarOptions);
		});
		
		$('#bizLDNGEntityMBSAmountLegends a').on('click', function() {
			$(this).parent().toggleClass('inactive');
			_this.updateBizStackGraph("#bizLDNGEntityMBSAmountGraph", "#bizLDNGEntityMBSAmountLegends", bizLDNGEntityMBSAmountData, bizEDIBarOptions);
		});
		
		$('#bizLDNGEntityCashCountLegends a').on('click', function() {
			$(this).parent().toggleClass('inactive');
			_this.updateBizStackGraph("#bizLDNGEntityCashCountGraph", "#bizLDNGEntityCashCountLegends", bizLDNGEntityCashCountData, bizEDIBarOptions);
		});
		
		$('#bizLDNGEntityCashAmountLegends a').on('click', function() {
			$(this).parent().toggleClass('inactive');
			_this.updateBizStackGraph("#bizLDNGEntityCashAmountGraph", "#bizLDNGEntityCashAmountLegends", bizLDNGEntityCashAmountData, bizEDIBarOptions);
		});
		
		_this.getAlertData('ADS');
		_this.getAlertData('LDNG');
	};
	
	/** BAR CHARTS START **/
	_this.getBizStackData = function(entity) {
		var start, end, sel_date;
		var from = '', url = '';
		
		if ( curPage.business == 'ads' ) {
			url = urlObj.bizAds;
			from = $("#bizADSFromDatetimepicker input[type='text']").val();
		} else {
			url = urlObj.bizMbs;
			from = $("#bizMBSFromDatetimepicker input[type='text']").val();
		}
		
		if ( from == '' ) {
			sel_date = new Date();
		} else {
			sel_date = new Date(from);
		}

		sel_date.setDate(sel_date.getDate() - 6);
		start = sel_date.setHours(0, 0, 0, 0);
		end = sel_date.setHours(6*24+23, 59, 59, 999);
		
		var startDtObj = new Date(start);
		var startY = startDtObj.getFullYear();
		var startM = startDtObj.getMonth()+1;
		var startD = startDtObj.getDate();
		start = startY.toString() + ('0'+startM).slice(-2).toString() + ('0'+startD).slice(-2).toString();
		
		var endDtObj = new Date(end);
		var endY = endDtObj.getFullYear();
		var endM = endDtObj.getMonth()+1;
		var endD = endDtObj.getDate();
		end = endY.toString() + ('0'+endM).slice(-2).toString() + ('0'+endD).slice(-2).toString();
		
		var query = {
					"query": {
						"bool": {
							"must": [
								{
									"range": {
										"ReconTimestamp": {
											"gte": start, 
											"lte": end
										}
									}
								}
							], 
							"must_not": [ ], 
							"should": [ ]
						}
					}, 
					"from": 0, 
					"size": 10, 
					"sort": [ ], 
					"aggs": { }
				}

		jQuery.ajax({
			type: "POST",
			url: url,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(query),
			success: function (data) {
				data = (data.hits.hits.length > 0) ? data.hits.hits : [];
				_this.updateBizStackData(data, startDtObj, endDtObj);
			},
			error: function () {

			}
		});
	};
	
	_this.updateBizStackData = function(data, start, end) {
		if ( curPage.business == 'ads' ) {
			bizEDIInterfaceData = {keys: [], data: [{"label": "ADS", "data": [], "total": [], "diff": []}, {"label": "EDI", "data": [], "total": [], "diff": []}]};
			bizEDIEntityMBSCountData = {keys: [], data: [{"label": "ADS Loan Count", "data": [], "total": [], "diff": []}, {"label": "EDI Loan Count", "data": [], "total": [], "diff": []}, {"label": "ADS Pool Count", "data": [], "total": [], "diff": []}, {"label": "EDI Pool Count", "data": [], "total": [], "diff": []}]};
			bizEDIEntityMBSAmountData = {keys: [], data: [{"label": "ADS MBS UPB Amount", "data": [], "total": [], "diff": []}, {"label": "EDI MBS UPB Amount", "data": [], "total": [], "diff": []}]};
			bizEDIEntityCashCountData = {keys: [], data: [{"label": "ADS Cash Count", "data": [], "total": [], "diff": []}, {"label": "EDI Cash Count", "data": [], "total": [], "diff": []}]};
			bizEDIEntityCashAmountData = {keys: [], data: [{"label": "ADS Cash UPB Amount", "data": [], "total": [], "diff": []}, {"label": "EDI Cash UPB Amount", "data": [], "total": [], "diff": []}]};
			
			for ( var i=0; i<data.length; i++ ) {
				var d = data[i]._source;
				var t = d.ReconTimestamp;
				var time = t.substr(0, 4) + '/' + t.substr(4, 2) + '/' + t.substr(6, 2);
				time = new Date(time).valueOf();
				
				bizEDIInterfaceData.keys.push(time);
				bizEDIInterfaceData.data[0].diff.push(((d.MBSLoanCount_ADS + d.MBSPoolCount_ADS) - (d.MBSLoanCount_EDI + d.MBSPoolCount_EDI)).toFixed(1));
				bizEDIInterfaceData.data[0].data.push([time, (d.MBSLoanCount_ADS + d.MBSPoolCount_ADS)]);
				bizEDIInterfaceData.data[1].diff.push(((d.MBSLoanCount_ADS + d.MBSPoolCount_ADS) - (d.MBSLoanCount_EDI + d.MBSPoolCount_EDI)).toFixed(1));
				bizEDIInterfaceData.data[1].data.push([time, (d.MBSLoanCount_EDI + d.MBSPoolCount_EDI)]);
				
				bizEDIEntityMBSCountData.keys.push(time);
				bizEDIEntityMBSCountData.data[0].diff.push((d.MBSLoanCount_ADS - d.MBSLoanCount_EDI).toFixed(1));
				bizEDIEntityMBSCountData.data[0].data.push([time, d.MBSLoanCount_ADS]);
				bizEDIEntityMBSCountData.data[1].diff.push((d.MBSLoanCount_ADS - d.MBSLoanCount_EDI).toFixed(1));
				bizEDIEntityMBSCountData.data[1].data.push([time, d.MBSLoanCount_EDI]);
				
				bizEDIEntityMBSCountData.data[2].diff.push((d.MBSPoolCount_ADS - d.MBSPoolCount_EDI).toFixed(1));
				bizEDIEntityMBSCountData.data[2].data.push([time, d.MBSPoolCount_ADS]);
				bizEDIEntityMBSCountData.data[3].diff.push((d.MBSPoolCount_ADS - d.MBSPoolCount_EDI).toFixed(1));
				bizEDIEntityMBSCountData.data[3].data.push([time, d.MBSPoolCount_EDI]);
				
				bizEDIEntityMBSAmountData.keys.push(time);
				bizEDIEntityMBSAmountData.data[0].diff.push((d.MBSLoanUPBAmount_ADS - d.MBSLoanUPBAmount_EDI).toFixed(1));
				bizEDIEntityMBSAmountData.data[0].data.push([time, d.MBSLoanUPBAmount_ADS]);
				bizEDIEntityMBSAmountData.data[1].diff.push((d.MBSLoanUPBAmount_ADS - d.MBSLoanUPBAmount_EDI).toFixed(1));
				bizEDIEntityMBSAmountData.data[1].data.push([time, d.MBSLoanUPBAmount_EDI]);
				
				bizEDIEntityCashCountData.keys.push(time);
				bizEDIEntityCashCountData.data[0].diff.push((d.CashLoanCount_ADS - d.CashLoanCount_EDI).toFixed(1));
				bizEDIEntityCashCountData.data[0].data.push([time, d.CashLoanCount_ADS]);
				bizEDIEntityCashCountData.data[1].diff.push((d.CashLoanCount_ADS - d.CashLoanCount_EDI).toFixed(1));
				bizEDIEntityCashCountData.data[1].data.push([time, d.CashLoanCount_EDI]);
				
				bizEDIEntityCashAmountData.keys.push(time);
				bizEDIEntityCashAmountData.data[0].diff.push((d.CashLoanUPBAmount_ADS - d.CashLoanUPBAmount_EDI).toFixed(1));
				bizEDIEntityCashAmountData.data[0].data.push([time, d.CashLoanUPBAmount_ADS]);
				bizEDIEntityCashAmountData.data[1].diff.push((d.CashLoanUPBAmount_ADS - d.CashLoanUPBAmount_EDI).toFixed(1));
				bizEDIEntityCashAmountData.data[1].data.push([time, d.CashLoanUPBAmount_EDI]);
			}
			
			for ( var dt = start; dt <= end; dt.setDate(dt.getDate() + 1) ) {
				var time = dt.valueOf();
				
				if ( $.inArray(time, bizEDIInterfaceData.keys) == -1 ) {
					bizEDIInterfaceData.keys.push(time);
					bizEDIInterfaceData.data[0].diff.push(0);
					bizEDIInterfaceData.data[0].data.push([time, 0]);
					bizEDIInterfaceData.data[1].diff.push(0);
					bizEDIInterfaceData.data[1].data.push([time, 0]);
				}
				
				if ( $.inArray(time, bizEDIEntityMBSCountData.keys) == -1 ) {
					bizEDIEntityMBSCountData.keys.push(time);
					bizEDIEntityMBSCountData.data[0].diff.push(0);
					bizEDIEntityMBSCountData.data[0].data.push([time, 0]);
					bizEDIEntityMBSCountData.data[1].diff.push(0);
					bizEDIEntityMBSCountData.data[1].data.push([time, 0]);
					bizEDIEntityMBSCountData.data[2].diff.push(0);
					bizEDIEntityMBSCountData.data[2].data.push([time, 0]);
					bizEDIEntityMBSCountData.data[3].diff.push(0);
					bizEDIEntityMBSCountData.data[3].data.push([time, 0]);
				}
				
				if ( $.inArray(time, bizEDIEntityMBSAmountData.keys) == -1 ) {
					bizEDIEntityMBSAmountData.keys.push(time);
					bizEDIEntityMBSAmountData.data[0].diff.push(0);
					bizEDIEntityMBSAmountData.data[0].data.push([time, 0]);
					bizEDIEntityMBSAmountData.data[1].diff.push(0);
					bizEDIEntityMBSAmountData.data[1].data.push([time, 0]);
				}
				
				if ( $.inArray(time, bizEDIEntityCashCountData.keys) == -1 ) {
					bizEDIEntityCashCountData.keys.push(time);
					bizEDIEntityCashCountData.data[0].diff.push(0);
					bizEDIEntityCashCountData.data[0].data.push([time, 0]);
					bizEDIEntityCashCountData.data[1].diff.push(0);
					bizEDIEntityCashCountData.data[1].data.push([time, 0]);
				}
				
				if ( $.inArray(time, bizEDIEntityCashAmountData.keys) == -1 ) {
					bizEDIEntityCashAmountData.keys.push(time);
					bizEDIEntityCashAmountData.data[0].diff.push(0);
					bizEDIEntityCashAmountData.data[0].data.push([time, 0]);
					bizEDIEntityCashAmountData.data[1].diff.push(0);
					bizEDIEntityCashAmountData.data[1].data.push([time, 0]);
				}
			}
			
			_this.createBizStackGraph("#bizEDIInterfaceGraph", bizEDIInterfaceData, bizEDIBarOptions);
			_this.createBizStackGraph("#bizEDIEntityMBSCountGraph", bizEDIEntityMBSCountData, bizEDIBarOptions);
			_this.createBizStackGraph("#bizEDIEntityMBSAmountGraph", bizEDIEntityMBSAmountData, bizEDIBarOptions);
			_this.createBizStackGraph("#bizEDIEntityCashCountGraph", bizEDIEntityCashCountData, bizEDIBarOptions);
			_this.createBizStackGraph("#bizEDIEntityCashAmountGraph", bizEDIEntityCashAmountData, bizEDIBarOptions);
		} else {
			bizLDNGInterfaceData = {keys: [], data: [{"label": "ADS", "data": [], "total": [], "diff": []}, {"label": "LDNG", "data": [], "total": [], "diff": []}]};
			bizLDNGEntityMBSCountData = {keys: [], data: [{"label": "ADS Loan Count", "data": [], "total": [], "diff": []}, {"label": "LDNG Loan Count", "data": [], "total": [], "diff": []}]};
			bizLDNGEntityMBSAmountData = {keys: [], data: [{"label": "ADS MBS UPB Amount", "data": [], "total": [], "diff": []}, {"label": "LDNG MBS UPB Amount", "data": [], "total": [], "diff": []}]};
			bizLDNGEntityCashCountData = {keys: [], data: [{"label": "ADS Cash Count", "data": [], "total": [], "diff": []}, {"label": "LDNG Cash Count", "data": [], "total": [], "diff": []}]};
			bizLDNGEntityCashAmountData = {keys: [], data: [{"label": "ADS Cash UPB Amount", "data": [], "total": [], "diff": []}, {"label": "LDNG Cash UPB Amount", "data": [], "total": [], "diff": []}]};
			
			for ( var i=0; i<data.length; i++ ) {
				var d = data[i]._source;
				var t = d.ReconTimestamp;
				var time = t.substr(0, 4) + '/' + t.substr(4, 2) + '/' + t.substr(6, 2);
				time = new Date(time).valueOf();
				
				bizLDNGInterfaceData.keys.push(time);
				bizLDNGInterfaceData.data[0].diff.push(((d.MBSLoanCount_LDNG2ADS + d.CashLoanCount_LDNG2ADS) - (d.MBSLoanCount_LDNG + d.CashLoanCount_LDNG)).toFixed(1));
				bizLDNGInterfaceData.data[0].data.push([time, (d.MBSLoanCount_LDNG2ADS + d.CashLoanCount_LDNG2ADS)]);
				bizLDNGInterfaceData.data[1].diff.push(((d.MBSLoanCount_LDNG2ADS + d.CashLoanCount_LDNG2ADS) - (d.MBSLoanCount_LDNG + d.CashLoanCount_LDNG)).toFixed(1));
				bizLDNGInterfaceData.data[1].data.push([time, (d.MBSLoanCount_LDNG + d.CashLoanCount_LDNG)]);
				
				bizLDNGEntityMBSCountData.keys.push(time);
				bizLDNGEntityMBSCountData.data[0].diff.push((d.MBSLoanCount_LDNG2ADS - d.MBSLoanCount_LDNG).toFixed(1));
				bizLDNGEntityMBSCountData.data[0].data.push([time, d.MBSLoanCount_LDNG2ADS]);
				bizLDNGEntityMBSCountData.data[1].diff.push((d.MBSLoanCount_LDNG2ADS - d.MBSLoanCount_LDNG).toFixed(1));
				bizLDNGEntityMBSCountData.data[1].data.push([time, d.MBSLoanCount_LDNG]);
				
				bizLDNGEntityMBSAmountData.keys.push(time);
				bizLDNGEntityMBSAmountData.data[0].diff.push((d.MBSLoanUPBAmount_LDNG2ADS - d.MBSLoanUPBAmount_LDNG).toFixed(1));
				bizLDNGEntityMBSAmountData.data[0].data.push([time, d.MBSLoanUPBAmount_LDNG2ADS]);
				bizLDNGEntityMBSAmountData.data[1].diff.push((d.MBSLoanUPBAmount_LDNG2ADS - d.MBSLoanUPBAmount_LDNG).toFixed(1));
				bizLDNGEntityMBSAmountData.data[1].data.push([time, d.MBSLoanUPBAmount_LDNG]);
				
				bizLDNGEntityCashCountData.keys.push(time);
				bizLDNGEntityCashCountData.data[0].diff.push((d.CashLoanCount_LDNG2ADS - d.CashLoanCount_LDNG).toFixed(1));
				bizLDNGEntityCashCountData.data[0].data.push([time, d.CashLoanCount_LDNG2ADS]);
				bizLDNGEntityCashCountData.data[1].diff.push((d.CashLoanCount_LDNG2ADS - d.CashLoanCount_LDNG).toFixed(1));
				bizLDNGEntityCashCountData.data[1].data.push([time, d.CashLoanCount_LDNG]);
				
				bizLDNGEntityCashAmountData.keys.push(time);
				bizLDNGEntityCashAmountData.data[0].diff.push((d.CashLoanUPBAmount_LDNG2ADS - d.CashLoanUPBAmount_LDNG).toFixed(1));
				bizLDNGEntityCashAmountData.data[0].data.push([time, d.CashLoanUPBAmount_LDNG2ADS]);
				bizLDNGEntityCashAmountData.data[1].diff.push((d.CashLoanUPBAmount_LDNG2ADS - d.CashLoanUPBAmount_LDNG).toFixed(1));
				bizLDNGEntityCashAmountData.data[1].data.push([time, d.CashLoanUPBAmount_LDNG]);
			}
			
			for ( var dt = start; dt <= end; dt.setDate(dt.getDate() + 1) ) {
				var time = dt.valueOf();
				
				if ( $.inArray(time, bizLDNGInterfaceData.keys) == -1 ) {
					bizLDNGInterfaceData.keys.push(time);
					bizLDNGInterfaceData.data[0].diff.push(0);
					bizLDNGInterfaceData.data[0].data.push([time, 0]);
					bizLDNGInterfaceData.data[1].diff.push(0);
					bizLDNGInterfaceData.data[1].data.push([time, 0]);
				}
				
				if ( $.inArray(time, bizLDNGEntityMBSCountData.keys) == -1 ) {
					bizLDNGEntityMBSCountData.keys.push(time);
					bizLDNGEntityMBSCountData.data[0].diff.push(0);
					bizLDNGEntityMBSCountData.data[0].data.push([time, 0]);
					bizLDNGEntityMBSCountData.data[1].diff.push(0);
					bizLDNGEntityMBSCountData.data[1].data.push([time, 0]);
				}
				
				if ( $.inArray(time, bizLDNGEntityMBSAmountData.keys) == -1 ) {
					bizLDNGEntityMBSAmountData.keys.push(time);
					bizLDNGEntityMBSAmountData.data[0].diff.push(0);
					bizLDNGEntityMBSAmountData.data[0].data.push([time, 0]);
					bizLDNGEntityMBSAmountData.data[1].diff.push(0);
					bizLDNGEntityMBSAmountData.data[1].data.push([time, 0]);
				}
				
				if ( $.inArray(time, bizLDNGEntityCashCountData.keys) == -1 ) {
					bizLDNGEntityCashCountData.keys.push(time);
					bizLDNGEntityCashCountData.data[0].diff.push(0);
					bizLDNGEntityCashCountData.data[0].data.push([time, 0]);
					bizLDNGEntityCashCountData.data[1].diff.push(0);
					bizLDNGEntityCashCountData.data[1].data.push([time, 0]);
				}
				
				if ( $.inArray(time, bizLDNGEntityCashAmountData.keys) == -1 ) {
					bizLDNGEntityCashAmountData.keys.push(time);
					bizLDNGEntityCashAmountData.data[0].diff.push(0);
					bizLDNGEntityCashAmountData.data[0].data.push([time, 0]);
					bizLDNGEntityCashAmountData.data[1].diff.push(0);
					bizLDNGEntityCashAmountData.data[1].data.push([time, 0]);
				}
			}
			
			_this.createBizStackGraph("#bizLDNGInterfaceGraph", bizLDNGInterfaceData, bizEDIBarOptions);
			_this.createBizStackGraph("#bizLDNGEntityMBSCountGraph", bizLDNGEntityMBSCountData, bizEDIBarOptions);
			_this.createBizStackGraph("#bizLDNGEntityMBSAmountGraph", bizLDNGEntityMBSAmountData, bizEDIBarOptions);
			_this.createBizStackGraph("#bizLDNGEntityCashCountGraph", bizLDNGEntityCashCountData, bizEDIBarOptions);
			_this.createBizStackGraph("#bizLDNGEntityCashAmountGraph", bizLDNGEntityCashAmountData, bizEDIBarOptions);
		}
	};
	
	/** BUSINESS STACK GRAPH **/
	_this.createBizStackGraph = function(placeholder, d, opts) {
		opts.xaxis.ticks = d.keys;
		var graph = $.plot($(placeholder), d.data, opts);
		fannieMaeApp.warningIfNoData(graph, 'bar');
		
		_this.showGraphLabels(graph, placeholder);
		
		$(placeholder).bind("plothover", function (event, pos, item) {
			/*if ( item && item.series.total.length > 0 ) {
				var label = item.series.label.replace('Difference', 'Total');
				var content = "<div class='popover-content text-center'>";
				content += "<p style='margin:5px 0;'>" + label + ": " + item.series.total[item.dataIndex] + "</p>";
				content += "</div>";
		
				fannieMaeApp.showTooltip(item.pageX, item.pageY, content);
			} else {
				$('#graphTooltip').remove();
			}*/
		});
	};
	
	_this.updateBizStackGraph = function(placeholder, legendsWrap, d, opts) {
		var newData = $.extend(true, [], d.data);
		var newOpts = $.extend(true, {}, opts);
		newOpts.colors = [];
		
		var actLegends = [];
		$(legendsWrap).find('li').each(function(i, elm) {
			var isInactive = $(elm).hasClass('inactive');
			if ( !isInactive ) {
				var lbl = $(elm).find('.lbl').text();
				var clr = opts.colors[i];
				actLegends.push(lbl);
				newOpts.colors.push(clr);
			}
		});
		
		newData = $.grep(newData, function(o) {
			return $.inArray(o.label, actLegends) > -1;
		});
		
		var graph = $.plot(placeholder, newData, newOpts);
		fannieMaeApp.warningIfNoData(graph, 'bar');
		
		_this.showGraphLabels(graph, placeholder);
	};
	
	_this.showGraphLabels = function(graph, placeholder) {
		var graphData = graph.getData();
		if ( placeholder == '#bizEDIEntityMBSCountGraph' ) {
			var offset = [[], []];
			
			if ( graphData[0] ) {
				$.each(graphData[0].data, function(i, el) {
					var o = graph.pointOffset({x: el[0], y: el[1]});
					offset[0][i] = {x: 0, y: 0, val: 0};
					offset[0][i].x = o.left;
					offset[0][i].y = o.top;
					offset[0][i].val = el[1];
				});
			}
			
			if ( graphData[1] ) {
				$.each(graphData[1].data, function(i, el){
					var o = graph.pointOffset({x: el[0], y: el[1]});
					offset[0][i].y = Math.min(o.top, offset[0][i].y);
				});
			}
			
			var d = [];
			if ( graphData[0] ) {
				d = graphData[0].data;
			} else if ( graphData[1] ) {
				d = graphData[1].data;
			}
			
			$.each(d, function(i, el) {
				if ( offset[0][i].val > 0 ) {
					var diff = Math.abs(graphData[0].diff[i]);
					var label = (diff == 0) ? 'Match (0)' : 'No Match (' + diff + ')';
					$('<div class="data-point-label">'+ label +'</div>').css( {
						position: 'absolute',
						left: offset[0][i].x - 50,
						top: offset[0][i].y - 20,
						display: 'none',
						fontSize: '10px'
					}).appendTo(graph.getPlaceholder()).fadeIn('slow');
				}
			});
			
			if ( graphData[2] ) {
				$.each(graphData[2].data, function(i, el) {
					var o = graph.pointOffset({x: el[0], y: el[1]});
					offset[1][i] = {x: 0, y: 0};
					offset[1][i].x = o.left;
					offset[1][i].y = o.top;
					offset[1][i].val = el[1];
				});
			}
			
			if ( graphData[3] ) {
				$.each(graphData[3].data, function(i, el){
					var o = graph.pointOffset({x: el[0], y: el[1]});
					offset[1][i].y = Math.min(o.top, offset[1][i].y);
				});
			}
			
			var d = [];
			if ( graphData[2] ) {
				d = graphData[2].data;
			} else if ( graphData[3] ) {
				d = graphData[3].data;
			}
			
			$.each(d, function(i, el) {
				if ( offset[1][i].val > 0 ) {
					var diff = Math.abs(graphData[2].diff[i]);
					var label = (diff == 0) ? 'Match (0)' : 'No Match (' + diff + ')';
					var color = (diff == 0) ? '#333333' : '#ff0000';
					$('<div class="data-point-label">'+ label +'</div>').css( {
						position: 'absolute',
						left: offset[1][i].x - 7,
						top: offset[1][i].y - 20,
						display: 'none',
						fontSize: '10px',
						color: color
					}).appendTo(graph.getPlaceholder()).fadeIn('slow');
				}
			});
		} else {
			var offset = [];
			
			if ( graphData[0] ) {
				$.each(graphData[0].data, function(i, el) {
					var o = graph.pointOffset({x: el[0], y: el[1]});
					offset[i] = {x: 0, y: 0, val: 0};
					offset[i].x = o.left;
					offset[i].y = o.top;
					offset[i].val = el[1];
				});
			}
			
			if ( graphData[1] ) {
				$.each(graphData[1].data, function(i, el){
					var o = graph.pointOffset({x: el[0], y: el[1]});
					offset[i].y = Math.min(o.top, offset[i].y);
				});
			}
			
			var d = [];
			if ( graphData[0] ) {
				d = graphData[0].data;
			} else if ( graphData[1] ) {
				d = graphData[1].data;
			}
			
			$.each(d, function(i, el) {
				if ( offset[i].val > 0 ) {
					var diff = Math.abs(graphData[0].diff[i]);
					var label = (diff == 0) ? 'Match (0)' : 'No Match (' + diff + ')';
					var color = (diff == 0) ? '#333333' : '#ff0000';
					$('<div class="data-point-label">'+ label +'</div>').css( {
						position: 'absolute',
						left: offset[i].x - 30,
						top: offset[i].y - 20,
						display: 'none',
						fontSize: '10px',
						color: color
					}).appendTo(graph.getPlaceholder()).fadeIn('slow');
				}
			});
		}
	};
	
	/** ALERTS TABLE START **/
	_this.getAlertData = function(page) {
		var query = {
			"query": {"bool": {"must": [{"match_all": {}}], "must_not": [], "should": []}},
			"from": 0,
			"size": 10,
			"sort": [{"timetsamp": {"order": "desc", "mode": "avg"}}],
			"facets": {}
		};
		
		var url = '';
		if ( page == 'ADS' ) {
			url = urlObj.bizADSAlerts;
		} else {
			url = urlObj.bizLDNGAlerts;
		}
		
		jQuery.ajax({
			type: "POST",
			url: url,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(query),
			success: function (data) {
				_this.createAlertTable(data.hits.hits, page);
			},
			error: function () {

			}
		});
	};
	
	_this.createAlertTable = function(data, page) {
		if ( page == 'ADS' ) {
			$('#bizEDIAlertTable tbody').empty();
		} else {
			$('#bizLDNGAlertTable tbody').empty();
		}
		
		data.forEach(function (obj) {
			var trElem = '';
			var o = obj._source;
			
			var reconDateStr = o.ReconTimestamp.substr(0, 4) + '/' + o.ReconTimestamp.substr(4, 2) + '/' + o.ReconTimestamp.substr(6, 2);
			var reconDate = new Date(reconDateStr);
			reconDate = reconDate.toString();
			reconDate = reconDate.substr(0, 15);
			
			var date = new Date(o.timetsamp);
			var fields = [];
			
			$.each(alertsConfig, function(k, val) {
				if ( o[k] > val[0] ) {
					fields.push(val[1]);
				}
			});
			
			var desc = '-';
			if ( fields.length > 0 ) {
				desc = 'High threshold for ' + fields.join(', ');
			}
			
			trElem = trElem + '<tr>' +
				'<td>' + date + '</td>' +
				'<td>' + reconDate + '</td>' +
				'<td>' + desc + '</td>' +
				'</tr>';
			
			if ( page == 'ADS' ) {
				$('#bizEDIAlertTable tbody').append(trElem);
			} else {
				$('#bizLDNGAlertTable tbody').append(trElem);
			}
		});
	};
	/** ALERTS TABLE END **/
	
	_this.bizDataRefresh = function() {
		_this.getBizStackData();
	};
};
