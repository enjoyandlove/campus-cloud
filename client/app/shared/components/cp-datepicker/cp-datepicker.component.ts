/**
 * https://chmln.github.io/flatpickr/
 */
import {
  Input,
  OnInit,
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ViewEncapsulation
} from '@angular/core';


export const INPUT_THEME = {
  'SMALL': 'small'
};

declare var $: any;

@Component({
  selector: 'cp-datepicker',
  templateUrl: './cp-datepicker.component.html',
  styleUrls: ['./cp-datepicker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CPDatePickerComponent implements AfterViewInit, OnInit {
  @ViewChild('input') input: ElementRef;
  @Input() options: any;
  @Input() theme: string;
  flatPicker;

  constructor() {
    this.flatPicker = require('flatpickr');
  }

  ngAfterViewInit() {
    const el = this.input.nativeElement;

    $(el).flatpickr(this.options);
  }

  ngOnInit() { }
}
