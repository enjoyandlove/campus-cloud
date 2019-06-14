import { ClubNoteToTextPipe } from './note-to-text.pipe';

const mockNotes = [
  { question_1: ['answer1_for_q1', 'answer2_for_q1', 'answer3_for_q1'] },
  { question_2: ['answer1_for_q2', 'answer2_for_q2'] }
];

describe('ClubNoteToTextPipe', () => {
  let pipe: ClubNoteToTextPipe;

  beforeEach(() => {
    pipe = new ClubNoteToTextPipe();
  });

  it('should transform', () => {
    const transformedData = pipe.transform(mockNotes);

    expect(transformedData.length).toBe(2);
    expect(transformedData[0].answers.length).toBe(3);
    expect(transformedData[0].question).toEqual('question_1');
  });
});
