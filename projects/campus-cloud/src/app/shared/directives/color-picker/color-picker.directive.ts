import { Directive, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import Pickr from '@simonwep/pickr';

@Directive({
  selector: '[cpColorPicker]'
})
export class CPColorPickerDirective implements OnInit {
  @Input() defaultColor = 'ffffff';
  @Input() postion: 'top' | 'middle' | 'left' = 'top';

  @Output() changed: EventEmitter<string> = new EventEmitter();

  picker: Pickr;

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
    this.picker = Pickr.create({
      theme: 'classic',
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
      }
    });

    this.picker.on('save', (hsva) => {
      this.changed.emit(hsva.toHEXA().join(''));
    });
  }

  ngOnInit() {
    this.initPicker();
  }
}
