import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { ProvidersService } from '../../../providers.service';

declare var $: any;

@Component({
  selector: 'cp-providers-delete',
  templateUrl: './providers-delete.component.html',
  styleUrls: ['./providers-delete.component.scss']
})
export class ServicesProviderDeleteComponent implements OnInit {
  @Input() provider: any;
  @Input() serviceId: number;
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  constructor(
    private providersService: ProvidersService
  ) { }

  onDelete() {
    let search = new URLSearchParams();
    search.append('service_id', this.serviceId.toString());

    this
      .providersService
      .deleteProvider(this.provider.id, search)
      .subscribe(
        _ => {
          $('#deleteProvider').modal('hide');
          this.deleted.emit(this.provider.id);
        },
        err => { throw new Error(err) }
      );
  }

  ngOnInit() { }
}
