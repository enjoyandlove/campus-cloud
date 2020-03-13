import {
  Input,
  OnInit,
  Output,
  Component,
  ViewChild,
  OnDestroy,
  ElementRef,
  EventEmitter,
  AfterViewInit,
  ChangeDetectorRef,
  ComponentFactoryResolver
} from '@angular/core';
import { ColorPickerDirective } from '@ready-education/ready-ui/forms';
import { map, filter, takeUntil } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { TilesService } from './../../tiles.service';
import { TilesUtilsService } from './../../tiles.utils.service';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { CPHostDirective } from '@campus-cloud/shared/directives';
import { ISnackbar, baseActionClass } from '@campus-cloud/store/base';
import { CPImageCropperComponent } from '@campus-cloud/shared/components';
import { CPI18nService, ImageService } from '@campus-cloud/shared/services';

@Mixin([Destroyable])
@Component({
  selector: 'cp-personas-tile-guide-form',
  templateUrl: './tile-guide-form.component.html',
  styleUrls: ['./tile-guide-form.component.scss']
})
export class PersonasTileGuideFormComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() showErrors = false;
  @Input() uploadButtonId: number;

  @ViewChild('base', { static: true }) base;
  @ViewChild('hexInput', { static: true }) hexInput: ElementRef;
  @ViewChild(CPHostDirective, { static: true }) cpHost: CPHostDirective;
  @ViewChild(ColorPickerDirective, { static: true }) readyColorPicker: ColorPickerDirective;

  @Output() imageChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() formChange: EventEmitter<FormGroup> = new EventEmitter();

  uploadImageBtn;

  state = {
    uploading: false
  };

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    public service: TilesService,
    public cpI18n: CPI18nService,
    public store: Store<ISnackbar>,
    public utils: TilesUtilsService,
    public imageService: ImageService,
    public changeDetectorRef: ChangeDetectorRef,
    public componentFactoryResolver: ComponentFactoryResolver
  ) {}

  onPickerEvents({ event, args }) {
    if (event === 'save') {
      const [hsva] = args;
      const colorStr = hsva
        .toHEXA()
        .join('')
        .replace('#', '');
      this.form.controls['color'].setValue(colorStr);
    }
  }

  errorHandler(err?: string) {
    const body = err ? err : this.cpI18n.translate('something_went_wrong');

    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body
      })
    );
  }

  onCropResult(base64_image, componentRef) {
    componentRef.destroy();

    this.service.uploadBase64Image({ base64_image }).subscribe(
      ({ image_url }: any) => {
        this.form.controls['img_url'].setValue(image_url);
      },
      () => this.errorHandler()
    );
  }

  uploadImage(image: File) {
    this.state = { ...this.state, uploading: true };
    this.imageService.upload(image).subscribe(
      ({ image_url }: { image_url: string }) => {
        this.imageChanged.emit(true);
        this.state = { ...this.state, uploading: false };
        this.loadImageCropperComponent(image_url);
      },
      (err) => {
        this.state = { ...this.state, uploading: false };
        this.errorHandler(err.message);
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

    comp.cancel.pipe(takeUntil(this.destroy$)).subscribe(() => componentRef.destroy());
    comp.result
      .pipe(takeUntil(this.destroy$))
      .subscribe((imageData) => this.onCropResult(imageData, componentRef));
  }

  addSubscribers() {
    const hexInput$ = fromEvent(this.hexInput.nativeElement, 'keyup');
    hexInput$
      .pipe(
        takeUntil(this.destroy$),
        map((event: any) => event.target.value),
        map((hexString: string) => {
          hexString = hexString.startsWith('#') ? hexString : `#${hexString}`;

          const validHex = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;

          return validHex.test(hexString) ? hexString : null;
        }),
        filter((val) => !!val)
      )
      .subscribe((colorString) => this.readyColorPicker.instance.setColor(`${colorString}`));
  }

  ngAfterViewInit() {
    this.addSubscribers();
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {
    this.uploadImageBtn = this.cpI18n.translate('button_add_photo');

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.formChange.emit(this.form);
    });
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
