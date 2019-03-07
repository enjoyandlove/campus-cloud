import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';

import { MODAL_DATA, IModal } from '@shared/services';

@Component({
  selector: 'cp-testers-delete',
  templateUrl: './testers-delete.component.html',
  styleUrls: ['./testers-delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestersDeleteComponent implements OnInit {
  constructor(@Inject(MODAL_DATA) public modal: IModal) {}

  doDelete() {
    this.modal.onAction(this.modal.data);
    this.modal.onClose();
  }

  doCancel() {
    this.modal.onClose();
  }

  ngOnInit() {}
}
