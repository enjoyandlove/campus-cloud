import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ServicesService } from '../services.service';

declare var $: any;

@Component({
  selector: 'cp-services-delete',
  templateUrl: './services-delete.component.html',
  styleUrls: ['./services-delete.component.scss']
})
export class ServicesDeleteComponent implements OnInit {
  @Input() service: any;
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  constructor(
    private servicesService: ServicesService
  ) { }


  onDelete() {
    this
      .servicesService
      .deleteService(this.service.id)
      .subscribe(
        _ => {
          this.deleted.emit(this.service.id);
          $('#deleteServicesModal').modal('hide');
        });
  }

  ngOnInit() { }
}
