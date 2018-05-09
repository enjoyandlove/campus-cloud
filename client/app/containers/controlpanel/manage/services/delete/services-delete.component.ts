import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ServicesService } from '../services.service';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

declare var $: any;

@Component({
  selector: 'cp-services-delete',
  templateUrl: './services-delete.component.html',
  styleUrls: ['./services-delete.component.scss']
})
export class ServicesDeleteComponent implements OnInit {
  @Input() service: any;
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  buttonData;

  constructor(private cpI18n: CPI18nService, private servicesService: ServicesService) {}

  onDelete() {
    this.servicesService.deleteService(this.service.id).subscribe((_) => {
      this.deleted.emit(this.service.id);
      $('#deleteServicesModal').modal('hide');
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
    });
  }

  ngOnInit() {
    this.buttonData = {
      class: 'danger',
      text: this.cpI18n.translate('delete')
    };
  }
}
