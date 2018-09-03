/* tslint:disable:max-line-length */
import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SNACKBAR_SHOW } from './../../../../../../../reducers/snackbar.reducer';
import { CPImageCropperComponent } from './../../../../../../../shared/components/cp-image-cropper/cp-image-cropper.component';
import { CPHostDirective } from './../../../../../../../shared/directives/cp-host/cp-host.directive';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';
import { TilesService } from './../../tiles.service';
import { TilesUtilsService } from './../../tiles.utils.service';
import { ISnackbar } from '../../../../../../../reducers/snackbar.reducer';
import { FileUploadService } from '../../../../../../../shared/services';

@Component({
  selector: 'cp-personas-tile-guide-form',
  templateUrl: './tile-guide-form.component.html',
  styleUrls: ['./tile-guide-form.component.scss']
})
export class PersonasTileGuideFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() uploadButtonId: number;

  @ViewChild(CPHostDirective) cpHost: CPHostDirective;

  @Output() formChange: EventEmitter<FormGroup> = new EventEmitter();

  uploadImageBtn;

  state = {
    uploading: false
  };

  constructor(
    public service: TilesService,
    public cpI18n: CPI18nService,
    public store: Store<ISnackbar>,
    public utils: TilesUtilsService,
    public fileService: FileUploadService,
    public componentFactoryResolver: ComponentFactoryResolver
  ) {}

  onColorChange(hexColor: string) {
    const colorStr = hexColor.replace('#', '');
    this.form.controls['color'].setValue(colorStr);
  }

  errorHandler() {}

  onCropResult(base64_image, componentRef) {
    componentRef.destroy();

    this.service.uploadBase64Image({ base64_image }).subscribe(
      ({ image_url }: any) => {
        this.form.controls['img_url'].setValue(image_url);
      },
      () => this.errorHandler()
    );
  }

  uploadImage(image) {
    this.state = { ...this.state, uploading: true };
    this.fileService.uploadFile(image).subscribe(
      ({ image_url }: any) => {
        this.state = { ...this.state, uploading: false };
        this.loadImageCropperComponent(image_url);
      },
      () => {
        this.errorHandler();
        this.state = { ...this.state, uploading: false };
      }
    );
  }

  loadImageCropperComponent(imageUrl) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      CPImageCropperComponent
    );

    const viewContainerRef = this.cpHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    const comp: CPImageCropperComponent = <CPImageCropperComponent>componentRef.instance;

    comp.imageUrl = imageUrl;

    comp.cancel.subscribe(() => componentRef.destroy());
    comp.result.subscribe((imageData) => this.onCropResult(imageData, componentRef));
  }

  onFileChanged(file) {
    const validateTileImage = this.utils.validateTileImage(file, 5e6);

    validateTileImage.then(() => this.uploadImage(file)).catch((body) => {
      this.store.dispatch({
        type: SNACKBAR_SHOW,
        payload: {
          autoClose: true,
          class: 'warning',
          body
        }
      });
    });
  }

  ngOnInit(): void {
    this.uploadImageBtn = this.cpI18n.translate('button_add_photo');

    this.form.valueChanges.subscribe(() => {
      this.formChange.emit(this.form);
    });
  }
}
