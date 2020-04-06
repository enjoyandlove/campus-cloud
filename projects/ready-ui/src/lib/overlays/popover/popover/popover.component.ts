import {
  OnInit,
  Component,
  ViewChild,
  TemplateRef,
  ContentChild,
  AfterContentInit
} from '@angular/core';

import { PopoverTriggerDirective } from './../popover-trigger.directive';

@Component({
  selector: 'ready-ui-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class PopoverComponent implements OnInit, AfterContentInit {
  @ContentChild(PopoverTriggerDirective)
  private popoverTrigger: PopoverTriggerDirective;

  @ViewChild('popoverBody', { static: true }) private popoverBody: TemplateRef<any>;
  constructor() {}

  ngOnInit() {}

  onBodyClick() {
    this.popoverTrigger.close();
  }

  ngAfterContentInit() {
    this.popoverTrigger.uiPopoverTpl = this.popoverBody;
  }
}
