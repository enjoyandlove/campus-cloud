import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[cpHost]'
})
export class CPHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
