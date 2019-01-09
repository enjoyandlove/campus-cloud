import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { IWallsIntegration } from '@libs/integrations/walls/model';

@Component({
  selector: 'cp-walls-integrations-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class WallsIntegrationsDeleteComponent implements OnInit {
  @Input() integration: IWallsIntegration;

  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() deleteClick: EventEmitter<IWallsIntegration> = new EventEmitter();

  constructor() {}

  onDelete() {
    this.deleteClick.emit(this.integration);
    this.teardown.emit();
  }

  onResetModal() {
    this.teardown.emit();
  }

  ngOnInit() {}
}
