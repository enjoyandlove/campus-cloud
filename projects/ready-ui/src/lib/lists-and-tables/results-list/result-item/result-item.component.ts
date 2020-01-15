import { Input, OnInit, Component, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'ready-ui-result-item',
  templateUrl: './result-item.component.html',
  styleUrls: ['./result-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultItemComponent implements OnInit {
  _disabled = false;

  @Input()
  set disabled(disabled: string | boolean) {
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

  constructor() {}

  ngOnInit() {}

  get wrapperClasses() {
    return {
      ['content--highlight']: this.highlight
    };
  }
}
