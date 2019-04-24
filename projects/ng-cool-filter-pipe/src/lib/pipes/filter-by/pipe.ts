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

    transform(collection: Object[], term: string, ...properties: string[]): Object[] {

        const
            filtered: Object[] = [];

        // cause' the asynchronous load
        if (!collection.length) {
            return collection;
        }

        this.filter.getMaps(collection, term, ...properties).forEach(
            (map: Object) => {
                filtered.push(map['source']);
            }
        );

        return filtered;
    }

}
