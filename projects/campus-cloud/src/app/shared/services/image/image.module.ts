import { NgModule, ModuleWithProviders } from '@angular/core';

import { ImageService } from './image.service';
import { ImageValidatorService } from './image.validator.service';

@NgModule({
  providers: [ImageService]
})
export class ImageModule {
  static forRoot(validatorService = ImageValidatorService): ModuleWithProviders {
    return {
      ngModule: ImageModule,
      providers: [{ provide: ImageValidatorService, useClass: validatorService }]
    };
  }
}
