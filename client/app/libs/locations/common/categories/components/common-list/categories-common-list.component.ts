import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TooltipOption } from 'bootstrap';
import { Observable } from 'rxjs';

import { ICategory } from '@libs/locations/common/categories/model';

@Component({
  selector: 'cp-categories-common-list',
  templateUrl: './categories-common-list.component.html',
  styleUrls: ['./categories-common-list.component.scss']
})
export class CategoriesCommonListComponent implements OnInit {
  @Input() sortBy: string;
  @Input() sortDirection: string;
  @Input() categories$: Observable<ICategory[]>;

  @Output() doSort: EventEmitter<string> = new EventEmitter();
  @Output() editClick: EventEmitter<ICategory> = new EventEmitter();
  @Output() deleteClick: EventEmitter<ICategory> = new EventEmitter();

  tooltipOptions: TooltipOption = {
    placement: 'left'
  };

  ngOnInit() {}
}

