/**
 * https://chmln.github.io/flatpickr/
 * In order to keep components clean we created
 * a new component and add its own logic here
 *
 * TODO:
 * Improve...
 */
import {
  Input,
  OnInit,
  Component,
  ViewChild,
  OnChanges,
  ElementRef,
  AfterViewInit,
  ViewEncapsulation
} from '@angular/core';

declare var $: any;

@Component({
  selector: 'cp-small-datepicker',
  templateUrl: './cp-small-datepicker.component.html',
  styleUrls: ['./cp-small-datepicker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CPSmallDatePickerComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild('input') input: ElementRef;
  @Input() options: any;
  isOpen;

  isActive;
  flatPicker;

  constructor() {
    this.flatPicker = require('flatpickr');
  }

  ngAfterViewInit() {
    this.buildPicker(this.input.nativeElement);
  }

  buildPicker(el) {
    const self = this;

    this.options = Object.assign(
      {},
      this.options,
      {
        onChange: function(dates) {
          self.isActive = dates.length === 2 ? true : false;
          self.isOpen = dates.length === 2 ? false : true;
        }
      }
    );
    $(el).flatpickr(this.options);
  }

  ngOnChanges() {
    this.isOpen = false;
    this.isActive = false;
    this.buildPicker(this.input.nativeElement);
  }

  ngOnInit() { }
}
