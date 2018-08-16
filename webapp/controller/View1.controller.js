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
			var oView1 = this.getView();
			var oTable1 = oView1.byId("Table");
			var oBinding1 = oTable1.getBinding("items");
			var aFilters1 = new sap.ui.model.Filter([
				new sap.ui.model.Filter("DELIVERY", sap.ui.model.FilterOperator.EQ, 0)
			], true);

			oBinding1.filter(aFilters1);
		},
		// onRefresh: function (oEvent) {
		// 	this._oList.getBinding("items").refresh();
		// },
		OnSelectionChange: function (oEvent) {
			// Store the selected item in the Object this 	
			this._item = oEvent.getSource().getBindingContext().getObject();
			console.warn(this._item);
			var id_vsp = this._item["ID_VSP"];
			var date = new Date(this._item["O_DATE"]);
			// call Dialog popup
			var dialog = new sap.m.Dialog({
				title: "Добавьте новое ВСП",
				type: "Message",
				content: [new sap.ui.layout.HorizontalLayout({
					content: [
						new sap.ui.layout.VerticalLayout({
							width: "400px",
							content: [
								new sap.m.Label({
									text: "ID ВСП"
								}),
								new sap.m.Label({
									text: "Количество:"
								})
							]
						}),
						new sap.ui.layout.VerticalLayout({
							width: "400px",

							content: [
								new sap.m.Input("VSP_ID", {
									value: id_vsp,
									editable: false
								}),
								new sap.m.Input("QUANTITY"),
							]
						})
					]
				})],
				beginButton: new sap.m.Button({
					text: "Save",
					press: function () {
						// Read the Values from the PopUp
						var vsp_ID = sap.ui.getCore().byId("VSP_ID").getValue();
						var quantity = sap.ui.getCore().byId("QUANTITY").getValue();

						// Create a new Object with the new data 
						var oObject = {};
						var oObject2 = {};

						var TodayDate = new Date();
						oObject = {
							"ID_VSP": vsp_ID,
							"ID_MATERIAL": 1,
							"DATE": TodayDate,
							"DEB_KRE": "S",
							"QUANTITY": quantity
						};

						function twoDigits(d) {
							if (0 <= d && d < 10) return "0" + d.toString();
							if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
							return d.toString();
						}

						Date.prototype.toMysqlFormat = function () {
							return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + "T" +
								"00" + ":" + "00" + ":" + "00.0000000";
						};

						var oDate = new Date(date).toMysqlFormat();
						console.warn(oDate);

						oObject2 = {
							"QUANTITY": "4",
							"QUANTITY_FACT": quantity,
							"DELIVERY": "1"
						};
						// Service URL
						// Create the Model for the service
						// Add the new Object into the EntitySet
						var sServiceUrl = "/iot/iot/iot.xsodata/";
						var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, {
							json: true,
							useBatch: false,
							defaultBindingMode: "TwoWay"
						});

						oModel.create("/IOT_ITEM", oObject);
						oModel.update("/IOT_ORDER(ID_VSP=" + vsp_ID + ",O_DATE=datetime'" + oDate + "')", oObject2);
						// Refresh the Model
						oModel.setRefreshAfterChange(false);
						// Close the popup
						dialog.close();
					}
				}),
				endButton: new sap.m.Button({
					text: "Cancel",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
					var oView1 = this.getView();
					var oTable1 = oView1.byId("Table");
					var oBinding1 = oTable1.getBinding("items");
					var aFilters1 = new sap.ui.model.Filter([
						new sap.ui.model.Filter("DELIVERY", sap.ui.model.FilterOperator.EQ, 0)
					], true);

					oBinding1.filter(aFilters1);
				}
			});
			dialog.open();
		},
		onFilter: function (oEvent) {
			var sQuery1 = oEvent.getParameter("query");
			console.warn(sQuery1);
			var oView1 = this.getView();
			var oTable1 = oView1.byId("Table");
			var oBinding1 = oTable1.getBinding("items");
			var aFilters1 = new sap.ui.model.Filter([
				new sap.ui.model.Filter("ADDRESS", sap.ui.model.FilterOperator.Contains, sQuery1),
				new sap.ui.model.Filter("DELIVERY", sap.ui.model.FilterOperator.EQ, 0)
			], true);

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