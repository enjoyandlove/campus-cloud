import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cpTeamFilterPipe' })
export class TeamFilterPipe implements PipeTransform {
  transform(data: any[], { query, filterBy }) {
    if (!query) { return data; };

    const filterResults = [];

    data.forEach(item => {
      let str: String = (item.data[filterBy]).toString().toLowerCase();

      if (str.startsWith(query.toLowerCase())) {
        filterResults.push(item);
      }
    });

    return filterResults;
  }
}
