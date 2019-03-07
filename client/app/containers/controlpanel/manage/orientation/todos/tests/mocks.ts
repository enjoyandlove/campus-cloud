import { of } from 'rxjs';

export const mockTodo = {
  id: 1,
  title: 'zee',
  description: 'testss',
  end: Date.now()
};

export class MockTodosService {
  dummy: any;

  getTodos(startRage: number, endRage: number, search: any) {
    this.dummy = [startRage, endRage, search];

    return of([mockTodo]);
  }
}

export class MockActivatedRoute {
  snapshot = {
    parent: {
      parent: {
        params: of({ orientationId: 1 })
      }
    }
  };
}
