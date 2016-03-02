// RabbitMQ WebSocket
var rmqSock = new function () {
    var _this = this;

    // Stomp connection url
    _this.connectionUrl= urlObj.stomp;

    // RabbitMQ data received from stomp
    _this.liveData = null;

    // RabbitMQ connection object
    _this.clientObj = null;

    _this.TwoMinDataQueue =  urlObj.adsPerMinuteQueue;
    _this.AllDataQueue = urlObj.adsTotalQueue;
	_this.MBSTwoMinDataQueue =  urlObj.mbsPerMinuteQueue;
    _this.MBSAllDataQueue = urlObj.mbsTotalQueue;
    _this.alertQueue = urlObj.alertsQueue;
    _this.bizADSAlertQueue = urlObj.bizADSAlertsQueue;
    _this.bizLDNGAlertQueue = urlObj.bizLDNGAlertsQueue;

    _this.ediCmhPerMinuteQueue = urlObj.ediCmhPerMinuteQueue;
    _this.ediCmhTotalQueue = urlObj.ediCmhTotalQueue;

	//_this.TwoMinDatExc = '/exchange/TwoMinData';
    //_this.AllDataExc = '/exchange/AllData1';
    //_this.alertExc = '/exchange/RT_ALERTS/5-realtimeAlerts';

    // Connection authentication parameters
    _this.mqUsername = urlObj.mqUsername;
    _this.mqPassword = urlObj.mqPassword;
    _this.mqVhost = urlObj.mqHost;


    /**
     @function: init()
     @params: null
     @returns: null
     @Details: invoke init method to get connection and data.
     **/
    _this.init = function () {
        _this.makeConnection();
    };


    /**
     @function: makeConnection()
     @params: url
     @returns: null
     @Details: get connection.
     **/
    _this.makeConnection = function () {
        var ws = new SockJS(_this.connectionUrl);
        _this.clientObj = Stomp.over(ws);
        //SockJS does not support heart-beat: disable heart-beats
        _this.clientObj.heartbeat.incoming = 0;
        _this.clientObj.heartbeat.outgoing = 0;
        //makes connection and generates/add alert on the page
        _this.clientObj.connect(_this.mqUsername, _this.mqPassword, _this.onConnect, _this.onError, _this.mqVhost);
    };


    /**
     @function: onConnect()
     @params: url
     @returns: null
     @Details: subscribe to exchange queue after connection and generates/add alerts.
     **/
    _this.onConnect = function () {
        _this.clientObj.subscribe(_this.TwoMinDataQueue, function (d) {
            if ((d.body != null) && (d.body != '') && (d.body != undefined)) {
                var data = JSON.parse(d.body);
				//[{"MessageSubtype": "POOL", "countPayLoaDCount": 1}, {"MessageSubtype": "LOAN", "countPayLoaDCount": 1}]
                fannieMaeApp.updateLineData(data, 1);
				//updateMBSLineData
            }
        });

        _this.clientObj.subscribe(_this.AllDataQueue, function (d) {
            if ((d.body != null) && (d.body != '') && (d.body != undefined)) {
                var data = JSON.parse(d.body);
                fannieMaeApp.updateLineData(data, 0);
            }
        });
		
		_this.clientObj.subscribe(_this.MBSTwoMinDataQueue, function (d) {
            if ((d.body != null) && (d.body != '') && (d.body != undefined)) {
                var data = JSON.parse(d.body);
				fannieMaeApp.updateMBSLineData(data, 1);
            }
        });

        _this.clientObj.subscribe(_this.MBSAllDataQueue, function (d) {
            if ((d.body != null) && (d.body != '') && (d.body != undefined)) {
                var data = JSON.parse(d.body);
                fannieMaeApp.updateMBSLineData(data, 0);
            }
        });

        _this.clientObj.subscribe(_this.alertQueue, function (d) {
            if ((d.body != null) && (d.body != '') && (d.body != undefined)) {
                var data = {message: d.body};

                setTimeout(function() {
					fannieMaeApp.getAlertData();
				}, 3000);
            }
        });

        _this.clientObj.subscribe(_this.bizADSAlertQueue, function (d) {
            if ((d.body != null) && (d.body != '') && (d.body != undefined)) {
                var data = {message: d.body};

                setTimeout(function() {
					fannieMaeBizApp.getAlertData('ADS');
				}, 3000);
            }
        });

        _this.clientObj.subscribe(_this.bizLDNGAlertQueue, function (d) {
            if ((d.body != null) && (d.body != '') && (d.body != undefined)) {
                var data = {message: d.body};

                setTimeout(function() {
					fannieMaeBizApp.getAlertData('LDNG');
				}, 3000);
            }
        });

        // -----
        _this.clientObj.subscribe(_this.ediCmhPerMinuteQueue, function (d) {
            if ((d.body != null) && (d.body != '') && (d.body != undefined)) {
                var data = JSON.parse(d.body);
                fannieMaeApp.updateEDICMHLineData(data, 1);
            }
        });

        _this.clientObj.subscribe(_this.ediCmhTotalQueue, function (d) {
            if ((d.body != null) && (d.body != '') && (d.body != undefined)) {
                var data = JSON.parse(d.body);
                fannieMaeApp.updateEDICMHLineData(data, 0);
            }
        });

    };

    /**
     @function: onError()
     @params: url
     @returns: null
     @Details: return message and reconnect to rabittmq until successful connection.
     **/
    _this.onError = function () {
        console.log('RabbitMq Stomp Connection Error!');
    }

    /**
     @function: onReceive()
     @params: null
     @returns: null
     @Details: function to track on receive action.
     **/
    _this.onReceive = function () {
        // default receive callback to get message from temporary queues
        _this.clientObj.onreceive = function (m) {
            console.log("body", m.body);
        }
    };
};

$(document).ready(function () {
    rmqSock.init();
});
