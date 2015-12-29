jQuery.sap.require("sap.m.MessageToast");
sap.ui.controller("com.scs.view.UploadSchedule", {
	onBackPress: function() {
		
		app.back();

	},
	handleUploadComplete: function(data) {
		if ((!data.getParameter('response').indexOf("Fatal error") >= 0) && (data.getParameter('response')!=null)&&(data != null)) {

			// if (data.getParameter('response').indexOf("uploaded successfully") >= 0) {
	if (data.getParameter('response').indexOf("job_id") >= 0) {

				if (sap.ui.getCore().byId('idUpload').getController()._dialog) {
					sap.ui.getCore().byId('idUpload').getController()._dialog.close();
					sap.m.MessageToast.show("Upload Success");
					this.getView().byId("fileUploader").setValue("");
					this._dialog.close();
					app.back();
				}
			} else {
				sap.m.MessageToast.show("Upload Failed");
					this._dialog.close();
			}

		} else {
			this._dialog.close();
			sap.m.MessageToast.show("Upload Failed");
		}

	},
	handleUploadPress: function() {
		var oFileUploader = this.getView().byId("fileUploader");
		oFileUploader.setUseMultipart(true);
		if (!this._dialog) {
			this._dialog = sap.ui.xmlfragment("com.scs.view.BusyDialog",
				this);
		}
		this._dialog.setText("Uploading Message Schedule");
		this.getView().addDependent(this._dialog);
		this._dialog.open();
		oFileUploader.upload();

		// alert('upload under construction');
	}
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf com.scs.view.UploadSchedule
	 */
	//	onInit: function() {
	//
	//	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf com.scs.view.UploadSchedule
	 */
	//	onBeforeRendering: function() {
	//
	//	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf com.scs.view.UploadSchedule
	 */
	//	onAfterRendering: function() {
	//
	//	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf com.scs.view.UploadSchedule
	 */
	//	onExit: function() {
	//
	//	}

});