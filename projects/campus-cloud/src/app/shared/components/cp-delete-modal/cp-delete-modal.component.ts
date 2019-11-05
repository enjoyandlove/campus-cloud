import { Input, OnInit, Output, Component, EventEmitter, TemplateRef } from '@angular/core';

import { CPI18nService } from '@campus-cloud/shared/services';

interface IWarning {
  label: string;
  checked: boolean;
}

@Component({
  selector: 'cp-delete-modal',
  templateUrl: './cp-delete-modal.component.html',
  styleUrls: ['./cp-delete-modal.component.scss']
})
export class CPDeleteModalComponent implements OnInit {
  @Input()
  set warnings(warnings: string[]) {
    this._warnings = warnings.map((w) => {
      return {
        label: w,
        checked: false
      };
    });
  }

  @Input() modalBody: string;
  @Input() modalTitle: string;
  @Input() submitLabel = 'delete';
  @Input() modalFooterTemplate: TemplateRef<any>;

  @Output() cancelClick: EventEmitter<null> = new EventEmitter();
  @Output() deleteClick: EventEmitter<null> = new EventEmitter();

  buttonData;
  _warnings: IWarning[] = [];

  constructor(public cpI18n: CPI18nService) {}

  resetModal() {
    this.cancelClick.emit();
  }

  onDeleteClick() {
    this.deleteClick.emit();
  }

  recheckDisableStatus(): void {
    const uncheckedWarnings = this._warnings.filter((w) => !w.checked);

    this.buttonData = {
      ...this.buttonData,
      disabled: uncheckedWarnings.length > 0
    };
  }

  onWarningToogle(checked: boolean, index: number): void {
    this._warnings[index].checked = checked;

    this.recheckDisableStatus();
  }

  ngOnInit() {
    this.buttonData = {
      class: 'danger',
      disabled: this._warnings.length > 0,
      text: this.cpI18n.translate(this.submitLabel)
    };
  }
}
