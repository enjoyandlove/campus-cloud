import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CPTargetDirective } from '@shared/directives';

export function getElementByCPTargetValue(de: DebugElement, attrValue: string): DebugElement {
  return de.query(By.css(`[${CPTargetDirective.attribute}=${attrValue}]`));
}
