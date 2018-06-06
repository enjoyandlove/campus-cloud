import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'cp-upload-modal-footer',
  templateUrl: './cp-upload-modal-footer.component.html',
  styleUrls: ['./cp-upload-modal-footer.component.scss']
})
export class CPUploadModalFooterComponent implements OnInit {
  isReady: boolean;

  @Input() valid: Observable<boolean>;

  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() navigate: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.valid.subscribe((ready) => {
      this.isReady = ready;
    });
  }
}
