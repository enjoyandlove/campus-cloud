import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { ProvidersService } from '../../../providers.service';

declare var $: any;

@Component({
  selector: 'cp-providers-delete',
  templateUrl: './providers-delete.component.html',
  styleUrls: ['./providers-delete.component.scss']
})
export class ServicesProviderDeleteComponent {
  @Input() provider: any;
  @Input() serviceId: number;
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  constructor(private providersService: ProvidersService) {}

  onDelete() {
    const search = new HttpParams();
    search.append('service_id', this.serviceId.toString());

    this.providersService.deleteProvider(this.provider.id, search).subscribe((_) => {
      $('#deleteProvider').modal('hide');
      this.deleted.emit(this.provider.id);
    });
  }
}
