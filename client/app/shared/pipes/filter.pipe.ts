import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cpFilterPipe' })
export class CPFilterPipe implements PipeTransform {
  transform(data: any[], { query, filterBy }) {
    if (!query) { return data; };

    const filterResults = [];

    if (Array.isArray(filterBy)) {
      data.forEach(item => {
        filterBy.map(filter => {
          if (item[filter].toLowerCase().includes(query.toLowerCase())) {
            filterResults.push(item);
          }
        });
      });
    } else {
      data.forEach(item => {
        let str: String = (item[filterBy]).toString().toLowerCase();

        if (str.startsWith(query.toLowerCase())) {
          filterResults.push(item);
        }
      });
    }

    return filterResults;
  }
}
