import { AbstractControl, ValidationErrors } from '@angular/forms';
// import * as moment from 'moment';

export class DateValidator {
  //   public static dateVaidator(AC: AbstractControl) {
  //     const dateReg = /^\d{2}([./-])\d{2}\1\d{4}$/;
  //     if (AC && AC.value) {
  //       console.log(AC.value);
  //     }
  //     if (AC && AC.value && AC.value.match(dateReg)) {
  //       return { dateVaidator: true };
  //     }
  //     if (AC && AC.value && !moment(AC.value, 'DD.MM.YYYY', true).isValid()) {
  //       return { dateVaidator: true };
  //     }
  //     return null;
  //   }

  public static dateValidator(c: AbstractControl): ValidationErrors | null {
    if (c.pristine) {
      return null;
    }
    // if (c && c.value) {
    //   console.log(c.value);
    // }
    if (c.value !== undefined && c.value !== '' && c.value != null) {
      let month = null;
      let day = null;
      let year = null;
      const currentTaxYear = Number(new Date().getFullYear() - 1);
      if (c.value.length === 8) {
        month = c.value.substring(0, 2);
        day = c.value.substring(2, 4);
        year = c.value.substring(4, 8);
      }
      if (Number.isNaN(month) || Number.isNaN(day) || Number.isNaN(year)) {
        return { dateInvalid: true };
      }
      month = Number(month);
      day = Number(day);
      year = Number(year);
      if (month < 1 || month > 12) {
        // check month range
        return { dateInvalid: true };
      }
      if (day < 1 || day > 31) {
        return { dateInvalid: true };
      }
      if ((month === 4 || month === 6 || month === 9 || month === 11) && day === 31) {
        return { dateInvalid: true };
      }
      if (month === 2) {
        // check for february 29th
        const isleap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        if (day > 29 || (day === 29 && !isleap)) {
          return { dateInvalid: true };
        }
      }
      if (year > currentTaxYear) {
        return { dateYearGreaterThanTaxYear: true };
      }
    }
    return null;
  }
}
