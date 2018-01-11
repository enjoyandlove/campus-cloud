import { Component, Input, OnInit } from '@angular/core';
import { CPI18nService } from '../../services';
import { FORMAT } from '../../pipes/date';
import {
  EventUtilService
} from '../../../containers/controlpanel/manage/events/events.utils.service';

@Component({
  selector: 'cp-info',
  templateUrl: './cp-info.component.html',
  styleUrls: ['./cp-info.component.scss'],
})
export class CPInfoComponent implements OnInit {
  @Input() data;

  dateFormat: any;

  constructor(public cpI18n: CPI18nService, public utils: EventUtilService) {}

  ngOnInit() {
     this.dateFormat = FORMAT.DATETIME;
  }
}
