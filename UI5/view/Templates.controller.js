jQuery.sap.require("com.scs.model.settings");
jQuery.sap.require("sap.m.MessageToast");

sap.ui.controller("com.scs.view.Templates", {

	handleEditPress: function() {

		this.templateName = this.byId('templateNamev').getText();
		this.templateText = this.byId('templateTextv').getText();
		//Clone the data
		this._toggleButtonsAndView(true);

	},

	handleCancelPress: function() {

		//Restore the data
		this.byId('templateNamec').setValue(this.templateName);
		this.byId('templateTextc').setValue(this.templateText);

		this._toggleButtonsAndView(false);

	},

	handleSavePress: function() {
		var templateName_tmp = this.byId('templateNamec').getValue();
		var templateText_tmp = this.byId('templateTextc').getValue();
		var templateId_tmp = this.byId('templateIdc').getText();
		if(templateId_tmp){
			templateId_tmp=parseInt(templateId_tmp);
		}
		this._toggleButtonsAndView(false);
		var query="UPDATE `templates` SET `template_name` = "+
		"'"+templateName_tmp+"'"+
		", `template_text` = '"+templateText_tmp+"' WHERE `templates`.`templateid` ="+templateId_tmp;
		
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
	errorCallback:function(){
		
			sap.m.MessageToast.show('Template Updation Failed');
	},
templateSuccessCallback:function(data){
		if ((!data.indexOf("Fatal error")>=0 )&& (data != null)) {
			sap.m.MessageToast.show('Template Updated Successfully');
		}else{
				sap.m.MessageToast.show('Template Updated Failed');
				
		}             
},
	_formFragments: {},

	_toggleButtonsAndView: function(bEdit) {
		var oView = this.getView();

		// Show the appropriate action buttons
		oView.byId("edit").setVisible(!bEdit);
		oView.byId("save").setVisible(bEdit);
		oView.byId("cancel").setVisible(bEdit);

		// Set the right form type
		this._showFormFragment(bEdit ? "TemplateChange" : "TemplateDisplay");
	},

	_getFormFragment: function(sFragmentName) {
		var oFormFragment = this._formFragments[sFragmentName];

		if (oFormFragment) {
			return oFormFragment;
		}

		oFormFragment = sap.ui.xmlfragment(this.getView().getId(), "com.scs.view." + sFragmentName);

		return this._formFragments[sFragmentName] = oFormFragment;
	},

	_showFormFragment: function(sFragmentName) {
		var oPage = this.getView().byId("pageTemplate");
		if (oPage) {
			oPage.removeAllContent();
			oPage.insertContent(this._getFormFragment(sFragmentName));
		}
	},

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf com.scs.view.Templates
	 */
	onInit: function() {
		this._showFormFragment("TemplateDisplay");
	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf com.scs.view.Templates
	 */
	beforeShow: function(data) {
		this._showFormFragment(data.frag);
		// 	this._toggleButtonsAndView(false);
	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf com.scs.view.Templates
	 */
	onAfterRendering: function() {

	}

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf com.scs.view.Templates
	 */
	//	onExit: function() {
	//
	//	}

});