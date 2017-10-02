import {
  Input,
  OnInit,
  Output,
  Component,
  ViewChild,
  ElementRef,
  EventEmitter,
  AfterViewInit,
  ViewEncapsulation
} from '@angular/core';

import { Observable } from 'rxjs/Observable';

import 'node_modules/quill/dist/quill.core.css';
import 'node_modules/quill/dist/quill.snow.css';

@Component({
  selector: 'cp-text-editor',
  templateUrl: './cp-text-editor.component.html',
  styleUrls: ['./cp-text-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CPTextEditorComponent implements OnInit, AfterViewInit {
  @Input() image$: Observable<string>;
  @Output() contentChange: EventEmitter<{ text: string, image: string }> = new EventEmitter()
  @ViewChild('editor') editor: ElementRef;

  quillInstance;

  constructor() { }

  ngAfterViewInit() {
    this.launch();
  }

  stripContent(data: Array<any>) {
    let response = {
      text: '',
      image: null
    };

    data.map(line => {
      if (typeof line.insert === 'string') {
        response.text += line.insert.trim();
      } else {
        response.image = line.insert.image
      }
    })
    return response;
  }

  launch() {
    const Quill = require('quill');
    const toolbarOptions = null;

    this.quillInstance = new Quill(this.editor.nativeElement, {
      modules: {
        toolbar: toolbarOptions
      },
      placeholder: 'Add some text to this post....',
      theme: 'snow' // 'snow'
    });

    this.quillInstance.on('text-change', () => {
      this.contentChange.emit(this.stripContent(this.quillInstance.getContents().ops));
    })
  }

  ngOnInit() {
    if (!this.image$) {
      return Observable.of(null);
    }

    this.image$.subscribe(image => {
      const index = this.quillInstance.getLength();

      if (image) {
        this.quillInstance.insertEmbed(index, 'image', image);
      }
    })
  }
}
