import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';

@Component({
  selector: 'cp-personas-tile-hover',
  templateUrl: './tile-hover.component.html',
  styleUrls: ['./tile-hover.component.scss']
})
export class PersonasTileHoverComponent implements AfterViewInit, OnInit {
  @Input() visible;
  @Input() editable;
  @Input() defaultTile: boolean;

  @Output() editClick: EventEmitter<null> = new EventEmitter();
  @Output() deleteClick: EventEmitter<null> = new EventEmitter();
  @Output() toggleVisibility: EventEmitter<null> = new EventEmitter();

  @ViewChild('base') base;

  constructor(public changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {}
}
