import {
  Input,
  OnInit,
  Component,
  ElementRef,
  TemplateRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusableOption } from '@angular/cdk/a11y';

@Component({
  selector: 'ready-ui-result-item',
  templateUrl: './result-item.component.html',
  styleUrls: ['./result-item.component.scss'],
  host: { tabindex: '-1' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultItemComponent implements OnInit, FocusableOption {
  _disabled = false;

  @Input()
  label: string;

  @Input()
  set disabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
  }

  @Input()
  highlight: boolean;

  @Input()
  context: { [key: string]: any };

  @Input()
  prefix: TemplateRef<any>;

  @Input()
  suffix: TemplateRef<any>;

  get wrapperClasses() {
    return {
      ['content--highlight']: this.highlight
    };
  }

  constructor(private el: ElementRef) {}

  ngOnInit() {}

  getLabel(): string {
    return this.label;
  }

  focus(): void {
    this.el.nativeElement.focus();
  }
}
