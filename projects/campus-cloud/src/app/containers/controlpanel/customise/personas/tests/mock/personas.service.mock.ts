import { of } from 'rxjs';

import { ITile } from '../../tiles/tile.interface';
import { TileVisibility } from '../../tiles/tiles.status';

export const mockPersonas = [
  {
    login_requirement: 1,
    cre_enabled: false,
    rank: 1,
    platform: 0,
    localized_name_map: {
      fr: 'Students Tile',
      en: 'Students Tile'
    },
    pretour_enabled: false,
    id: 1,
    home_todays_schedule_enabled: true,
    home_my_courses_enabled: true,
    home_due_dates_enabled: true
  },
  {
    login_requirement: -1,
    cre_enabled: false,
    rank: 2,
    platform: 1,
    localized_name_map: {
      fr: 'Web Persona Bonjour',
      en: 'Web Persona'
    },
    pretour_enabled: false,
    id: 89,
    home_todays_schedule_enabled: true,
    home_my_courses_enabled: true,
    home_due_dates_enabled: true
  }
];

export class MockPersonasService {
  dummy;

  getPersonas() {
    return of(mockPersonas);
  }

  getServices(search) {
    this.dummy = search;

    return of([{ label: 'noService', value: null }]);
  }

  createCampusLink(formValue) {
    return of(formValue);
  }

  createGuideTile(formValue) {
    return of({
      id: 1,
      ...formValue
    });
  }

  updatePersona(personaId, search, persona) {
    this.dummy = { personaId, search };

    return of(persona);
  }

  getPersonaById(personaId, search) {
    this.dummy = { personaId, search };

    return of(mockPersonas.filter((p) => p.id === personaId)[0]);
  }

  deletePersonaById(personaId, search) {
    this.dummy = { personaId, search };

    return of(personaId);
  }

  createPersona(body) {
    return of(body);
  }
}

export class MockTilesUtilsService {
  isFeatured(tile: ITile) {
    return tile.featured_rank > -1;
  }

  isTileVisible(tile: ITile) {
    return tile.visibility_status === TileVisibility.visible;
  }
}
