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
  Output,
  Component,
  ViewChild,
  OnChanges,
  ElementRef,
  EventEmitter,
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
  @Output() rangeChange: EventEmitter<string[]> = new EventEmitter();
  @ViewChild('input') input: ElementRef;
  @Input() options: any;

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
          if (dates.length === 2) {
            self.isActive = true;
            self.rangeChange.emit(dates);
            return;
          }
          self.isActive = false;
        }
      }
    );
    $(el).flatpickr(this.options);
  }

  ngOnChanges() {
    this.isActive = false;
    this.buildPicker(this.input.nativeElement);
  }

  ngOnInit() { }
}
