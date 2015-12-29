jQuery.sap.declare("com.scs.utils.formatter");

com.scs.utils.formatter = {

	icongen: function(val) {
		if (val != null) {
			var ret="cancel";
			// switch (val) {
			// 		case 'CMP':
			// 		ret= "begin";
			// 			break;
			// 		case 'FLD':
			// 			ret= "status-error";
			// 			break;
			// 		case 'NEW':
			// 			ret= "outbox";
			// 			break;
			// 		case 'CNC':
			// 		ret= "sys-cancel";
			// 			break;
			// 		default:
			// 	}
			
			return "sap-icon://"+ret;	
				
			}

		}

	};