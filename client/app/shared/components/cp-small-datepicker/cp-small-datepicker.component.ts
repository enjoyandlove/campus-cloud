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
  HostListener,
  EventEmitter,
  AfterViewInit,
  ViewEncapsulation
} from '@angular/core';

require('flatpickr');

declare var $: any;

@Component({
  selector: 'cp-small-datepicker',
  templateUrl: './cp-small-datepicker.component.html',
  styleUrls: ['./cp-small-datepicker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CPSmallDatePickerComponent implements AfterViewInit, OnInit, OnChanges {
  @Input() options: any;
  @ViewChild('input') input: ElementRef;
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() rangeChange: EventEmitter<string[]> = new EventEmitter();

  flatPickerInstance = null;

  constructor(
    private el: ElementRef
  ) { }

  @HostListener('document:click', ['$event'])
  onClick(event) {
    if (event.target.contains(this.el.nativeElement)) {
      if (this.flatPickerInstance.selectedDates.length === 1) {
        this.reset.emit();
        this.flatPickerInstance.clear();
      }
    }
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
            self.rangeChange.emit(dates);
            return;
          }
        }
      }
    );

    this.flatPickerInstance = $(el).flatpickr(this.options);
  }

  ngOnChanges() {
    this.buildPicker(this.input.nativeElement);
  }

  ngOnInit() { }
}
