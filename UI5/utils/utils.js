jQuery.sap.declare("com.scs.utils.utils");
jQuery.sap.require("com.scs.model.settings");
jQuery.sap.require("sap.m.MessageToast");

com.scs.utils.utils = {
	getCountSCM: function() {
		if (sap.ui.getCore().getModel('SCM') && sap.ui.getCore().getModel('SCM').getData()) {
			return "Selected Contacts: " + sap.ui.getCore().getModel('SCM').getData().length;
		} else {
			return "";
		}

	},
	logout: function(context, success, error) {

		var call = {};
		call.url = com.scs.model.settings.getBaseUrl() + "/SCSAdmin/php/user_logout.php";
		call.headers = {
			ContentType: "application/x-www-form-urlencoded"
		};
		call.successCallback = success;
		call.errorCallback = error;
		call.method = "POST";
		// call.dataStr = "query=" + JSON.stringify(creds);
		call.loadStr = "Logging Out";
		this.dbcall(context, call);
	},
	validate: function(field) {
		if (field && field.getValue() === "") {
			field.setValueState(sap.ui.core.ValueState.Error);
			field.focus();
		} else {
			field.setValueState(sap.ui.core.ValueState.None);

		}

	},
	dbcall: function(context, c) {

		//headers,url,successCallback,errorCallback,dataSttr
		if (!context._dialog) {
			context._dialog = sap.ui.xmlfragment("com.scs.view.BusyDialog",
				context);
			if (c.loadStr != null) {
				context._dialog.setText(c.LoadStr);
			}
			context.getView().addDependent(context._dialog);
		}

		jQuery.sap.syncStyleClass("sapUiSizeCompact", context.getView(),
			context._dialog);
		context._dialog.open();

		if (c.dataStr == null) {

			c.dataStr = "";
		}
		if (c.method == null) {

			c.method = "";
		}
		if (c.headers == null) {
			c.headers = {};
		}

		if (c != null) {

			$.ajax({
				url: c.url,
				headers: c.headers,
				method: c.method,
				data: c.dataStr,
				success: function(data, b, c1) {

					if ((data.indexOf("Fatal error") >= 0) ) {
						sap.m.MessageToast.show("Data fetch from server failed. Please Contact the Administrator");
					}

					context._dialog.close();
					// context._dialog.destroy();
					c.successCallback(data, b, c1, context);

				},
				error: function(e) {
					context._dialog.close();
					// context._dialog.destroy();
					context.errorCallback(e);

				}

			});
		}

	}
};