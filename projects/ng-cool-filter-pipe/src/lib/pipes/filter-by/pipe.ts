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

    private filtered: Object[];

    private cachedTerm: string;

    constructor() {
        this.filter = new Filter();
        this.filtered = [];
    }

    transform(collection: Object[], term: string, ...properties: string[]): Object[] {

        const
            filtered: Object[] = [];

        if (!collection.length || term === '') {
            this.cachedTerm = '';
            return collection;
        }

        if (
            term.length < this.cachedTerm.length
            || !this.filtered.length
        ) {
            this.filtered = collection;
        }

        this.filter.getMaps(this.filtered, term, ...properties).forEach(
            (map: Object) => {
                filtered.push(map['source']);
            }
        );

        this.filtered = filtered;
        this.cachedTerm = term;

        return this.filtered;
    }

}
