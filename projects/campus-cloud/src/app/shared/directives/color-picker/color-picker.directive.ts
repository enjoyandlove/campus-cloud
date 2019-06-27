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

  setHSVA(h, s, v, a) {
    this.picker.setHSVA(h, s, v, a);
    this.show();
  }

  show() {
    this.picker.show();
  }

  setColor(colorString) {
    this.picker.setColor(colorString);
    this.show();
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
        opacity: false,

        interaction: {
          hex: false,
          save: true,
          input: false
        }
      },

      onSave(hsva) {
        if (_self.picker) {
          _self.changed.emit(hsva.toHEX().toString());
        }
      }
    });
  }

  ngOnInit() {
    this.initPicker();
  }
}
