sap.ui.controller("com.scs.view.TemplatesMaster", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf com.scs.view.TemplatesMaster
	 */
	onInit: function() {
		var qry = "SELECT * FROM `templates'";

	},
	goBack: function() {
	this.byId('templateList').setMode(sap.m.ListMode.None);
		shell.setApp(app);
	},
	createTemplate: function() {

		splitApp.toDetail("idTemplateCreate");

	},
	loadSelectedTemplates:function(oEvent){
			var	oItem = oEvent.getParameter("listItem") ||  oEvent.getSource();
			this.byId('templateList').setSelectedItem(oItem);
		var		oContext = oItem.getBindingContext('TM')
		if(sap.ui.getCore().byId("idTemplates"))
		sap.ui.getCore().byId("idTemplates").setBindingContext(oContext, 'TM');
		splitApp.toDetail("idTemplates");
	},
	deleteTemplateMode:function(){
		var mode=this.byId('templateList').getMode();
		if(mode===sap.m.ListMode.Delete)
		this.byId('templateList').setMode(sap.m.ListMode.None);
			if(mode===sap.m.ListMode.None)
		this.byId('templateList').setMode(sap.m.ListMode.Delete);
		
	},
	handleDeleteTemplate:function(oEvent){
	var	oItem = oEvent.getParameter('listItem');
		var		templateId = oItem.getBindingContext('TM').getProperty('templateid');
	if(templateId){
			var query="DELETE FROM `templates` WHERE `templates`.`templateid` = "+templateId;
		
		var call = {};
		call.url = com.scs.model.settings.getBaseUrl() + "/SCSAdmin/php/read.php";
		call.headers = {
			ContentType: "application/x-www-form-urlencoded"
		};
		call.successCallback = this.templateSuccessCallback;
		call.errorCallback = this.errorCallback;
		call.method = "POST";
		call.dataStr = "query=" + query;
		call.loadStr = "Updating Template Data";
		com.scs.utils.utils.dbcall(this, call);
	}
			
	},
	
	templateSuccessCallback:function(data,status,header,context){
		
		
		if ((!data.indexOf("Fatal error")>=0 )&& (data != null)) {
			sap.m.MessageToast.show('Template Deleted Successfully');
		}else{
				sap.m.MessageToast.show('Template Deletion Failed');
				
		}    
			
		
		var call = {};
		queryStr = "SELECT * FROM `templates`";
		call.url = com.scs.model.settings.getBaseUrl() + "/SCSAdmin/php/read.php";
		call.headers = {
			ContentType: "application/x-www-form-urlencoded"
		};
		call.successCallback = context.templateReadSuccessCallbackInit;
		call.errorCallback = context.errorCallback;
		call.method = "POST";
		call.dataStr = "query=" + queryStr;
		call.loadStr = "Loading Template Data";
		com.scs.utils.utils.dbcall(context, call);
		
		
		
		
	},
	
	templateReadSuccessCallbackInit:function(data){
		
		
			if ((!data.indexOf("Fatal error")>=0 )&& (data != null)) {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(JSON.parse(data));
			sap.ui.getCore().setModel(oModel, 'TM');
			}
		
		
	},
	
	errorCallback:function(){
		
			sap.m.MessageToast.show('Template Creation Failed');
			
			
			
	}
	
	
	
	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf com.scs.view.TemplatesMaster
	 */
	//	onBeforeRendering: function() {
	//
	//	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf com.scs.view.TemplatesMaster
	 */
	//	onAfterRendering: function() {
	//
	//	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf com.scs.view.TemplatesMaster
	 */
	//	onExit: function() {
	//
	//	}

});