import {
  Component,
  OnInit,
  Input,
  HostListener,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';

import { CPI18nService } from '../../../../../../../shared/services';

@Component({
  selector: 'cp-import-confirmation-modal',
  templateUrl: './import-confirmation-modal.component.html',
  styleUrls: ['./import-confirmation-modal.component.scss'],
})
export class CalendarsItemsImportConfirmationComponent implements OnInit {
  @Input() response;
  @Input() original;
  @Input() calendarId: number;

  buttonData;
  errors = [];
  success = [];
  parsing = true;

  constructor(
    public cpI18n: CPI18nService,
    public router: Router,
    public el: ElementRef,
  ) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.onOK();
    }
  }

  onOK() {
    $('#calendarImportsConfirmation').modal('hide');
    this.router.navigate([`/manage/calendars/${this.calendarId}`]);
  }

  parseResponse() {
    return new Promise((resolve) => {
      this.response.forEach((item, index) => {
        if ('id' in item) {
          this.success.push(item);

          return;
        }
        this.errors.push(this.original[index]);
      });

      resolve();
    });
  }

  ngOnInit() {
    this.parseResponse().then((_) => (this.parsing = false));

    this.buttonData = {
      text: this.cpI18n.translate('ok'),
      class: 'primary',
    };
  }
}
