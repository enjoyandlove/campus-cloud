import { Component, Input } from '@angular/core';

@Component({
  selector: 'cp-form-label',
  styleUrls: ['./cp-form-label.component.scss'],
  template: `
    <ng-content></ng-content>
    <cp-char-counter
      [limit]="limit"
      class="char-counter"
      [charCount]="controlValue"
      *ngIf="controlValue?.length > limit"
    >
    </cp-char-counter>
  `
})
export class CPFormLabelComponent {
  @Input() limit = 0;
  @Input() controlValue = '';
}
