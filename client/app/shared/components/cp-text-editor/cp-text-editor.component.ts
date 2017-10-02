import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'cp-text-editor',
  templateUrl: './cp-text-editor.component.html',
  styleUrls: ['./cp-text-editor.component.scss']
})
export class CPTextEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('editor') editor: ElementRef;

  quillInstance;

  constructor() { }

  ngAfterViewInit() {
    this.launch();
  }

  launch() {
    const Quill = require('quill');

    // Quil.

    this.quillInstance = new Quill(this.editor.nativeElement, {
      modules: {
        toolbar: [
          ['image']
        ]
      },
      placeholder: 'Sopa de Caracol...',
      theme: 'snow'
    });

    this.quillInstance.on('text-change', (delta, oldDelta, source) => {
      console.log(delta);
      console.log(oldDelta);
      console.log(source);
    })
  }

  ngOnInit() { }
}
