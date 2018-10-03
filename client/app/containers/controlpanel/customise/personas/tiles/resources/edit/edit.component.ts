import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IPersona } from './../../../persona.interface';
import { ResourceService } from './../resource.service';
import { TilesUtilsService } from './../../tiles.utils.service';
import { ILink } from '../../../../../manage/links/link.interface';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-personas-resource-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class PersonaResourceEditComponent implements OnInit {
  @Input() persona: IPersona;
  @Input() resource: ILink;

  @Output() error: EventEmitter<any> = new EventEmitter();
  @Output() success: EventEmitter<any> = new EventEmitter();
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  buttonData;
  campusLinkForm: FormGroup;

  constructor(
    public cpI18n: CPI18nService,
    public tileUtils: TilesUtilsService,
    public resourceService: ResourceService
  ) {}

  handleError(err) {
    this.error.emit(err);
    this.teardown.emit();
  }

  resetModal() {
    this.teardown.emit();
  }

  onSubmit() {
    const update$ = this.resourceService.updateCampusLink(
      this.resource.id,
      this.campusLinkForm.value
    );

    update$.subscribe(
      (createdTile) => {
        this.success.emit(createdTile);
        this.teardown.emit();
      },
      (err) => this.handleError(err)
    );
  }

  ngOnInit(): void {
    this.buttonData = {
      disabled: true,
      class: 'primary',
      text: this.cpI18n.translate('t_shared_save')
    };

    this.campusLinkForm = this.tileUtils.campusLinkForm(true, true, this.resource);
    this.campusLinkForm.valueChanges.subscribe(() => {
      this.buttonData = {
        ...this.buttonData,
        disabled: !this.campusLinkForm.valid
      };
    });
  }
}
