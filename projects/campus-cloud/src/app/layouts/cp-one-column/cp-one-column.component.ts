import { Component, OnInit, Input } from '@angular/core';

import { WidthToClassPipe } from '@app/layouts/pipes';
import { LayoutWidth, LayoutAlign } from '@app/layouts/interfaces';

@Component({
  selector: 'cp-one-column',
  templateUrl: './cp-one-column.component.html',
  styleUrls: ['./cp-one-column.component.scss']
})
export class LayoutOneColumnComponent implements OnInit {
  @Input() width: LayoutWidth.full | LayoutWidth.half | LayoutWidth.fourth = LayoutWidth.full;
  @Input() aligned: LayoutAlign.start | LayoutAlign.end | LayoutAlign.center = LayoutAlign.center;

  _width;

  constructor() {}

  ngOnInit() {
    this._width = new WidthToClassPipe().transform(this.width);
  }
}
