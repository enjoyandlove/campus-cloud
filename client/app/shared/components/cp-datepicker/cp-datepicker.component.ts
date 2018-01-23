import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
/**
 * https://chmln.github.io/flatpickr/
 */

declare var $: any;

@Component({
  selector: 'cp-datepicker',
  templateUrl: './cp-datepicker.component.html',
  styleUrls: ['./cp-datepicker.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CPDatePickerComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild('input') input: ElementRef;
  @Input() error: boolean;
  @Input() options: any;
  flatPicker;
  el;

  constructor() {
    this.flatPicker = require('flatpickr');
  }

  ngAfterViewInit() {
    const el = this.input.nativeElement;

    this.el = $(el).flatpickr(this.options);
  }

  toggleTime() {
    this.el.set('dateFormat', this.options.dateFormat);
    this.el.set('enableTime', this.options.enableTime);
  }

  ngOnChanges() {
    if (this.el) {
      if (this.el.config.enableTime !== this.options.enableTime) {
        this.toggleTime();
      }

      if (this.error) {
        this.el.altInput.classList.add('error');

        return;
      }
      this.el.altInput.classList.remove('error');
    }
  }

  ngOnInit() {}
}
