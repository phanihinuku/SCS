jQuery.sap.declare("com.scs.model.settings");
com.scs.model.settings={
		
		connection:"http",
		host:"localhost",
		serverhost:"scs.pabbisys.com",
		port:"8087",
		//getBaseUrl:function(){return this.connection+"://"+this.host+":"+this.port;},
		getBaseUrl:function(){return this.connection+"://"+this.serverhost},
		getOps: function(){ return {ops: [ {key:'=',text:"Equals"},
					{key:'>',text:"Greater Than"},
					{key:'>=',text:"Greater than or equals"},
					{key:'<',text:"Less Than"},
					{key:'<=',text:"Less than or equals"},
					{key:'LIKE',text:"Contains"},
					{key:'BETWEEN',text:"Between"}
		]};}
	//	getBaseUrl:function(){return this,""},
		
		
};