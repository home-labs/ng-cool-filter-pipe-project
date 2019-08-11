import {
    Pipe,
    PipeTransform
} from '@angular/core';

import { Filter } from '../../../lib/filter';


@Pipe({
    name: 'filterBy'
})
export class FilterByPipe implements PipeTransform {

    private filter: Filter;

    constructor() {
        this.filter = new Filter();
    }

    transform(collection: object[] = [], term: string = '', ...properties: string[]): object[] {

        const filtered: object[] = [];

        // cause' the asynchronous loading
        if (!collection.length || !term.length) {
            return collection;
        }

        this.filter.getMaps(collection, term, ...properties).forEach(
            (map: object) => {
                filtered.push(map['source']);
            }
        );

        return filtered;
    }

}
