sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
], function (Controller, Filter, FilterOperator, Sorter, StringFilterOperator) {
	"use strict";
	/*eslint no-console: ["error", { allow: ["warn", "error"] }] */

	return Controller.extend("orders.orders.controller.View1", {
		onInit: function () {
			var sUrl = "/iot/iot/iot.xsodata/";
			var oModel = new sap.ui.model.odata.ODataModel(sUrl, {
				useBatch: false
			});
			this.getView().setModel(oModel);
			var oList = this.byId("Table");
			this._oList = oList;
		},
		onRefresh: function (oEvent) {
			this._oList.getBinding("items").refresh();
		},
		OnSelectionChange        : function (oEvent) {
			// Store the selected item in the Object this 	
			this._item1 = oEvent.getSource().getBindingContext().getObject();
			console.warn(this._item);
		},
		onFilter: function (oEvent) {
			var sQuery1 = oEvent.getParameter("query");
			console.warn(sQuery1);
			var oView1 = this.getView();
			var oTable1 = oView1.byId("Table");
			var oBinding1 = oTable1.getBinding("items");
			var aFilters1 = new sap.ui.model.Filter([
				new sap.ui.model.Filter("ADDRESS", sap.ui.model.FilterOperator.Contains, sQuery1),
			], false);

			oBinding1.filter(aFilters1);
		},
		onTableSettings: function (oEvent) {
			this._oDialog = sap.ui.xmlfragment("orders.orders.controller.SettingsDialog", this);
			this._oDialog.open();
		},
		onConfirm: function (oEvent) {
			var oView = this.getView();
			var oTable = oView.byId("Table");
			var mParams = oEvent.getParameters();
			var oBinding = oTable.getBinding("items");
			// apply grouping 
			var aSorters = [];
			// apply sorter 
			var sPath = mParams.sortItem.getKey();
			var bDescending = mParams.sortDescending;
			aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
			oBinding.sort(aSorters);
		},
	});
});