import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { UI_THEME } from '../../tokens';
import { ITheme } from '../../interfaces';

@Component({
  selector: 'ready-ui-theme-provider',
  template: '<ng-content></ng-content>'
})
export class ThemeProviderComponent {
  constructor(@Inject(DOCUMENT) private document: any, @Inject(UI_THEME) private theme: ITheme) {
    const body: HTMLBodyElement = this.document.body;
    body.classList.add(this.theme.name);

    for (const prop in theme.properties) {
      if (this.theme.properties[prop]) {
        body.style.setProperty(prop, this.theme.properties[prop]);
      }
    }
  }
}
