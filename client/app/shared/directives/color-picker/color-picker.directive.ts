import { Directive, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import * as Picker from 'pickr-widget';

@Directive({
  selector: '[cpColorPicker]'
})
export class CPColorPickerDirective implements OnInit {
  @Input() defaultColor = 'ffffff';
  @Input() postion: 'top' | 'middle' | 'left' = 'top';

  @Output() changed: EventEmitter<string> = new EventEmitter();

  picker: Picker;

  constructor(public el: ElementRef) {}

  onSave(hexColor) {
    this.changed.emit(hexColor);
  }

  setHSVA(hsvaColorStr) {
    this.picker.setHSVA(hsvaColorStr);
  }

  initPicker() {
    const _self = this;
    this.picker = new Picker({
      el: this.el.nativeElement,

      defaultRepresentation: 'HEX',

      position: this.postion,

      default: `#${this.defaultColor}`,

      components: {
        hue: true,
        opacity: true,

        output: {
          hex: true,
          input: true
        }
      },

      onSave(hsva) {
        _self.onSave(hsva.toHEX().toString());
      }
    });
  }

  ngOnInit() {
    this.initPicker();
  }
}
