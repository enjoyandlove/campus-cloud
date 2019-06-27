import { FormControl } from '@angular/forms';

import { LocationModel, IDining } from './';

export class DiningModel {
  static form(dining?: IDining) {
    const diningForm = LocationModel.form(dining);
    const notes = dining ? dining.notes : null;

    diningForm.addControl('notes', new FormControl(notes));

    return diningForm;
  }
}
