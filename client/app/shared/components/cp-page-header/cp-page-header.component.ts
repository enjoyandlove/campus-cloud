import { Component, OnInit, Input } from '@angular/core';

interface IData {
  'heading': string;
  'subheading'?: string;
  'em'?: string;
  'children': [
    {
      'label': string
      'url': string
    }
  ];
}

@Component({
  selector: 'cp-page-header',
  templateUrl: './cp-page-header.component.html',
  styleUrls: ['./cp-page-header.component.scss']
})
export class CPPageHeaderComponent implements OnInit {
  @Input() data: IData;

  constructor() { }

  ngOnInit() {
  }
}
