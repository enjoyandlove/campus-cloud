import { READY_MODAL_DATA } from '@ready-education/ready-ui/overlays/modal/modal.service';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'cp-unsaved-changes-modal',
  templateUrl: './cp-unsaved-changes-modal.component.html',
  styleUrls: ['./cp-unsaved-changes-modal.component.scss']
})
export class CPUnsavedChangesModalComponent implements OnInit {
  constructor(@Inject(READY_MODAL_DATA) public modal) {}

  ngOnInit(): void {}
}
