import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { merge, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import {
  Input,
  OnInit,
  Output,
  OnDestroy,
  ViewChild,
  Component,
  QueryList,
  TemplateRef,
  EventEmitter,
  ContentChildren,
  AfterContentInit
} from '@angular/core';

import { MenuItemComponent } from './../menu-item/menu-item.component';
@Component({
  exportAs: 'menu',
  selector: 'ready-ui-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, AfterContentInit, OnDestroy {
  @Input() public id: string;

  childrenClick$: Observable<MenuComponent>;

  @ContentChildren(MenuItemComponent, { descendants: true }) private items: QueryList<
    MenuItemComponent
  >;

  parentMenu: MenuComponent | undefined;

  @Output()
  closed: EventEmitter<string | null> = new EventEmitter();

  @ViewChild(TemplateRef, { static: true }) public template: TemplateRef<any>;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this.closed.complete();
  }

  ngAfterContentInit() {
    this.childrenClick$ = merge(...this.items.map(({ itemClick }) => itemClick)).pipe(mapTo(this));
  }
}
