jQuery.sap.declare("com.scs.view.RoundedTile");
// Load the standard tile as this control inherits from it
jQuery.sap.require("sap.m.StandardTile");
// Extend the standard tile controller to create this control.
// The properties added are: the icon color, the background color and the border color
sap.m.StandardTile.extend("RoundedTile", {
	metadata : {
		properties : {
			// Icon color property with default value to standard UI5 blue
			iconColor : {
				type : "string",
				defaultValue : "#007cc0"
			},
			// Background color property with default value to white
			bgColor : {
				type : "string",
				defaultValue : "rgb(255, 255, 255)"
			},
			// Border color property with default value to standard UI5 blue
			borderColor : {
				type : "string",
				defaultValue : "#007cc0"
			}
		}
	},
    
    renderer : function(rm, oControl) {
        rm.write("<div tabindex=\"0\""); // start div representing the tile 
		rm.writeControlData(oControl);
		rm.addClass("roundedTile");
		rm.addClass("sapMPointer");
		rm.writeClasses();
		rm.write(" style=\"border: 1px solid "+oControl.getBorderColor()+"; background-color: "+ oControl.getBgColor() +";\"");
		if (oControl._invisible) {
			rm.addStyle("visibility", "hidden");
			rm.writeStyles();
		}
		var sTooltip = oControl.getTooltip_AsString();
		if (sTooltip) {
			rm.writeAttributeEscaped("title", sTooltip);
		}
		rm.write(">");
		if (oControl.getRemovable()) {
			rm.write("<div id=\"" + oControl.getId() + "-remove\" class=\"sapMTCRemove\"></div>");
		} else {
			rm.write("<div id=\"" + oControl.getId() + "-remove\" class=\"sapMTCNoRemove\"></div>");
		}
		rm.write("<div class=\"roundedTileContent\">");
		
        rm.write("<div"); // Start top row
		rm.addClass("roundedTileTopRow");
		rm.writeClasses();
		rm.write(">");
		if (oControl.getIcon()) { // Icon
			rm.write("<div");
			rm.addClass("sapMStdTileIconDiv");
			rm.write(" style=\"color:"+oControl.getIconColor()+";\"");
			
			switch (oControl.getType()) {
				case sap.m.StandardTileType.Monitor:
					rm.addClass("sapMStdIconMonitor");
					break;
				case sap.m.StandardTileType.Create:
					rm.addClass("sapMStdIconCreate");
					break;
			}
			rm.writeClasses();
			rm.write(">");
			
			var icon = oControl._getImage();
			icon.addStyleClass('roundedTileIcon');
			
			rm.renderControl(icon);
			rm.write("</div>");
		}
		rm.write("</div>"); // End top row div
		
		
		rm.write("<div"); // Start monitoring tile styling
		rm.addClass("roundedTileBottomRow");
		if (oControl.getType() === sap.m.StandardTileType.Monitor) {
			rm.addClass("sapMStdTileMonitorType");
		}
		rm.writeClasses();
		rm.write(">");
		
		rm.write("<div");  // Start title div
		rm.writeAttribute("id", oControl.getId() + "-title");
		rm.addClass("roundedTileTitle");
		rm.writeClasses();
		rm.write(" style=\"color:"+oControl.getIconColor()+";\"");
		rm.write(">");
		if (oControl.getTitle()) {
			rm.writeEscaped(oControl.getTitle());
		}
		rm.write("</div>"); // End title div
		
		if (oControl.getInfo()) {
			rm.write("<div"); // Start info
			rm.writeAttribute("id", oControl.getId() + "-info");
			rm.addClass("sapMStdTileInfo");
			rm.addClass("sapMStdTileInfo" + oControl.getInfoState());
			rm.writeClasses();
			rm.write(">");
			if (oControl.getInfo()) {
				rm.writeEscaped(oControl.getInfo());
			}
			rm.write("</div>"); // End info
		}
		rm.write("</div>"); // End bottom row type tile styling
        
        
		rm.write("</div></div>"); // End the div representing the tile
    }
});

