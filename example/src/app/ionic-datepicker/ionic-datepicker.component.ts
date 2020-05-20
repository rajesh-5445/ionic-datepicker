import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-ionic-datepicker',
  templateUrl: './ionic-datepicker.component.html',
  styleUrls: ['./ionic-datepicker.component.scss'],
})

export class IonicDatepickerComponent implements OnInit {
  //TODO: config value
  readonly DURATION_IN_DAYS = 90;
  readonly DAY_LIST = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  readonly COMPLETE_DATE_FORMAT = 'DD-MM-YYYY';
  readonly MONTH_FORMAT = 'MM-YYYY';

  rows = [0, 7, 14, 21, 28, 35];
  cols = [0, 1, 2, 3, 4, 5, 6];
  private allDaysList: moment.Moment[];
  private daysList: moment.Moment[];
  private currentDate: moment.Moment;
  private fromDate: moment.Moment;
  private toDate: moment.Moment;
  prevMonth: moment.Moment;
  nextMonth: moment.Moment;
  currentMonth: moment.Moment;
  shouldDisablePrevMonth: boolean;
  shouldDisableNextMonth: boolean;

  constructor(
    public viewCtrl: ModalController
  ) {
  }

  ngOnInit() {
    this.currentDate = moment();
    this.fromDate = moment().startOf('months');
    this.toDate = moment().add(3, 'months').endOf('months');
    this.prevMonth = moment().subtract(1, 'months').startOf('months');
    this.nextMonth = moment().add(1, 'months').startOf('months');
    this.currentMonth = moment().startOf('months');
    this.shouldDisablePrevMonth = (this.currentDate.diff(this.fromDate, 'months') > 0) ? false : true;
    this.shouldDisableNextMonth = (this.toDate.diff(this.currentDate, 'months') > 0) ? false : true;
    this.initAllDays();
    this.updateDays();
  }

  /**
  * Initialize all days list, starts from the current month till next 90 days
  * @returns void
  */
  private initAllDays(): void {
    // Add all days between the from and to date
    this.allDaysList = new Array();
    let date = moment(this.fromDate.format(this.COMPLETE_DATE_FORMAT), this.COMPLETE_DATE_FORMAT);
    let diffDays = this.toDate.diff(this.fromDate, 'days');
    while (diffDays >= 0) {
      this.allDaysList.push(date);
      date = moment(date.format(this.COMPLETE_DATE_FORMAT), this.COMPLETE_DATE_FORMAT);
      date.add(1, 'days');
      diffDays--;
    }
  }

  /**
   * Initialize days list, only for the current month 
   * @returns void
   */
  private updateDays(): void {
    this.daysList = new Array();
    this.allDaysList.forEach(day => {
      if (this.currentMonth.format(this.MONTH_FORMAT) === day.format(this.MONTH_FORMAT)) {
        let startDate = moment(day.format(this.MONTH_FORMAT), this.MONTH_FORMAT).startOf('months');
        let endDate = moment(day.format(this.MONTH_FORMAT), this.MONTH_FORMAT).endOf('months');

        if (startDate.format(this.COMPLETE_DATE_FORMAT) === day.format(this.COMPLETE_DATE_FORMAT)) {

          // Offset the from date based on the locale day of the week
          let localeDayOfTheWeek = Number(startDate.format('e'));
          while (localeDayOfTheWeek > 0) {
            this.daysList.push(null);
            localeDayOfTheWeek--;
          }
          this.daysList.push(day);
        } else if (endDate.format(this.COMPLETE_DATE_FORMAT) === day.format(this.COMPLETE_DATE_FORMAT)) {

          // Offset the end date based on the locale day of the week
          this.daysList.push(day);
          let localeDayOfTheWeek = Number(endDate.format('e'));
          while (localeDayOfTheWeek < 6) {
            this.daysList.push(null);
            localeDayOfTheWeek++;
          }
        } else {
          this.daysList.push(day);
        }
      }
    });
  }

  /**
   * Show the previous month, based on the current month being 
   * displayed
   */
  showPrevMonth(): void {
    let date = moment(this.currentMonth.format(this.COMPLETE_DATE_FORMAT), this.COMPLETE_DATE_FORMAT);

    this.prevMonth = moment(date.format(this.COMPLETE_DATE_FORMAT), this.COMPLETE_DATE_FORMAT).subtract(2, 'months');
    this.nextMonth = moment(date.format(this.COMPLETE_DATE_FORMAT), this.COMPLETE_DATE_FORMAT);
    this.currentMonth = moment(date.format(this.COMPLETE_DATE_FORMAT), this.COMPLETE_DATE_FORMAT).subtract(1, 'months');

    this.shouldDisablePrevMonth = (this.currentMonth.diff(this.fromDate, 'months') > 0) ? false : true;
    this.shouldDisableNextMonth = (this.toDate.diff(this.currentMonth, 'months') > 0) ? false : true;

    this.updateDays();
  }

  /**
   * Show the next month, based on the current month being 
   * displayed
   */
  showNextMonth(): void {
    let date = moment(this.currentMonth.format(this.COMPLETE_DATE_FORMAT), this.COMPLETE_DATE_FORMAT);

    this.prevMonth = moment(date.format(this.COMPLETE_DATE_FORMAT), this.COMPLETE_DATE_FORMAT);
    this.nextMonth = moment(date.format(this.COMPLETE_DATE_FORMAT), this.COMPLETE_DATE_FORMAT).add(2, 'months');
    this.currentMonth = moment(date.format(this.COMPLETE_DATE_FORMAT), this.COMPLETE_DATE_FORMAT).add(1, 'months');

    this.shouldDisablePrevMonth = (this.currentMonth.diff(this.fromDate, 'months') > 0) ? false : true;
    this.shouldDisableNextMonth = (this.toDate.diff(this.currentMonth, 'months') > 0) ? false : true;

    this.updateDays();
  }

  /**
   * Returns true if the day is a weekend
   * @param date, an instance of moment obj
   * @returns boolean, being true if the date is a weekend
   */
  isDisabled(date: moment.Moment): boolean {
    const localeOfTheWeek = Number(date.format('e'));
    const lastDate = moment(this.currentDate.format(this.COMPLETE_DATE_FORMAT), this.COMPLETE_DATE_FORMAT).add(this.DURATION_IN_DAYS, 'days');
    if (date.isBefore(this.currentDate) || date.isAfter(lastDate)) {
      return true;
    } else if (localeOfTheWeek === 5 || localeOfTheWeek === 6) {
      return true;
    }

    return false;
  }

  /**
   * Dismiss model and return the selected date
   * @param date, an instance of moment
   */
  dateSelected(date: moment.Moment): void {
    this.viewCtrl.dismiss({
      selectedDate: date.format('DD-MM-YYYY')
    });
  }

}
