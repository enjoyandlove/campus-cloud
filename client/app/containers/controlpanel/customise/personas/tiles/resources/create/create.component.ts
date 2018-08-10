import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';
import { TilesUtilsService } from './../../tiles.utils.service';
import { ResourceService } from './../resource.service';

@Component({
  selector: 'cp-personas-resource-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class PersonaResourceCreateComponent implements OnInit {
  @Output() error: EventEmitter<any> = new EventEmitter();
  @Output() success: EventEmitter<any> = new EventEmitter();
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  buttonData;
  tileImageRequirements;
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

  validateTileImage(file) {
    return new Promise((resolve, reject) => {
      this.tileUtils
        .validateTileImage(file)
        .then(() => resolve({ valid: true }))
        .catch((err) => reject({ valid: false, errors: [err] }));
    });
  }

  resetModal() {
    this.teardown.emit();
  }

  onSubmit() {
    const post$ = this.resourceService.createCampusLink(this.campusLinkForm.value);

    post$.subscribe(
      (createdTile) => {
        this.success.emit(createdTile);
        this.teardown.emit();
      },
      (err) => this.handleError(err)
    );
  }

  onUploadedImage(image) {
    this.campusLinkForm.controls['img_url'].setValue(image);
  }

  ngOnInit(): void {
    this.buttonData = {
      disabled: true,
      class: 'primary',
      text: this.cpI18n.translate('t_shared_save')
    };

    this.campusLinkForm = this.tileUtils.campusLinkForm();
    this.tileImageRequirements = this.cpI18n.translate('t_personas_tile_image_requirements');
    this.campusLinkForm.valueChanges.subscribe(() => {
      this.buttonData = {
        ...this.buttonData,
        disabled: !this.campusLinkForm.valid
      };
    });
  }
}
