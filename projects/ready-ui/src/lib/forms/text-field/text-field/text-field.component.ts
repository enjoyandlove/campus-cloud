import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { Input, Component, OnInit, TemplateRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextUniqueId = 0;

@Component({
  selector: 'ready-ui-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFieldComponent),
      multi: true
    }
  ]
})
export class TextFieldComponent implements OnInit, ControlValueAccessor {
  _type = 'text';
  _textArea = false;
  _disabled = false;
  _readonly = false;
  _maxLength: number;
  _showCounter = false;
  _value: string | number;
  _id = `text-field-${nextUniqueId++}`;

  @Input()
  set id(id: string) {
    this._id = id;
  }

  @Input()
  popOverTmpl: TemplateRef<any>;

  @Input()
  ariaLabelledBy: string;

  @Input()
  set textAreaElement(textAreaElement: string | boolean) {
    this._textArea = coerceBooleanProperty(textAreaElement);
  }

  @Input()
  set disabled(disabled: boolean | string) {
    this._disabled = coerceBooleanProperty(disabled);
  }

  @Input()
  set readonly(readonly: string | boolean) {
    this._readonly = coerceBooleanProperty(readonly);
  }

  @Input()
  set type(type: string) {
    this._type = type;
  }

  @Input()
  prefix: TemplateRef<any>;

  @Input()
  suffix: TemplateRef<any>;

  @Input()
  helpText: string;

  @Input()
  errorMessage: string;

  @Input()
  label: string;

  @Input()
  set maxLength(maxLength: number | string) {
    this._maxLength = coerceNumberProperty(maxLength);
    this._showCounter = Number(maxLength) > 0;
  }

  get count() {
    return this._value ? String(this._value).length : 0;
  }

  constructor() {}

  get inputStyles() {
    return {
      'with-error': this.errorMessage && this.errorMessage.length > 0
    };
  }

  ngOnInit() {}

  onChange = (val: string) => {};

  onTouched = () => {};

  writeValue(val: string) {
    this._value = val;
    this.onChange(val);
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }
}
