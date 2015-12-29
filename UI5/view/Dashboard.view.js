jQuery.sap.require("sap.m.StandardTile");
// Load the rounded tile control
jQuery.sap.require("com.scs.view.RoundedTile");

sap.ui.jsview("com.scs.view.Dashboard", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf com.scs.view.Dashboard
	 */
	getControllerName: function() {
		return "com.scs.view.Dashboard";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * @memberOf com.scs.view.Dashboard
	 */
	createContent: function(oController) {
		// var tilesM = new sap.ui.model.json.JSONModel();
		// tilesM.loadData('../model/tiles.json');
		//	var tiles = tilesM.getData();
		var tiles = [
			 {
				title: "Grouping / Segmentation",
				icon: "search",
				bgColor: "00BFFF",
				press: "contacts"
					},
			{
				title: "Compose",
				icon: "add",
				press: "groups"
					},
			{
				title: "Imbox",
				icon: "inbox",
				press: "inbox"

					},
			{
				title: "SMS Templates",
				icon: "iphone",
				press: "templates"

					},
						{
				title: "Add User",
				icon: "add-contact",
				press: "addUser"

					},
					{
				title: "Upload Contacts",
				icon: "excel-attachment",
				//iconColor : "#ffffff",
				//bgColor : "rgb(57, 123, 110)",
				//borderColor : "rgb(57, 123, 110)",
				press: "upload"
					},
					{
				title: "Schedule from File",
				icon: "measurement-document",
				//iconColor : "#ffffff",
				//bgColor : "rgb(57, 123, 110)",
				//borderColor : "rgb(57, 123, 110)",
				press: "uploadSchedule"
					}
					];
		this.oTilesContainer = new sap.m.TileContainer();
		this.oTilesContainer.setHeight("100%");
		this.oTilesContainer.setVisible(true);

		for (var c in tiles) {
			var tileItem1 = new RoundedTile();
			tileItem1.setTitle(tiles[c]["title"]);
			tileItem1.setIcon("sap-icon://" + tiles[c]["icon"]);
			if (tiles[c]["iconColor"])
				tileItem1.setIconColor(tiles[c]["iconColor"]);
			if (tiles[c]["bgColor"])
				tileItem1.setBgColor(tiles[c]["bgColor"]);
			if (tiles[c]["borderColor"])
				tileItem1.setBorderColor(tiles[c]["borderColor"]);

			if (tiles[c]["press"] === "upload") {
				tileItem1.attachPress(this.getController().upload);

			} else if (tiles[c]["press"] === "contacts") {
				tileItem1.attachPress(this.getController().contacts);

			} else if (tiles[c]["press"] === "groups") {
				tileItem1.attachPress(this.getController().groups);

			} else if (tiles[c]["press"] === "templates") {
				tileItem1.attachPress(this.getController().templates);

			} else if (tiles[c]["press"] === "inbox") {
				tileItem1.attachPress(this.getController().inbox);

			}else if (tiles[c]["press"] === "addUser") {
				tileItem1.attachPress(this.getController().addUser);

			}else if (tiles[c]["press"]==="uploadSchedule"){
				tileItem1.attachPress(this.getController().uploadSchedule);
			}
			
			
			
			this.oTilesContainer.addTile(tileItem1);
		}
		// Create the standard UI5 Tile container

		// Creates and returns the Page to be shown by the view

		return new sap.m.Page({
			// title: "Dashboard",
			// showHeader:false,
			showNavButton: false,
			navButtonPress: [oController, oController.goBack],
			//backgroundImage:'http://tse2.mm.bing.net/th?id=OIP.M1648e02d0a30396db1c796fd1477fc82o0&pid=15.1'
			enableScrolling: false,
			customHeader:new sap.m.Bar({contentMiddle:[new sap.m.Text({text:"DashBoard"})],
			contentRight:[new sap.m.Text({id:"welcome"}),new sap.m.Button({icon:"sap-icon://log",press:[oController,oController.goBack]})]}),
			content: [
				this.oTilesContainer
			]
		});

	}

});