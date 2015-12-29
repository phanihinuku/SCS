jQuery.sap.require("com.scs.utils.utils");

sap.ui.controller("com.scs.view.Adduser", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf com.scs.view.Adduser
	 */
	//	onInit: function() {
	//
	//	},
	addUser: function() {
		var data = {};
		var call = {};
		data.username = this.byId('adduid').getValue();
		data.password = this.byId('addpwd').getValue();
		data.pwd2 = this.byId('addpwd2').getValue();
		data.display_name = this.byId('addDisplayName').getValue();
		var selectedIndex = this.byId('RBGRole').getSelectedIndex();
		if (selectedIndex === 0) {
			data.role = 'A';
		} else {
			data.role = 'U';
		}

		if (data.username === "") {
			sap.m.MessageToast.show('Please Enter User Name');
			this.byId('adduid').focus();
		} else {
			if (data.display_name === "") {
				sap.m.MessageToast.show('Please Enter Display name');
				this.byId('addDisplayName').focus();
			} else {
				if (data.password === "" || data.pwd2 === "") {
					sap.m.MessageToast.show('Please Enter passwords');
					this.byId('addpwd').focus();
				} else {
					if (data.password !== data.pwd2) {
						sap.m.MessageToast.show('Passwords did not Match');
						this.byId('addpwd').focus();
					} else {

						call.url = com.scs.model.settings.getBaseUrl() + "/SCSAdmin/php/user_add.php";
						call.headers = {
							ContentType: "application/x-www-form-urlencoded"
						};
						call.successCallback = this.addUserCallBack;
						call.errorCallback = this.errorCallback;
						call.method = "POST";
						call.dataStr = "data=" + JSON.stringify(data);
						call.loadStr = "Creating User";
						com.scs.utils.utils.dbcall(this, call);
					}
				}

			}
		}

	},
	back: function() {
		var that=this;
		var dialog = new sap.m.Dialog({
			title: 'Confirm',
			type: 'Message',
			content:[new sap.m.Text({
				text: 'Data will be lost. Are you sure you want to Go Back?'
			})],
			beginButton: new sap.m.Button({
				text: 'Ok',
				press: function() {
					that.clear();
					app.back();
					dialog.close();
				}
			}),
			endButton: new sap.m.Button({
				text: 'Cancel',
				press: function() {
					dialog.close();
				}
			}),
			afterClose: function() {
				dialog.destroy();
			}
		});
		dialog.open();
	},
	addUserCallBack: function(data, status, headers, context) {
		var response = JSON.parse(data);
		if (response.success) {
			sap.m.MessageToast.show('User Created Successfully');
			context.clear();
			app.back();
		} else {
			sap.m.MessageToast.show(response.message);
		}
	},
	errorCallback: function(err) {

	},

	validate: function(e) {

		if (e.getSource()) {
			com.scs.utils.utils.validate(e.getSource());
		}

	},
	clear: function() {
		this.byId('adduid').setValue("");
		this.byId('addpwd').setValue("");
		this.byId('addpwd2').setValue("");
		this.byId('addDisplayName').setValue("");
		this.byId('RBGRole').getSelectedIndex(1);

	},

	validate2: function(e) {
		var pwd1 = this.byId("addpwd").getValue();
		if (e.getSource().getValue() === pwd1) {
			e.getSource().setValueState(sap.ui.core.ValueState.Success);
			e.getSource().setValueStateText("Both Passwords matched");
		} else {
			e.getSource().setValueState(sap.ui.core.ValueState.Error);
			e.getSource().setValueStateText("Both Passwords did not match");
		}

	}

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf com.scs.view.Adduser
	 */
	//	onBeforeRendering: function() {
	//
	//	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf com.scs.view.Adduser
	 */
	//	onAfterRendering: function() {
	//
	//	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf com.scs.view.Adduser
	 */
	//	onExit: function() {
	//
	//	}

});