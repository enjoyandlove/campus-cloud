import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';

@Component({
  selector: 'cp-personas-tile-add-button',
  templateUrl: './tile-add-button.component.html',
  styleUrls: ['./tile-add-button.component.scss']
})
export class PersonasTileAddButtonComponent implements AfterViewInit, OnInit {
  @Input() disabled;

  @ViewChild('base') base;

  @Output() buttonClick: EventEmitter<null> = new EventEmitter();

  constructor(public changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {}
}
