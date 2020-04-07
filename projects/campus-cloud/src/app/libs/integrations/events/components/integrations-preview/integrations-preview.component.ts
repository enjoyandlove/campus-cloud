import { Component, OnInit, Input } from '@angular/core';

import { FORMAT } from '@campus-cloud/shared/pipes';
import { IPreviewResponse } from '../../../common/model';

@Component({
  selector: 'cp-events-integrations-preview',
  templateUrl: './integrations-preview.component.html',
  styleUrls: ['./integrations-preview.component.scss']
})
export class IntegrationsPreviewComponent implements OnInit {
  dateFormat = FORMAT.DATETIME;

  @Input() items: IPreviewResponse[];

  constructor() {}

  ngOnInit() {}
}
