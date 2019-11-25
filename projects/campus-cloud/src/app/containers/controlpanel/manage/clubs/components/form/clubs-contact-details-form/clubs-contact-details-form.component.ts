import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ClubsUtilsService } from '@controlpanel/manage/clubs/clubs.utils.service';

@Component({
  selector: 'cp-clubs-contact-details-form',
  templateUrl: './clubs-contact-details-form.component.html',
  styleUrls: ['./clubs-contact-details-form.component.scss']
})
export class ClubsContactDetailsForm implements OnInit {
  @Input() club;
  @Input() form: FormGroup;
  @Input() formError: boolean;

  isSJSU: boolean;

  constructor() {}

  ngOnInit() {
    this.isSJSU = ClubsUtilsService.isSJSU(this.club);
  }
}
