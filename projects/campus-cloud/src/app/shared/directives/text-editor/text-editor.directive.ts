import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Quill from 'quill';
import {
  OnInit,
  Input,
  Output,
  Directive,
  OnDestroy,
  ElementRef,
  EventEmitter
} from '@angular/core';

@Directive({
  selector: '[cpTextEditor]',
  exportAs: 'textEditor',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TextEditorDirective,
      multi: true
    }
  ]
})
export class TextEditorDirective implements OnInit, OnDestroy, ControlValueAccessor {
  onChange;
  value: string;
  _theme = 'snow';
  _toolbar = null;
  _readOnly = false;
  _placeHolder = '';

  @Input()
  set placeholder(placeholder: string) {
    this._placeHolder = placeholder;
  }

  @Input()
  set theme(theme: 'snow' | 'bubble') {
    this._theme = theme;
  }

  @Input()
  set readonly(readonly: string | boolean) {
    this._readOnly = readonly !== undefined && readonly === false;
  }

  @Input()
  set toolbar(toolbar: Array<Array<string>>) {
    // https://quilljs.com/docs/modules/toolbar/
    this._toolbar = toolbar;
  }

  @Output() textChange: EventEmitter<any> = new EventEmitter();

  instance: Quill;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.instance = new Quill(this.el.nativeElement, {
      theme: this._theme,
      placeholder: this._placeHolder,
      readOnly: this._readOnly,
      modules: {
        toolbar: this._toolbar
      }
    });

    this.instance.on('text-change', this.onTextChange.bind(this));
  }

  ngOnDestroy() {
    this.instance.off('text-change', this.onTextChange.bind(this));
  }

  writeValue(value: string) {
    this.value = value;
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched() {}

  clear() {
    this.instance.setText('');
  }

  private onTextChange() {
    this.onChange(this.instance.getText().trim());
  }
}
