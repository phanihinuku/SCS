sap.ui.controller("com.scs.view.TemplateCreate", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf com.scs.view.TemplateCreate
	 */
	//	onInit: function() {
	//
	//	},

	createTemplate:function(){
		if( this.byId('templateNamecr'))
		var templateName_tmp = this.byId('templateNamecr').getValue(); 
		
			if( this.byId('templateTextcr'))
		var templateText_tmp = this.byId('templateTextcr').getValue(); 
		
		
			var query="INSERT INTO `templates` (`templateid`, `template_name`, `template_text`, `created_by`) VALUES (NULL, '"+
			templateName_tmp+"', '"+templateText_tmp+"', 'admin')";
		
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

	},
	templateSuccessCallback:function(data,status,header,context){
			if ((!data.indexOf("Fatal error")>=0 )&& (data != null)) {
			sap.m.MessageToast.show('Template Created Successfully');
		}else{
				sap.m.MessageToast.show('Template Created Failed');
				
		}    
			if(context.byId('templateNamecr'))
		context.byId('templateNamecr').setValue(""); 
		
			if( context.byId('templateTextcr'))
		context.byId('templateTextcr').setValue(""); 
		
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
	 * @memberOf com.scs.view.TemplateCreate
	 */
	//	onBeforeRendering: function() {
	//
	//	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf com.scs.view.TemplateCreate
	 */
	//	onAfterRendering: function() {
	//
	//	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf com.scs.view.TemplateCreate
	 */
	//	onExit: function() {
	//
	//	}

});