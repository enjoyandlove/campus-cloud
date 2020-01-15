/* tslint:disable:component-selector */
import {
  Input,
  Output,
  OnInit,
  Component,
  HostBinding,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { ElementRef } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'td[ui-table-cell], th[ui-table-cell]',
  template: `
    <div class="wrapper" [ngClass]="wrapperClassess">
      <ng-content></ng-content>

      <button ui-button variant="inline" (click)="handleSort()" *ngIf="_sorting">
        <ready-ui-icon
          size="small"
          [name]="sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'"
        ></ready-ui-icon>
      </button>
    </div>
  `,
  styleUrls: ['./table-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableCellComponent implements OnInit {
  _sorting = false;

  @Input()
  set sorting(sorting: boolean | string) {
    this._sorting = coerceBooleanProperty(sorting);
  }

  @Input()
  sortDirection: 'asc' | 'desc' = 'desc';

  @Input()
  align: 'left' | 'center' | 'right' = 'left';

  @Output()
  sort: EventEmitter<'asc' | 'desc'> = new EventEmitter();

  constructor(private el: ElementRef) {}

  @HostBinding('class.header')
  get isThElement() {
    const el: HTMLElement = this.el.nativeElement;
    return el.localName.toLocaleLowerCase() === 'th';
  }

  get wrapperClassess() {
    return {
      [`align-${this.align}`]: true
    };
  }

  ngOnInit() {}

  handleSort() {
    this.toggleSortDirection();
    this.sort.emit(this.sortDirection);
  }

  private toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }
}
