import { Component, OnInit, Inject } from '@angular/core';
import { MODAL_DATA, IModal } from '@client/app/shared/services';

@Component({
  selector: 'cp-testers-create',
  templateUrl: './testers-create.component.html',
  styleUrls: ['./testers-create.component.scss']
})
export class TestersCreateComponent implements OnInit {
  constructor(@Inject(MODAL_DATA) public modal: IModal) {}

  doCreate() {
    this.modal.onAction();
    this.modal.onClose();
  }

  doCancel() {
    this.modal.onClose();
  }

  ngOnInit() {}
}
