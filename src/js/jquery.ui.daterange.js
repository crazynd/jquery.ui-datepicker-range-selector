/**
 * Extends the ui.datepicker to select ranges instead of specific
 * dates.
 *
 * Copyright 2010, Andreas Lappe
 *
 * Depends on jquery.ui.core.js >= 1.4.2
 * Depends on jquery.ui.datepicker.js >= 1.8.5
 *
 * @author Andreas Lappe <nd@off-pist.de>
 * @version 0.0.1
 */
$(function() {
	// Disable the button first, ask questions later:
	$('#datepicker').focus(function(){
		$('.ui-datepicker-close').attr('disabled', 'disabled');
		$('#datepicker').datepicker.closeButtonEnabled = false;
		$('.ui-datepicker-close').addClass('ui-datepicker-closebutton-disabled');
	});
	// First click should always be startDate
	$.datepicker._startDateRange = true;
	$.datepicker._selectDay = function(id, month, year, td) {
		var target = $(id);
		if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
			return;
		}
		var inst = this._getInst(target[0]);
		// Determine if it's the start date or the end date we just selected.
		if($.datepicker._startDateRange) {
			// Reset the old state:
			if(inst.selectedStartElement) {
				inst.selectedStartElement.removeClass('ui-state-range ui-state-range-start');
			}
			if(inst.selectedRange) {
				$.each(inst.selectedRange, function(name, value) {
					value.removeClass('ui-state-range');
				});
			}
			if(inst.selectedEndElement) {
				inst.selectedEndElement.removeClass('ui-state-range-end ui-state-range');
				$.datepicker._deactivateCloseButton(inst);
			}

			$.datepicker._startDateRange = !$.datepicker._startDateRange;
			inst.selectedStartDate = new Date(year, month, $('a', td).html());
			inst.selectedStartElement = $('a', td);
			inst.selectedStartElement.addClass('ui-state-range ui-state-range-start');
		} else {
			// Second click, this one is the end-date! Reset the old:
			if(inst.selectedEndElement) {
				inst.selectedEndElement.removeClass('ui-state-range ui-state-range-end');
			}
			$.datepicker._activateCloseButton(inst);
			$.datepicker._startDateRange = !$.datepicker._startDateRange;
			inst.selectedEndDate = new Date(year, month, $('a', td).html());
			inst.selectedEndElement = $('a', td);
			inst.selectedEndElement.addClass('ui-state-range ui-state-range-end');
			// If endDate < startDate, switch them:
			if(inst.selectedEndDate < inst.selectedStartDate) {
				inst.selectedStartElement.removeClass('ui-state-range-start');
				inst.selectedEndElement.removeClass('ui-state-range-end');

				tmp = inst.selectedStartDate;
				inst.selectedStartDate = inst.selectedEndDate;
				inst.selectedEndDate = tmp;
				tmp = inst.selectedStartElement;
				inst.selectedStartElement = inst.selectedEndElement;
				inst.selectedEndElement = tmp;

				inst.selectedStartElement.addClass('ui-state-range-start');
				inst.selectedEndElement.addClass('ui-state-range-end');
			}
			// Now that we have a range:
			this._colorizeDateRange(inst);
		}
	};

	$.datepicker._activateCloseButton = function(inst) {
		inst.closeButtonEnabled = true;
		$('.ui-datepicker-close').removeAttr('disabled');
		$('.ui-datepicker-close').removeClass('ui-datepicker-closebutton-disabled');
	};
	$.datepicker._deactivateCloseButton = function(inst) {
		inst.closeButtonEnabled = false;
		$('.ui-datepicker-close').attr('disabled', 'disabled');
		$('.ui-datepicker-close').addClass('ui-datepicker-closebutton-disabled');

	};

	$.datepicker._colorizeDateRange = function(inst) {
		inst.selectedRange = [];
		// For every month displayed…
		$('#ui-datepicker-div').find('.ui-datepicker-group').each(function() {
				var daysToColorize = [];
				// check if this month is in the range we clicked
				if($.datepicker._getMonthAsNumber(inst, this) >= inst.selectedStartDate.getMonth() 
				&& $.datepicker._getMonthAsNumber(inst, this) <= inst.selectedEndDate.getMonth()) {
					var month = $.datepicker._getMonthAsNumber(inst, this);
					days = $(this).find('table.ui-datepicker-calendar td');
					$.each(days, function(index, row){
						day = $('a', row);
						// If this month contains both the StartDate and the EndDate
						if( month == inst.selectedStartDate.getMonth() && month == inst.selectedEndDate.getMonth() ) {
							if( day.html() > inst.selectedStartDate.getDate() && day.html() < inst.selectedEndDate.getDate() ) {
								day.addClass('ui-state-range');
								inst.selectedRange.push(day);
							}
						} else {
							// If this month only contains the StartDate
							if( month == inst.selectedStartDate.getMonth() ) {
								if( day.html() > inst.selectedStartDate.getDate() ) {
									day.addClass('ui-state-range');
									inst.selectedRange.push(day);
								}
							}
							// If this month only contains the EndDate
							else if( month == inst.selectedEndDate.getMonth() ) {
								if( day.html() < inst.selectedEndDate.getDate() ) {
									day.addClass('ui-state-range');
									inst.selectedRange.push(day);
								}
							}
							// If this is a month between Start and EndDate
							else if( month > inst.selectedStartDate.getMonth() && month < inst.selectedEndDate.getMonth() ) {
								day.addClass('ui-state-range');
								inst.selectedRange.push(day);
							}
						}
					});
				}
			});
	};

	// Find out the month of the given datepicker-group and return the number
	$.datepicker._getMonthAsNumber = function(inst, month) {
		monthNumber = 0;
		monthName = $(month).find('.ui-datepicker-month').html();
		$.each(inst.settings.monthNames, function(index, value) {
				if( value === monthName ) {
					monthNumber = index;
				}
			});
		return monthNumber;
	};
});
