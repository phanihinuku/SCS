jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("com.scs.model.settings");
 
sap.ui.controller("com.scs.view.Contacts", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf com.scs.view.Contacts
	 */
	onInit: function() {
		var filterDummyData = [
			{
				segment: 'Select',
				operator: 'contains',
				value: '',
				highvalue: ''
			}

									];
		this.pushModel(filterDummyData);
	
	},

	onChangeOps: function(e) {
		if (e.getSource().getSelectedKey() === "BETWEEN") {
			e.getSource().getParent().getCells()[3].setEnabled(true);
		} else {
			e.getSource().getParent().getCells()[3].setEnabled(false);
		}

	},
	pushModel: function(data) {
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(data);
		sap.ui.getCore().setModel(oModel, 'SF');
	},
	deleteRow: function(e) {

		// e.getSource().getParent().destroy();
		selIndex = e.getSource().getParent().getCells()[1].getBinding('selectedKey').getContext().getPath().substring(1)
		if (sap.ui.getCore().getModel('SF').getData()) {
			var data = sap.ui.getCore().getModel('SF').getData();

			data.splice(selIndex, 1);
			this.pushModel(data);

		}

	},
	addFilter: function(e) {
		// var tab =e.getSource().getParent().getParent();
		// tab.addItem(this.byId('filterItem'));
		// tab.addItem(this.byId('filterItem'));

		if (sap.ui.getCore().getModel('SF').getData()) {
			var data = sap.ui.getCore().getModel('SF').getData();
			data.push({
				segment: 'Select',
				operator: 'contains',
				value: '',
				highvalue: ''
			});
			this.pushModel(data);
		}

	},

	goBack: function() {

		app.back();
	},
	generateQuery: function(data) {
		var val1;
		if (data) {

			var query = "SELECT  * from `contacts` where ";
			for (var i = 0; i < data.length; i++) {
				var d = data[i];
				if (d.operator == 'LIKE') {
					val1 = "% " + d.value + "%";
				} else if (d.operator == 'BETWEEN') {
					val1 = d.value + "' and '" + d.highvalue;
				} else {
					val1 = d.value
				}

				if (i == 0) {
					query = query + d.segment + " " + d.operator + " " + "'" + val1 + "'";
				} else {

					query = query + " and " + d.segment + " " + d.operator + " " + "'" + val1 + "'";
				}

				val1 = "";
			}

			this.getData(query);
		}

	},
	contactsSuccessCallback: function(data, status, hdr) {

		if ((!data.indexOf("Fatal error")>=0 )&& (data != null)) {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(JSON.parse(data));
			sap.ui.getCore().setModel(oModel, 'CM');
		}

	},
	errorCallback: function(e) {
		sap.m.MessageToast.show("Your requet is Failed");
	},
	getData: function(query) {
		var call = {};
		call.url = com.scs.model.settings.getBaseUrl() + "/SCSAdmin/php/read.php";
		call.headers = {
			ContentType: "application/x-www-form-urlencoded"
		};
		call.successCallback = this.contactsSuccessCallback;
		call.errorCallback = this.errorCallback;
		call.method = "POST";
		call.dataStr = "query=" + query;
		call.loadStr = "Loading Contact Data"
		com.scs.utils.utils.dbcall(this, call);

	},

	getContacts: function(e) {
		var dataC = [];
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(dataC);
		sap.ui.getCore().setModel(oModel, 'CM');

		if (sap.ui.getCore().getModel('SF').getData() && sap.ui.getCore().getModel('SF').getData().length > 0) {
			var data = sap.ui.getCore().getModel('SF').getData();
			var flag = false;
			for (var i = 0; i < data.length; i++) {
				var value = data[i];
				if (value.segment === "Select" || value.value === "") {
					flag = true;
					break;
				}

			}
			if (flag) {
				sap.m.MessageToast.show('Please Give Values for Segmentation');
			} else {

				this.generateQuery(data);

			}

		} else {
			sap.m.MessageToast.show('Please Add a filter');
		}

	},
	saveGroup: function(oEvent) {
		if (!this._oPopover1) {
			this._oPopover1 = sap.ui.xmlfragment("com.scs.view.PopoverGroup", this);
			this.getView().addDependent(this._oPopover1);

		}
		// var oButton = oEvent.getSource();
		this._oPopover1.openBy(oEvent.getSource());

	},
	createGroupPopup: function() {
		// insert Group
		var insQry = JSON.stringify(sap.ui.getCore().getModel('SF').getData());
		
		var groupname = sap.ui.getCore().byId('groupname').getValue();
		if(groupname){
			this._oPopover1.close();
		var queryStr =	"INSERT INTO `groups` (`group_id`, `group_name`, `user`, `group_details`) VALUES (NULL,"+
						"'"+sap.ui.getCore().byId('groupname').getValue()+"',"+
						 "'admin','"+
						 insQry+"')";
		}
		
		//insert in db -groups table
		
		var call = {};
		call.url = com.scs.model.settings.getBaseUrl() + "/SCSAdmin/php/read.php";
		call.headers = {
			ContentType: "application/x-www-form-urlencoded"
		};
		call.successCallback = this.groupSuccessCallback;
		call.errorCallback = this.errorCallback;
		call.method = "POST";
		call.dataStr = "query=" + queryStr;
		call.loadStr = "Loading Contact Data"
		com.scs.utils.utils.dbcall(this, call);



	},
	groupSuccessCallback:function(data,status,hdr){
		if(!data.indexOf("Fatal error")>=0){
			sap.m.MessageToast.show('Group Successfully Saved');
		}else{
				sap.m.MessageToast.show('Save Group failed');
		}
		
	},
	loadGroups:function(oEvent){
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
		call.loadStr = "Loading Contact Data"
		com.scs.utils.utils.dbcall(this, call);
		
	},
	groupReadSuccessCallback:function(data,status,header,context){
			if ((!data.indexOf("Fatal error")>=0 )&& (data != null)) {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(JSON.parse(data));
			sap.ui.getCore().setModel(oModel, 'GM');
			
			if (! context._oPopover2) {
				context._oPopover2 = sap.ui.xmlfragment( "com.scs.view.GroupMenu", context);
				context.getView().addDependent(context._oPopover2);
			}
			context._oPopover2.openBy(context.byId('loadGroupsMenu'));

			// delay because addDependent will do a async rerendering and the popover will immediately close without it
			
		}else{
			sap.m.MessageToast.show('Error while fetching Groups');
		}
	},
	loadSelectedGroup:function(oEvent){
		this._oPopover2.close();
		
		var selInd="";
		var grpStr = "";
		var data=[];
		if(oEvent.getSource().getBinding('title').getContext().getPath().substring(1)){
		selInd = oEvent.getSource().getBinding('title').getContext().getPath().substring(1);
		}
		if(parseInt(selInd)>=0){
			if(sap.ui.getCore().getModel('GM')){
			data= sap.ui.getCore().getModel('GM').getData();
			}
			if(data.length>selInd && data[selInd].group_details!=null){
			grpData = JSON.parse(data[selInd].group_details);
			
			this.pushModel(grpData);
			sap.ui.getCore().byId('idContacts--bGetContacts').fireEvent("press");
			}
		}
		
	}

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf com.scs.view.Contacts
	 */
	//	onBeforeRendering: function() {
	//
	//	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf com.scs.view.Contacts
	 */
	

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf com.scs.view.Contacts
	 */
	//	onExit: function() {
	//
	//	}

});