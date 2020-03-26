/* tslint:disable:component-selector */
import {
  Input,
  OnInit,
  Output,
  Component,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'ready-ui-gallery-item',
  templateUrl: './gallery-item.component.html',
  styleUrls: ['./gallery-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryItemComponent implements OnInit {
  _disabled = false;

  @Input()
  src: string;

  @Input()
  set disabled(disabled: boolean | string) {
    this._disabled = coerceBooleanProperty(disabled);
  }

  @Output()
  close: EventEmitter<void> = new EventEmitter();

  constructor(public sanitizer: DomSanitizer) {}

  ngOnInit() {}
}
