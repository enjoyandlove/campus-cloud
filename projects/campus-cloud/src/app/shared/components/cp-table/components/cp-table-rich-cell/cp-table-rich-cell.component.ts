/* tslint:disable:no-host-metadata-property */
import {
  Input,
  OnInit,
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'cp-table-rich-cell',
  templateUrl: './cp-table-rich-cell.component.html',
  styleUrls: ['./cp-table-rich-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cp-table-rich-cell'
  }
})
export class CPTableRichCellComponent implements OnInit {
  @Input()
  imgSrc: string;

  @Input()
  subheading: string;

  constructor() {}

  ngOnInit() {}
}
