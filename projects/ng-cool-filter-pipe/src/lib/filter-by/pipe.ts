import {
    Pipe,
    PipeTransform
} from '@angular/core';

import { Filter } from '../filter';

import { IFilteredMap } from '../i-filtered-map';


@Pipe({
    name: 'filterBy'
})
export class FilterByPipe implements PipeTransform {

    private filter: Filter;

    constructor() {
        this.filter = new Filter();
    }

    transform(collection: object[] = [], term: string, ...properties: string[]): object[] {

        const filtered: object[] = [];

        // cause' of asynchronous loading
        if (!collection.length) {
            return collection;
        }

        // do not stop to use the getMaps method if the term is empty, otherwise the cache will never be emptied, which may create unexpected results
        this.filter.getMaps(collection, term, ...properties).forEach(
            (map: IFilteredMap) => {
                filtered.push((map.source)!);
            }
        );

        return filtered;
    }

}
