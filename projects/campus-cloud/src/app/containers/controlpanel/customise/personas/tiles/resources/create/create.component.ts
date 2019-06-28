import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IPersona } from './../../../persona.interface';
import { ResourceService } from './../resource.service';
import { TilesUtilsService } from './../../tiles.utils.service';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-personas-resource-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class PersonaResourceCreateComponent implements OnInit {
  @Input() persona: IPersona;

  @Output() error: EventEmitter<any> = new EventEmitter();
  @Output() success: EventEmitter<any> = new EventEmitter();
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  showErrors = false;
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
    this.showErrors = false;
    if (this.campusLinkForm.invalid) {
      this.showErrors = true;
      return;
    }
    const post$ = this.resourceService.createCampusLink(this.campusLinkForm.value);

    post$.subscribe(
      (createdTile) => {
        this.success.emit(createdTile);
        this.teardown.emit();
      },
      (err) => this.handleError(err)
    );
  }

  ngOnInit(): void {
    this.campusLinkForm = this.tileUtils.campusLinkForm();
  }
}
