// Load the rounded tile control
jQuery.sap.require("com.scs.view.RoundedTile");
jQuery.sap.require("com.scs.model.settings");
jQuery.sap.require("com.scs.utils.utils");
jQuery.sap.require("sap.m.MessageToast");
sap.ui.controller("com.scs.view.Dashboard", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf com.scs.view.Dashboard
	 */
	onInit: function() {
		//			headers,url,successCallback,errorCallback,dataStr

		var ops = com.scs.model.settings.getOps();
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(ops);
		sap.ui.getCore().setModel(oModel, 'OPS');

	},
	addUser:function(){
		
		app.to("idAdduser");
	},
	headerDataToModel: function(headerData) {

	},
	uploadSchedule:function(){
		
		app.to("idUploadSchedule");
		
	},
	error: function(e) {

	},
	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf com.scs.view.Dashboard
	 */
	//	onBeforeRendering: function() {
	//
	//	},
	groups: function() {
		var call = {};
		var that = sap.ui.getCore().byId('idDashboard').getController();
		var queryStr = "SELECT * FROM `groups` WHERE user='admin'";
		call.url = com.scs.model.settings.getBaseUrl() + "/SCSAdmin/php/read.php";
		call.headers = {
			ContentType: "application/x-www-form-urlencoded"
		};
		call.successCallback = that.groupReadSuccessCallbackInit;
		call.errorCallback = that.errorCallback;
		call.method = "POST";
		call.dataStr = "query=" + queryStr;
		call.loadStr = "Loading Group Data";
		com.scs.utils.utils.dbcall(that, call);

		app.to("idGroupsMaster");

	},
	contacts: function() {
		//Load Group data
		var call = {};
		var that = sap.ui.getCore().byId('idDashboard').getController();
		var queryStr = "SELECT * FROM `groups` WHERE user='admin'";
		call.url = com.scs.model.settings.getBaseUrl() + "/SCSAdmin/php/read.php";
		call.headers = {
			ContentType: "application/x-www-form-urlencoded"
		};
		call.successCallback = that.groupReadSuccessCallbackInit;
		call.errorCallback = that.errorCallback;
		call.method = "POST";
		call.dataStr = "query=" + queryStr;
		call.loadStr = "Loading Group Data";
		com.scs.utils.utils.dbcall(that, call);

		app.to('idContacts', "slide");

	},
	goBack: function() {
		var that = sap.ui.getCore().byId('idDashboard').getController();
		com.scs.utils.utils.logout(that, that.logoutSuccess);

	},
	logoutSuccess: function() {
		app.back();
	},
	upload: function() {

		app.to("idUpload");
	},
	templates: function() {

		var call = {};
		var queryStr = "SELECT * FROM `templates`";
		var that = sap.ui.getCore().byId('idDashboard').getController();
		call.url = com.scs.model.settings.getBaseUrl() + "/SCSAdmin/php/read.php";
		call.headers = {
			ContentType: "application/x-www-form-urlencoded"
		};
		call.successCallback = that.templateReadSuccessCallbackInit;
		call.errorCallback = that.errorCallback;
		call.method = "POST";
		call.dataStr = "query=" + queryStr;
		call.loadStr = "Loading Template Data";

		com.scs.utils.utils.dbcall(that, call);

		splitApp.toMaster("idTemplatesMaster");
		// splitApp.toDetail("idEmpty");
		shell.setApp(splitApp);
	},
	inbox: function() {
		//Load Inbox Data
		var that = sap.ui.getCore().byId('idDashboard').getController()
		var call = {};
		call.url = com.scs.model.settings.getBaseUrl() + "/SCSAdmin/php/inbox.php";

		call.successCallback = that.inboxReadSuccessCallbackInit;
		call.errorCallback = that.errorCallback;
		call.method = "POST";
		call.loadStr = "Loading Inbox Data";
		com.scs.utils.utils.dbcall(that, call);
		

		app.to("idInbox");

	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf com.scs.view.Dashboard
	 */
	onAfterRendering: function() {
		//load contact metadata
		var call = {};
		/*
		call.url = com.scs.model.settings.getBaseUrl() + "/SCSAdmin/php/getheader.php";
		call.headers = {};
		call.successCallback = this.contactsSuccessCallback;
		call.errorCallback = this.error;
		call.loadStr = "Loading Contact Data"
		call.method = "GET";
		call.dataStr = "";
		com.scs.utils.utils.dbcall(this, call);*/

		//Load Template Data
		var contactheader="[{\"column_name\":\"id\",\"0\":\"id\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"external_id\",\"0\":\"external_id\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"name\",\"0\":\"name\",\"column_comment\":\"Name\",\"1\":\"Name\"},{\"column_name\":\"head_of_household\",\"0\":\"head_of_household\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"age\",\"0\":\"age\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"new\",\"0\":\"new\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"address\",\"0\":\"address\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"city\",\"0\":\"city\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"state\",\"0\":\"state\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"zip_code\",\"0\":\"zip_code\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"phone_home\",\"0\":\"phone_home\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"phone_mobile\",\"0\":\"phone_mobile\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"household_size\",\"0\":\"household_size\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"financial\",\"0\":\"financial\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"contact_date\",\"0\":\"contact_date\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"type_id\",\"0\":\"type_id\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"service_id\",\"0\":\"service_id\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"request\",\"0\":\"request\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"disposition_id\",\"0\":\"disposition_id\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"amount_requested\",\"0\":\"amount_requested\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"foodbank_pickup\",\"0\":\"foodbank_pickup\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"caseworker_id\",\"0\":\"caseworker_id\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"location_id\",\"0\":\"location_id\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"check_number\",\"0\":\"check_number\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"check_date\",\"0\":\"check_date\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"transport_id\",\"0\":\"transport_id\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"payee_id\",\"0\":\"payee_id\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"account_id\",\"0\":\"account_id\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"amount\",\"0\":\"amount\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"distribution\",\"0\":\"distribution\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"food_weight\",\"0\":\"food_weight\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"food_count\",\"0\":\"food_count\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"food_cost\",\"0\":\"food_cost\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"notes\",\"0\":\"notes\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"created_date\",\"0\":\"created_date\",\"column_comment\":\"\",\"1\":\"\"},{\"column_name\":\"contact_time\",\"0\":\"contact_time\",\"column_comment\":\"\",\"1\":\"\"}]";
		
		this.contactsSuccessCallback(contactheader,"success");
		call = {};
		queryStr = "SELECT * FROM `templates`";
		call.url = com.scs.model.settings.getBaseUrl() + "/SCSAdmin/php/read.php";
		call.headers = {
			ContentType: "application/x-www-form-urlencoded"
		};
		call.successCallback = this.templateReadSuccessCallbackInit;
		call.errorCallback = this.errorCallback;
		call.method = "POST";
		call.dataStr = "query=" + queryStr;
		call.loadStr = "Loading Template Data";
		com.scs.utils.utils.dbcall(this, call);

		

	},
	inboxReadSuccessCallbackInit: function(data) {
		if(data != null){
		if ((data.indexOf("Fatal error") >= 0) || (data.indexOf("Warning")>=0)|| (data.indexOf("Notice")>=0)) {
			sap.m.MessageToast.show("Inbox Items Load Failed");
		}else{
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(JSON.parse(data));
			sap.ui.getCore().setModel(oModel, 'IM');

		}
		}
	},

	templateReadSuccessCallbackInit: function(data) {
		if ((!data.indexOf("Fatal error") >= 0) && (data != null)) {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(JSON.parse(data));
			sap.ui.getCore().setModel(oModel, 'TM');

		}

	},
	groupReadSuccessCallbackInit: function(data) {
		if ((!data.indexOf("Fatal error") >= 0) && (data != null)) {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(JSON.parse(data));
			sap.ui.getCore().setModel(oModel, 'GM');
		}

	},
	contactsSuccessCallback: function(data, status) {
		if (status === "success") {

			var contactFields = JSON.parse(data);

			for (var i = 0; i < contactFields.length; i++) {
				var value = contactFields[i];
				if (value.column_name === "id" ||
					value.column_name === "name" ||
					value.column_name === "head_of_household" ||
					value.column_name === "age" ||
					value.column_name === "city" ||
					value.column_name === "state" ||
					value.column_name === "zip_code" ||
					value.column_name === "financial" ||
					value.column_name === "amount" ||
					value.column_name === "food_weight" ||
					value.column_name === "food_count"

				) {

					value.filterable = true;

					contactFields[i] = value;
				}
			}
			contactFields.push({
				column_name: 'Select'
			});
			var cpm = new sap.ui.model.json.JSONModel();
			cpm.setData({
				contactfields: contactFields
			});
			sap.ui.getCore().setModel(cpm, "CP");

		}

	}

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf com.scs.view.Dashboard
	 */
	//	onExit: function() {
	//
	//	}

});