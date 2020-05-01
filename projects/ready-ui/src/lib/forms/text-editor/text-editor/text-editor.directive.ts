/*tslint:disable:directive-selector*/
import {
  Input,
  Output,
  Inject,
  OnInit,
  OnDestroy,
  Directive,
  ElementRef,
  EventEmitter
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { NgZone } from '@angular/core';
import Quill from 'quill';

import { FormatLinks } from './format-links';

@Directive({
  exportAs: 'ui-editor',
  selector: '[ready-ui-text-editor]'
})
export class TextEditorDirective implements OnInit, OnDestroy {
  _readOnly = false;
  instance: null | Quill;

  @Input()
  theme = 'snow'; // snow, bubble

  @Input()
  className = 'ready-ui-text-editor';

  // https://quilljs.com/docs/modules/toolbar/
  @Input()
  toolbar: boolean | any[] = true;

  @Input() // text-change, selection-change, editor-change
  events: string[] = [];

  @Input()
  placeholder: string;

  @Input()
  set readOnly(readOnly: string | boolean) {
    this._readOnly = coerceBooleanProperty(readOnly);
  }

  // https://quilljs.com/docs/api/#events
  @Output()
  editor: EventEmitter<{ event: string; args: any[] }> = new EventEmitter();

  constructor(@Inject(ElementRef) private el: ElementRef, @Inject(NgZone) private zone: NgZone) {}

  get quill() {
    return this.instance;
  }

  ngOnInit() {
    Quill.debug('error');
    Quill.register(FormatLinks);
    this.zone.runOutsideAngular(() => {
      this.instance = new Quill(this.el.nativeElement, {
        modules: {
          toolbar: this.toolbar
        },

        theme: this.theme,

        readOnly: this._readOnly,

        placeholder: this.placeholder
      });
    });

    this.events.forEach((e: any) =>
      this.instance.on(e, (...args) => this.zone.run(() => this.editor.emit({ event: e, args })))
    );

    (this.el.nativeElement as HTMLElement).classList.add(this.className);
  }

  ngOnDestroy() {
    this.events.forEach((e: any) => this.instance.off(e, () => {}));
  }
}
