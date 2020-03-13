/*tslint:disable:directive-selector*/
import { ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive } from '@angular/core';
import { OnInit } from '@angular/core';

import Pickr from '@simonwep/pickr';

@Directive({
  selector: '[ready-ui-color-picker]'
})
export class ColorPickerDirective implements OnInit {
  constructor(private element: ElementRef) {}
  _pickr: Pickr;

  _hue = true;
  _preview = true;
  _opacity = false;

  _save = true;
  _hex = true;
  _rgba = false;
  _hsla = false;
  _hsva = false;
  _cmyk = false;
  _input = true;
  _clear = false;

  @Output()
  pickr: EventEmitter<any> = new EventEmitter();

  @Input()
  events: string[];

  @Input()
  default = '#000000';

  @Input()
  appClass = 'ready-ui-color-picker';

  @Input()
  swatches: string[];

  @Input()
  // nano, classic, monolith
  theme = 'classic';

  @Input()
  position = 'bottom-end';

  @Input()
  set save(save: string | boolean) {
    this._save = coerceBooleanProperty(save);
  }

  @Input()
  set hex(hex: string | boolean) {
    this._hex = coerceBooleanProperty(hex);
  }

  @Input()
  set hsla(_hsla: string | boolean) {
    this._hsla = coerceBooleanProperty(_hsla);
  }

  @Input()
  set hsva(hsva: string | boolean) {
    this._hsva = coerceBooleanProperty(hsva);
  }

  @Input()
  set rgba(_rgba: string | boolean) {
    this._rgba = coerceBooleanProperty(_rgba);
  }

  @Input()
  set cmyk(cmyk: string | boolean) {
    this._cmyk = coerceBooleanProperty(cmyk);
  }

  @Input()
  set input(input: string | boolean) {
    this._input = coerceBooleanProperty(input);
  }

  @Input()
  set clear(clear: string | boolean) {
    this._clear = coerceBooleanProperty(clear);
  }

  @Input()
  set hue(hue: string | boolean) {
    this._hue = coerceBooleanProperty(hue);
  }

  @Input()
  set preview(preview: string | boolean) {
    this._preview = coerceBooleanProperty(preview);
  }

  @Input()
  set opacity(opacity: string | boolean) {
    this._opacity = coerceBooleanProperty(opacity);
  }

  get instance() {
    return this._pickr;
  }

  ngOnInit() {
    const pickr = Pickr.create({
      el: this.element.nativeElement,

      theme: this.theme,

      appClass: this.appClass,

      adjustableNumbers: false,

      position: this.position,

      swatches: this.swatches,

      default: this.default,

      lockOpacity: true,

      components: {
        // Main components
        hue: this._hue,
        preview: this._preview,
        opacity: this._opacity,

        // Input / output Options
        interaction: {
          hex: this._hex,
          rgba: this._rgba,
          hsla: this._hsla,
          hsva: this._hsva,
          cmyk: this._cmyk,
          input: this._input,
          clear: this._clear,
          save: this._save
        }
      }
    });

    this.events.forEach((e: string) => {
      pickr.on(e, (...args) => {
        this.pickr.emit({ event: e, args });
      });
    });

    this._pickr = pickr;
  }
}
