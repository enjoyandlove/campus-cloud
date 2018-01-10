import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import 'node_modules/quill/dist/quill.core.css';
import 'node_modules/quill/dist/quill.snow.css';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { CPI18nService } from '../../services/index';

interface IState {
  body: string;
  image: string;
}

const state: IState = {
  body: null,
  image: null,
};

@Component({
  selector: 'cp-text-editor',
  templateUrl: './cp-text-editor.component.html',
  styleUrls: ['./cp-text-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CPTextEditorComponent implements OnInit, AfterViewInit {
  @Input() image$: Subject<string>;
  @Input() reset$: Subject<boolean>;
  @Output() contentChange: EventEmitter<IState> = new EventEmitter();
  @ViewChild('editor') editor: ElementRef;

  quillInstance;
  state: IState = state;
  imageContainer: Element;
  imageElement: HTMLImageElement = new Image();
  deleteButtonElement;

  constructor(private cpI18n: CPI18nService) {}

  createDeleteButton() {
    const button = document.createElement('button');
    button.className =
      'material-icons cpbtn cpbtn--cancel cpbtn--no-border remove-image';
    button.onclick = (e) => this.removeImage(e);
    button.textContent = 'close';
    button.style.display = 'none';
    this.deleteButtonElement = button;
    this.imageContainer.appendChild(button);
  }

  ngAfterViewInit() {
    this.launch();

    this.imageContainer = this.quillInstance.addContainer('cp-editor-image');
    this.imageElement.style.display = 'none';

    this.createDeleteButton();

    this.imageContainer.appendChild(this.imageElement);
  }

  launch() {
    const Quill = require('quill');
    const toolbarOptions = null;

    this.quillInstance = new Quill(this.editor.nativeElement, {
      modules: {
        toolbar: toolbarOptions,
      },
      placeholder: this.cpI18n.translate('feeds_input_placeholder'),
      theme: 'snow',
    });

    this.quillInstance.on('text-change', () => {
      this.state = Object.assign({}, this.state, {
        body: this.quillInstance.getText().trim(),
      });
      this.contentChange.emit(this.state);
    });
  }

  removeImage(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    this.state = Object.assign({}, this.state, { image: null });
    this.imageElement.src = null;
    this.contentChange.emit(this.state);
    this.imageElement.style.display = 'none';
    this.deleteButtonElement.style.display = 'none';
  }

  removeText() {
    this.state = Object.assign({}, this.state, { body: null });
    this.quillInstance.setText('');
  }

  reset() {
    this.removeImage();
    this.removeText();
  }

  ngOnInit() {
    if (!this.image$) {
      return Observable.of(null);
    }

    this.reset$.subscribe((reset) => {
      if (reset) {
        this.reset();
      }
    });

    this.image$.subscribe((image: string) => {
      if (image) {
        this.state = Object.assign({}, this.state, { image });

        this.imageElement.src = image;
        this.imageElement.style.display = 'block';
        this.deleteButtonElement.style.display = 'block';
      }
    });
  }
}
