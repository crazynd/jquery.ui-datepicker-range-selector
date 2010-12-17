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
		// Determine if it's the start date or the end date
		// we just selected.
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
			// Second click, this one is the end-date!
			// Reset the old:
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
		// Find out which month is which:
		firstMonth = $('.ui-datepicker-month', '.ui-datepicker-group-first').html();
		lastMonth = $('.ui-datepicker-month', '.ui-datepicker-group-last').html();
		firstMonthNumber = $.datepicker._convertFromMonthNameToNumber(inst, firstMonth);
		lastMonthNumber = $.datepicker._convertFromMonthNameToNumber(inst, lastMonth);

		start = inst.selectedStartDate;
		end = inst.selectedEndDate;
		inst.selectedRange = [];

		if(! inst.selectedStartDate > inst.selectedEndDate) {
			tmp = start;
			start = end;
			end = tmp;
		}

		// Both dates are in first month
		if(start.getMonth() === firstMonthNumber && end.getMonth() === firstMonthNumber) {
			allDays = $('div.ui-datepicker-group-first table.ui-datepicker-calendar td');
			$.each(allDays, function(index, row){
				day = $('a', row);
				if( day.html() > start.getDate() && day.html() < end.getDate() ) {
					day.addClass('ui-state-range');
					inst.selectedRange.push(day);
				}
			});
		}
		// Both dates are in the last month
		if(start.getMonth() === lastMonthNumber && end.getMonth() === lastMonthNumber) {
			allDays = $('div.ui-datepicker-group-last table.ui-datepicker-calendar td');
			$.each(allDays, function(index, row){
					day = $('a', row);
					if( day.html() > start.getDate() && day.html() < end.getDate() ) {
						day.addClass('ui-state-range');
						inst.selectedRange.push(day);
					}
				});
		}
		// Both dates are in seperate months
		if(start.getMonth() === firstMonthNumber && end.getMonth() === lastMonthNumber) {
			firstMonthDays = $('div.ui-datepicker-group-first table.ui-datepicker-calendar td');
			lastMonthDays = $('div.ui-datepicker-group-last table.ui-datepicker-calendar td');
			$.each(firstMonthDays, function(index, row){
					day = $('a', row);
					if( day.html() > start.getDate() ) {
						day.addClass('ui-state-range');
						inst.selectedRange.push(day);
					}
				});
			$.each(lastMonthDays, function(index, row){
					day = $('a', row);
					if( day.html() < end.getDate() ) {
						day.addClass('ui-state-range');
						inst.selectedRange.push(day);
					}
				});

		}
	};

	// We have to convert to a number to find out where we are.
	$.datepicker._convertFromMonthNameToNumber = function(inst, name) {
		monthNumber = 0;
		$.each(inst.settings.monthNames, function(index, value) {
				if( value === name ) {
					monthNumber = index;
				}
			});
		return monthNumber;
	};
});
