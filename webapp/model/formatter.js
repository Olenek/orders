sap.ui.define([], function (DateFormatter) {
	"use strict";
	return {
		calcProfit: function (Date) {
			var startDate = Date.getDateValue();
			var oDate = new Date();
			var diff = Math.abs(startDate.getTime() - endDate.getTime());
			var diffD = Math.ceil(diff / (1000 * 60 * 60 * 24));
			return (diffD);
		}
	};
});