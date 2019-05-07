import {
  Input,
  OnInit,
  Output,
  Component,
  ElementRef,
  EventEmitter,
  HostListener
} from '@angular/core';

import { CPI18nService } from '@shared/services';

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

  @Output() cancelClick: EventEmitter<null> = new EventEmitter();
  @Output() deleteClick: EventEmitter<null> = new EventEmitter();

  disableSubmit: boolean;
  _warnings: IWarning[] = [];

  constructor(public el: ElementRef, public cpI18n: CPI18nService) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal click
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  resetModal() {
    this.cancelClick.emit();
  }

  onDeleteClick() {
    this.deleteClick.emit();
  }

  recheckDisableStatus(): void {
    const uncheckedWarnings = this._warnings.filter((w) => !w.checked);

    this.disableSubmit = uncheckedWarnings.length > 0;
  }

  onWarningToogle(checked: boolean, index: number): void {
    this._warnings[index].checked = checked;

    this.recheckDisableStatus();
  }

  ngOnInit() {
    this.disableSubmit = this._warnings.length > 0;
  }
}
