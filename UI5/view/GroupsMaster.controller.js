jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("com.scs.model.settings");
jQuery.sap.require("com.scs.utils.utils");

sap.ui.controller("com.scs.view.GroupsMaster", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf com.scs.view.GroupsMaster
	 */
	onInit: function() {
		var oModel = new sap.ui.model.json.JSONModel("../UI5/model/months.json");
		sap.ui.getCore().setModel(oModel, 'MONTHS');
		oModel = new sap.ui.model.json.JSONModel("../UI5/model/days.json");
		sap.ui.getCore().setModel(oModel, 'DAYS');
		oModel = new sap.ui.model.json.JSONModel("../UI5/model/daysweek.json");
		sap.ui.getCore().setModel(oModel, 'DAYSWEEK');
		oModel = new sap.ui.model.json.JSONModel("../UI5/model/zones.json");
		sap.ui.getCore().setModel(oModel, 'ZONES');
	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf com.scs.view.GroupsMaster
	 */
	//	onBeforeRendering: function() {
	//
	//	},
	daysOrOn: function(oEvent) {
		if (this.byId('daysOrOn').getSelectedButton() == "idGroupsMaster--idDays") {
			this.byId('idGroupsMaster--monthlyBlock2').setVisible(true);
			this.byId('idGroupsMaster--monthlyBlock3').setVisible(false);
			this.byId('idGroupsMaster--monthlyBlock4').setVisible(false);

		} else if (this.byId('daysOrOn').getSelectedButton() == "idGroupsMaster--idOn") {
			this.byId('idGroupsMaster--monthlyBlock2').setVisible(false);
			this.byId('idGroupsMaster--monthlyBlock3').setVisible(true);
			this.byId('idGroupsMaster--monthlyBlock4').setVisible(true);
		}

	},
	handleComposeCancel: function() {
		this._wizard.goToStep(this._wizard.getSteps()[0]);

		this._wizard.discardProgress(this._wizard.getSteps()[0]);

	},
	goBack: function() {

		app.back();
	},
	loadGroups: function(oEvent) {
		var call = {};
		var queryStr = "SELECT * FROM `groups` WHERE user='admin'";
		call.url = com.scs.model.settings.getBaseUrl() + "/SCSAdmin/php/read.php";
		call.headers = {
			ContentType: "application/x-www-form-urlencoded"
		};
		call.successCallback = this.groupReadSuccessCallback;
		call.errorCallback = this.errorCallback;
		call.method = "POST";
		call.dataStr = "query=" + queryStr;
		call.loadStr = "Loading Group Data"
		com.scs.utils.utils.dbcall(this, call);

	},
	onChange: function(oEvent) {
		var context = oEvent.getSource().getSelectedItem().getBindingContext('TM');
		// this.byId('tAreaTemplateText').setBindingContext(context, 'TM');
		this.byId('tAreaTemplateText').setValue(context.getProperty('template_text'));
	},
	groupReadSuccessCallback: function(data) {

	},
	loadSelectedContacts: function() {

		var items = this.byId('groupList').getSelectedItems();
		var conditions = [];
		for (var i = 0; i < items.length; i++) {
			var value = items[i];
			if (value.getBindingContext('GM')) {
				conditions.push(this.generateQuery(
					JSON.parse(value.getBindingContext('GM').getProperty('group_details'))));
			}
		}

		var queryStr = "SELECT  * from `contacts` where ";
		if (conditions.length > 0) {
			for (var j = 0; j < conditions.length; j++) {
				var cond = conditions[j];
				if (j == 0) {
					queryStr = queryStr + " (" + cond + ") ";
				} else {
					queryStr = queryStr + " or " + " (" + cond + ") ";
				}

			}

			//call db for contacts

			var call = {};
			call.url = com.scs.model.settings.getBaseUrl() + "/SCSAdmin/php/read.php";
			call.headers = {
				ContentType: "application/x-www-form-urlencoded"
			};
			call.successCallback = this.contactsSuccessCallback;
			call.errorCallback = this.errorCallback;
			call.method = "POST";
			call.dataStr = "query=" + queryStr;
			call.loadStr = "Loading Contact Data"
			com.scs.utils.utils.dbcall(this, call);

		} else {

			sap.m.MessageToast.show("No Groups are Selected");
			var empty = {};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(empty);
			sap.ui.getCore().setModel(oModel, 'SCM');
		}

	},

	contactsSuccessCallback: function(data, status, hdr, context) {

		if ((!data.indexOf("Fatal error") >= 0) && (data != null)) {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(JSON.parse(data));
			sap.ui.getCore().setModel(oModel, 'SCM');
			if (context.byId('contactsTableSel')) {
				context.byId('contactsTableSel').selectAll();
			}

		} else {
			sap.m.MessageToast.show("Contact Loading failed");
		}

	},
	secondTimeEnabled: function(evt) {
		this.byId('msgTime2').setEnabled(evt.getSource().getSelected());
	},
	selectFrequency: function(oEvent) {
		var selButtonId = oEvent.getParameters().id;
		if (selButtonId === "idGroupsMaster--bImmediate") {
			this.byId('idGroupsMaster--laterPanel').setVisible(false);
		} else {
			this.byId('idGroupsMaster--laterPanel').setVisible(true);

			if (selButtonId === "idGroupsMaster--bWeekly") {
				this.byId('idGroupsMaster--weeklyBlock').setVisible(true);

			} else {
				this.byId('idGroupsMaster--weeklyBlock').setVisible(false);
			}

			if (selButtonId === "idGroupsMaster--bDaily") {
				this.byId('idGroupsMaster--dailyBlock').setVisible(true);

			} else {
				this.byId('idGroupsMaster--dailyBlock').setVisible(false);
			}

			if (selButtonId === "idGroupsMaster--bMonthly") {
				this.byId('idGroupsMaster--monthlyBlock').setVisible(true);

			} else {
				this.byId('idGroupsMaster--monthlyBlock').setVisible(false);
			}

		}

	},
	errorCallback: function() {
		sap.m.MessageToast.show("Your request is Failed");
	},

	validate: function(e) {

		if (e.getSource()) {
			com.scs.utils.utils.validate(e.getSource());
		}
	},
	unique: function(list) {
		var result = [];
		$.each(list, function(i, e) {
			if ($.inArray(e, result) == -1) {

				result.push(e);

			}
		});
		return result;
	},
	finalizeContacts: function() {
		this.loadSelectedContacts();
		if (this.byId('addContactsTableSel')) {
			var items = this.byId('addContactsTableSel').getSelectedItems();
			var selectedContactsData = [];
			var data = [];

			if (sap.ui.getCore().getModel('SCM') != null) {
				data = sap.ui.getCore().getModel('SCM').getData();
			}

			var manual = [];
			for (var k = 0; k < items.length; k++) {
				var item = items[k];
				if (item.getCells().length > 0 && item.getCells()[0] && item.getCells()[1]) {
					var name = item.getCells()[0].getValue();
					var phone_mobile = item.getCells()[1].getValue();

					manual.push({
						name: name,
						phone_mobile: phone_mobile
					});
					selectedContactsData.push(phone_mobile);

				}
			}

			if (!((!!data) && (data.constructor === Array))) {
				data = [];
			}
			for (var k1 = 0; k1 < manual.length; k1++) {
				data.push(manual[k1]);
			}

			for (var l = 0; l < data.length; l++) {
				var contact = data[l];
				if (contact && contact.name && contact.phone_mobile) {
					selectedContactsData.push(contact.phone_mobile);
				}
			}

			var conUnique = this.unique(selectedContactsData);
			var conUniqueObjs = [];
			var name1 = "";
			for (var i = 0; i < conUnique.length; i++) {
				for (var g1 = 0; g1 < selectedContactsData.length; g1++) {
					var contact1 = data[g1];
					if (contact1.phone_mobile === conUnique[i]) {
						name1 = contact1.name;
						break;
					}
				}
				conUniqueObjs.push({
					phone_mobile: conUnique[i],
					name: name1
				});
				name1 = "";
			}

			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(conUniqueObjs);
			sap.ui.getCore().setModel(oModel, 'UCS');

		}

	},
	createJobSuccessCallback: function(data) {
		var jobid = "";
		// 	if ((! >= 0) && (data != null)) {

		// 	sap.m.MessageToast.show("Create Job Failed");

		// } else {
		// 	sap.m.MessageToast.show('Error while fetching Groups');
		// }
		if (data.indexOf("Fatal error") >= 0) {
			sap.m.MessageToast.show("Create Job Failed");
		} else {
			if (JSON.parse(data) != null) {
				jobid = JSON.parse(data).job_id;
			}
			if (jobid != null) {
				sap.m.MessageToast.show("Message Sent/Scheduled successfully");
			}
		}

		// 	if ((!data.indexOf("Fatal error") >= 0) && (data != null)) {
		// 		sap.m.MessageToast.show("Message Sending Success");
		// 	} else {
		// 		sap.m.MessageToast.show("Message Sending Failed");
		// 	}
		// }
	},
	sendMsg: function() {
		//send logic
		if (this.getView() != null && this.getView().getDependents().length > 0) {
			this._oQuickView.open().close();
			sap.ui.getCore().byId('messageTextReview').setText("");
			sap.ui.getCore().byId('messageSchedule').setText("");
		}

		var call = {};
		call.url = com.scs.model.settings.getBaseUrl() + "/SCSAdmin/php/create_job.php";
		call.headers = {
			ContentType: "application/x-www-form-urlencoded"
		};
		call.successCallback = this.createJobSuccessCallback;
		call.errorCallback = this.errorCallback;
		call.method = "POST";
		call.dataStr = "data=" + JSON.stringify(this.data1);
		call.loadStr = "Loading Group Data";
		com.scs.utils.utils.dbcall(this, call);

	},
	cancelMsg: function() {
		if (this.getView() != null && this.getView().getDependents().length > 0) {
			this._oQuickView.open().close();
			// this.getView().removeAllDependents();
		}
	},
	reviewAndSend: function() {
		this.data1 = {};
		var job_name = "Job by admin on " + new Date().toJSON();
		var freq = this.byId('freqSeg') != null ? this.byId(this.byId('freqSeg').getSelectedButton()).getCustomData()[0].getProperty('value') :
			"I";
		var recur = 0;
		var message = "";
		var startDate = "";
		var startTime = "";
		var days = [];
		var months = [];
		var dates = [];
		var tokens = [];
		var recipients = [];
		if (this.byId('tAreaTemplateText') != null) {
			message = this.byId('tAreaTemplateText').getValue();
		}
		if (this.byId('startDate').getDateValue() != null) {

			// startDate = this.byId('startDate').getDateValue();
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd"
			});
			startDate = oDateFormat.format(this.byId('startDate').getDateValue());
		}

		if (this.byId('startTime').getDateValue() != null) {
			// startTime = this.byId('startTime').getDateValue().toTimeString();
			oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "HH:mm:ss"
			});
			startTime = oDateFormat.format(this.byId('startTime').getDateValue());
		}
		startDate = startDate + "T" + startTime;

		if (freq === 'W') {
			recur = this.byId('recurWeekly').getValue();
			days = this.byId("weekdaysW").getSelectedKeys();
		} else if (freq === 'D') {
			recur = this.byId('recurDaily').getValue();
		} else if (freq === 'M') {
			days = this.byId("monthlyBlock4").getSelectedKeys();
			months = this.byId("monthsCombo").getSelectedKeys();
			if (this.byId('daysOrOn').getSelectedButton() === "idGroupsMaster--idDays") {

				dates = this.byId("monthlyBlock2").getSelectedKeys();

			} else if (this.byId('daysOrOn').getSelectedButton() === "idGroupsMaster--idOn") {

				dates = this.byId("monthlyBlock3").getSelectedKeys();

			}

		}

		tokens = this.byId('selectedContactTokens').getTokens();
		for (var i = 0; i < tokens.length; i++) {
			var value = tokens[i];

			if (value != null && value.getProperty('key') != null) {

				recipients.push({
					phone_mobile: value.getProperty('key'),
					name: value.getProperty('text')
				});
			}

		}

		//frequencies: I,O,D,W,M -> Y,B-n/a
		///create message logic
		var data = {

			job_name: job_name,
			frequency: freq,
			recur: recur,
			message: message,
			recipients: recipients,
			start_date: startDate,
			start_time: startTime,
			param_days: days,
			param_months: months,
			param_dates: dates

		};
		// validation

		// if type = I -> check msg,recepients
		// if type = O -> check msg, recepients,start date,start time
		// if type = D -> check msg, recepients,start date,start time, recur default 1 - add buttons +,- validate recur
		// if type = W - > check msg, recepients,start date,start time, recur default 1 - add buttons +,- validate recur
		// , validate recurring days
		// if type = M -> check msg, recepients,start date,start time, recur default 1 - add buttons +,- validate recur
		// , validate recurring days and monthly fields
		// Check Message content and recepients
		var flag = true;
		if (data.recipients.length <= 0) {
			flag = false;

			sap.m.MessageToast.show("No recepients were selected. Please Add recepients.");
		} else {
			flag = true;

			if (data.message === "" || data.message == null) {
				flag = false;
				sap.m.MessageToast.show("Please enter Message");
				this.byId('tAreaTemplateText').focus();
			} else {

				flag = true;
			}
		}
		if (flag) {
			var sd = startDate.replace("T", " ");
			if (new Date(sd) < new Date()) {
				flag = false;
				sap.m.MessageToast.show("Please enter future date and Time");
				this.byId('startDate').focus();
			}
		}

		if (flag) {

			switch (data.frequency) {
				case 'I':
					data.description = "Message will be sent Immediately";
					this.showreviewPopup(data);
					break;
				case 'O':
					flag = this.validateDateTime();
					if (flag) {

						data.description = "Message will be sent on " +
							this.byId('startDate').getValue() + " at " +
							this.byId('startTime').getValue() + ".";
						this.showreviewPopup(data);
					}
					break;
				case 'D':
					flag = this.validateDateTime();
					if (flag) {
						data.description = "Message will be sent on " +
							this.byId('startDate').getValue() + " at " +
							this.byId('startTime').getValue() + " for " +
							data.recur + " time(s)";
						this.showreviewPopup(data);
					}
					break;
				case 'W':
					flag = this.validateDateTime();
					if (flag) {
						if (data.param_days != null && data.param_days.length > 0) {
							flag = true;

						} else {
							flag = false;
							sap.m.MessageToast.show("Please select days");
							this.byId('weekdaysW').focus();
						}
					}
					if (flag) {
						var daysStr = "";
						var daysAll = sap.ui.getCore().getModel('DAYSWEEK').getData();
						for (var j1 = 0; j1 < data.param_days.length; j1++) {

							var day = (data.param_days[j1] - 1).toString();

							if (j1 === data.param_days.length - 1 && j1 !== 0) {
								daysStr = daysStr + " & " + daysAll[day].weekday + " ";
							} else if (j1 === 0) {
								daysStr = daysStr + " " + daysAll[day].weekday;
							} else {
								daysStr = daysStr + ", " + daysAll[day].weekday + " ";
							}

						}
						data.description = "Message will be sent on " +
							this.byId('startDate').getValue() + " at " +
							this.byId('startTime').getValue() + " for " +
							data.recur + " time(s)" + " on every " + daysStr;

						this.showreviewPopup(data);
					}
					break;
				case 'M':
					flag = this.validateDateTime();
					if (flag) {
						if (data.param_months != null && data.param_months.length > 0) {
							flag = true;

						} else {
							flag = false;
							sap.m.MessageToast.show("Please select months");
							this.byId('monthsCombo').focus();
						}
					}

					if (flag) {
						if (this.byId('daysOrOn').getSelectedButton() == "idGroupsMaster--idDays") {
							//this.byId('idGroupsMaster--monthlyBlock2').setVisible(true);
							if (data.param_dates != null && data.param_dates.length > 0) {
								flag = true;
							} else {
								flag = false;
								sap.m.MessageToast.show("Please Select Dates");
								this.byId('idGroupsMaster--monthlyBlock2').focus();
							}

						} else if (this.byId('daysOrOn').getSelectedButton() == "idGroupsMaster--idOn") {

							if (data.param_dates != null && data.param_dates.length > 0) {
								flag = true;
							} else {
								flag = false;
								sap.m.MessageToast.show("Please Select Days");
								this.byId('idGroupsMaster--monthlyBlock3').focus();
							}

							if (data.param_days != null && data.param_days.length > 0) {
								flag = true;
							} else {
								flag = false;
								sap.m.MessageToast.show("Please Select Days");
								this.byId('idGroupsMaster--monthlyBlock4').focus();
							}

						}
					}

					if (flag) {

						var daysStr = "";
						var daysAll = sap.ui.getCore().getModel('DAYS').getData();
						for (j1 = 0; j1 < data.param_days.length; j1++) {

							var day = (data.param_days[j1] - 1).toString();

							if (j1 === data.param_days.length - 1 && j1 !== 0) {
								daysStr = daysStr + " & " + daysAll[day].day + " ";
							} else if (j1 === 0) {
								daysStr = daysStr + " " + daysAll[day].day;
							} else {
								daysStr = daysStr + ", " + daysAll[day].day + " ";
							}

						}

						var monsStr = "";
						var monsAll = sap.ui.getCore().getModel('MONTHS').getData();
						for (var m2 = 0; m2 < data.param_months.length; m2++) {
							var mon = data.param_months[m2];

							if (m2 === data.param_months.length - 1 && m2 !== 0) {
								monsStr = monsStr + " & " + monsAll[mon].month + " ";
							} else if (m2 === 0) {
								monsStr = monsStr + " " + monsAll[mon].month;
							} else {
								monsStr = monsStr + ", " + monsAll[mon].month + " ";
							}

						}
						data.description = "Message will be sent " +
						// " on " +
						// this.byId('startDate').getValue() +
						" at " +
							this.byId('startTime').getValue() +
						// " for " +
						// data.recur + " time(s)" +
						// " on every "+daysStr+
						" in months " + monsStr;

						this.showreviewPopup(data);
					}
					break;
				default:
			}

		}

		// if(flag){

		// }

	},
	showreviewPopup: function(data) {
		this.data1 = data;
		if (this._oQuickView == null) {
			this._oQuickView = sap.ui.xmlfragment("com.scs.view.MessageReview", this);

		}
		if (data.message != null) {
			sap.ui.getCore().byId('messageTextReview').setText(data.message);
		}
		if (data.description != null) {
			sap.ui.getCore().byId('messageSchedule').setText(data.description);
		}
		this.getView().addDependent(this._oQuickView);
		this._oQuickView.data1 = data;
		this._oQuickView.open();

	},

	validateDateTime: function() {
		var flag = true;
		if (this.byId('startDate') == null || this.byId('startDate').getDateValue() == null) {
			flag = false;
			sap.m.MessageToast.show("Please Enter Date");
			this.byId('startDate').focus();
		} else {
			flag = true;
		}
		if (flag) {
			if (this.byId('startTime') == null || this.byId('startTime').getDateValue() == null) {
				flag = false;
				sap.m.MessageToast.show("Please Enter Time");
				this.byId('startTime').focus();
			} else {
				flag = true;
			}
		}
		return flag;
	},
	generateQuery: function(data) {
		var val1;
		if (data) {

			// var query = "SELECT  * from `contacts` where ";
			var query = "";
			for (var i = 0; i < data.length; i++) {
				var d = data[i];
				if (d.operator === 'LIKE') {
					val1 = "% " + d.value + "%";
				} else if (d.operator === 'BETWEEN') {
					val1 = d.value + "' and '" + d.highvalue;
				} else {
					val1 = d.value;
				}

				if (i === 0) {
					query = query + d.segment + " " + d.operator + " " + "'" + val1 + "'";
				} else {

					query = query + " and " + d.segment + " " + d.operator + " " + "'" + val1 + "'";
				}

				val1 = "";
			}

			return query;
		}

	},
	removADLeContact: function(evt) {
		// evt.getSource().getBindingContext().getPath()
		if (evt.getSource().getBindingContext('ADL') && evt.getSource().getBindingContext('ADL').getPath()) {
			var idx = parseInt(evt.getSource().getBindingContext('ADL').getPath().substring(1));

			var oModel = sap.ui.getCore().getModel('ADL');
			if (oModel) {
				var data = oModel.getData();
				data.splice(idx, 1);
				oModel.setData(data);
				sap.ui.getCore().setModel(oModel, 'ADL');
			}
		}

	},
	addManualContact: function() {
		var emptyContact = {
			name: "",
			phone_mobile: ""
		};
		var oModel = sap.ui.getCore().getModel('ADL');
		var data = [];
		if (oModel && oModel.getData()) {
			data = oModel.getData();
			data.push(emptyContact);
		} else {
			data.push(emptyContact);
			oModel = new sap.ui.model.json.JSONModel();

		}
		oModel.setData(data);
		sap.ui.getCore().setModel(oModel, 'ADL');

	},
	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf com.scs.view.GroupsMaster
	 */
	onAfterRendering: function() {
		this._wizard = this.getView().byId("createSMS");

		// var temps = [{
		// 	templateid: 0,
		// 	template_name: "Select",
		// 	template_text: "",
		// 	created_by: "admin"
		// 	}];
		// var data = [];
		// var oModel = sap.ui.getCore().getModel('TM');
		// if (oModel != null) {
		// 	data = oModel.getData();
		// 	for (var i = 0; i < data.length; i++) {
		// 		var value = data[i];
		// 		temps.push(value);
		// 	}
		// }
		// oModel.setData(temps);
		// sap.ui.getCore().setModel(oModel, 'TM');
		this.getView().byId("tAreaTemplateText").fireChange();

	},
	recurDefault: function(oEvent) {

		if (oEvent.getParameters('value').value === "" || oEvent.getParameters('value').value === "0") {
			oEvent.getSource().setValue("1");
		}
	}

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf com.scs.view.GroupsMaster
	 */
	//	onExit: function() {
	//
	//	}

});