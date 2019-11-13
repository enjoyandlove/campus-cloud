import { Input, Output, Component, EventEmitter, ViewChild } from '@angular/core';

import { CPDatePickerDirective } from './../../directives/cp-date-picker';
@Component({
  selector: 'cp-datepicker',
  templateUrl: './cp-datepicker.component.html',
  styleUrls: ['./cp-datepicker.component.scss']
})
export class CPDatePickerComponent {
  @ViewChild(CPDatePickerDirective, { static: true }) private picker: CPDatePickerDirective;

  @Input() options: any;
  @Input()
  set error(error: boolean) {
    const el: HTMLInputElement = (this.picker as any).el.nativeElement.nextElementSibling;

    if (!el) {
      return;
    }

    if (error) {
      el.classList.add('error');
    } else {
      el.classList.remove('error');
    }
  }
  @Input() placeholder = '';
  @Input() clearable = false;

  @Output() dateSet = new EventEmitter<string | null>();

  constructor() {}

  clearDate() {
    this.picker.clear();
  }

  onDateChange(date: string | null) {
    this.dateSet.emit(date);
  }
}
