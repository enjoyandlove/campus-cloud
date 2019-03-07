import { of } from 'rxjs';

export const mockPrograms = [
  {
    id: 59,
    name: 'lets create a new list changed',
    description: 'removed 3',
    events: 1,
    members: 10,
    start: '1557637200',
    end: '1557637200',
    is_membership: 0
  },
  {
    id: 81,
    name: 'ddd',
    description: 'ddddd',
    events: 1,
    members: 10,
    start: '1557637200',
    end: '1557637200',
    is_membership: 1
  }
];

export class MockOrientationService {
  dummy: any;

  deleteProgram(programId: number, search: any) {
    this.dummy = [programId, search];

    return of({});
  }

  getPrograms(startRage: number, endRage: number, search: any) {
    this.dummy = [startRage, endRage, search];

    return of({});
  }
}
