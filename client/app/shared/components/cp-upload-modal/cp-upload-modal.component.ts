import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';

interface IOptions {
  parser: Function; // Promise
  templateUrl: string;
  validExtensions: Array<string>;
}

@Component({
  selector: 'cp-upload-modal',
  templateUrl: './cp-upload-modal.component.html',
  styleUrls: ['./cp-upload-modal.component.scss']
})
export class CPUploadModalComponent implements OnInit {
  @Input() props: IOptions;

  @Output() navigate: EventEmitter<null> = new EventEmitter();

  ready$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  reset$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    if (!this.el.nativeElement.contains(event.target)) {
      // we are outside of the modal so do reset
      this.doReset();
    }
  }

  doReset() {
    this.reset$.next(true);
    this.ready$.next(false);
  }

  onNavigate() {
    this.navigate.emit();
    this.reset$.next(true);
  }

  ngOnInit() {
    if (this.props === undefined) {
      console.warn('Missing Options Input');
    }
  }
}
