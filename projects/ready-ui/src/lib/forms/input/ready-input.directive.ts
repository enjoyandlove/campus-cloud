import { Directive, forwardRef, HostListener, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'input[ready-ui-input], textarea[ready-ui-input]',
  host: {
    class: 'ready-ui-input'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReadyInputDirective),
      multi: true
    }
  ]
})
export class ReadyInputDirective implements ControlValueAccessor {
  constructor(public el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event) {
    this.writeValue(event.target.value);
  }

  onChange = (val: number | string) => {};

  onTouched = () => {};

  writeValue(val: number | string) {
    this.onChange(val);
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.el.nativeElement.disabled = isDisabled;
  }

  registerOnTouched(fn: any) {}
}
