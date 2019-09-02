import { Input, Output, Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-datepicker',
  templateUrl: './cp-datepicker.component.html',
  styleUrls: ['./cp-datepicker.component.scss']
})
export class CPDatePickerComponent {
  @Input() options: any;
  @Input() error: boolean;
  @Input() placeholder = '';
  @Input() clearable = false;

  @Output() dateSet = new EventEmitter<string | null>();

  constructor() {}

  onDateChange(date: string | null) {
    this.dateSet.emit(date);
  }
}
