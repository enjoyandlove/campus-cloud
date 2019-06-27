import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CPI18nService } from './../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-audience-custom',
  templateUrl: './audience-custom.component.html',
  styleUrls: ['./audience-custom.component.scss']
})
export class AudienceCustomComponent implements OnInit {
  @Input() message: string;
  @Input() importButton = true;
  @Input() withChips: Array<any>;

  @Output() importClick: EventEmitter<null> = new EventEmitter();
  @Output() users: EventEmitter<Array<number>> = new EventEmitter();

  constructor(public cpI18n: CPI18nService) {}

  ngOnInit(): void {}
}
