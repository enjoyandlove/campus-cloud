import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface IServiceDeleteModal {
  id: number;
  name: string;
  index: number;
  type: string;
}

@Component({
  selector: 'cp-service-edit-delete-modal',
  templateUrl: './service-edit-delete-modal.component.html',
  styleUrls: ['./service-edit-delete-modal.component.scss']
})
export class ServicesEditDeleteModalComponent {
  @Input() item: IServiceDeleteModal;
  @Output() confirmed: EventEmitter<IServiceDeleteModal> = new EventEmitter();
}
