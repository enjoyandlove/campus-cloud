import {
  Input,
  OnInit,
  Component,
  HostBinding,
  TemplateRef,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'ready-ui-menu-section',
  templateUrl: './menu-section.component.html',
  styleUrls: ['./menu-section.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuSectionComponent implements OnInit {
  @HostBinding('class.ready-ui-menu-section')
  @Input()
  name: string;

  @Input()
  headerTpl: TemplateRef<any>;

  constructor() {}

  ngOnInit() {}
}
