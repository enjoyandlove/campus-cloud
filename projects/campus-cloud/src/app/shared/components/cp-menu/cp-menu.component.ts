import {
  AfterContentInit,
  ContentChildren,
  AfterViewInit,
  ElementRef,
  Component,
  QueryList,
  ViewChild,
  Input
} from '@angular/core';

import { CPMenuItemComponent } from './cp-menu-item';

@Component({
  selector: 'cp-menu',
  templateUrl: './cp-menu.component.html',
  styleUrls: ['./cp-menu.component.scss']
})
export class CPMenuComponent implements AfterViewInit, AfterContentInit {
  @ViewChild('menuButton', { static: true }) button: ElementRef;
  @ContentChildren(CPMenuItemComponent) items: QueryList<CPMenuItemComponent>;

  @Input() icon = 'expand_more';
  @Input()
  buttonClass = 'cpbtn cpbtn--square-left cpbtn--no-padding cpbtn--primary hover';

  visible = false;
  disabled = false;
  leftPosition = 0;

  ngAfterViewInit() {
    this.leftPosition = this.button.nativeElement.clientWidth - 200;
  }

  ngAfterContentInit() {
    this.disabled = this.items.length === 0;
  }
}
