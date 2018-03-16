import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cpNoteToText' })
export class ClubNoteToTextPipe implements PipeTransform {
  transform(notes: Array<{ key: string; answers: Array<string> }>): any {
    return notes.map((note) => {
      return {
        question: Object.keys(note)[0],
        answers: Object.values(note)[0]
      };
    });
  }
}
