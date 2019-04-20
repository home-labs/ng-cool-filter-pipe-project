export class Filter {

    constructor() {

    }

    getMaps(collection: Object[], term: string, ...properties: string[]): Object[] {
        let
            map: Object
            ;

        const
            maps: Object[] = [];

        if (term !== '') {
            if (!properties.length) {
                properties = Object.keys(collection[0]);
            }

            collection.forEach(
                (object: Object) => {
                    for (const property of properties) {
                        map = this.mapIfFound(term, object[property]);
                        if (map) {
                            map['source'] = object;
                            maps.push(map);
                        }
                    }
                }
            );

            return maps;
        }
    }

    private mapIfFound(term: string, text: string): Object | null {
        let
            sliceIndex: Number,
            amount = 0,
            regexp: RegExp,
            wordIndex: Number = 0,
            cachedWordIndex: Number = -1
            ;

        const
            slices = term.split(' '),
            words = text.split(' '),
            wordsHashTable: Object = this.asCountableLiteral(words),
            map = {
                terms: slices,
                mapping: {}
            }
            ;

        if (wordsHashTable['length'] >= slices.length) {
            for (let slice of slices) {
                slice = slice.trim();

                wordIndex = this.firstFromTerm(wordsHashTable, slice,
                    wordIndex);

                if (wordIndex !== -1
                    && (
                        this.termCount(words, slice) >=
                        this.amountOf(slices, slice)
                    )
                    && (wordIndex > cachedWordIndex)
                ) {
                    cachedWordIndex = wordIndex

                    regexp = new RegExp(slice, 'i');

                    sliceIndex = words[`${wordIndex}`].search(regexp);
                    map.mapping[`${wordIndex}`] = {
                        researchedSlice: slice,
                        sliceIndex: sliceIndex
                    };

                    delete wordsHashTable[`${wordIndex}`];

                    amount += 1;
                } else {
                    break;
                }
            }

            if (amount === slices.length) {
                return map;
            }
        }

        return null;
    }

    private asCountableLiteral(collection: Object) {
        const
            clone: Object = {},

            setAccessors: Function = function (object: Object) {
                const
                    calculateLength: Function = function () {
                        return Object.keys(object).length;
                    };

                let
                    length: number = calculateLength();

                const

                    accessors: Function = function () {
                        return {
                            get: function () {
                                return length;
                            },
                            set: function () {
                                length = calculateLength();
                            }
                        };
                    };

                Object.defineProperties(object, {
                    length: accessors(length)
                });
            }
            ;

        Object.assign(clone, collection);
        setAccessors(clone);

        return clone;
    }

    private firstFromTerm(object: Object, term: string, startingIndex: Number = 0): Number
        | undefined {
        let
            regexp: RegExp,
            index = -1,
            i = 0
            ;

        const
            properties = Object.keys(object)
            ;

        term = term.trim();

        regexp = new RegExp(term, 'i');

        for (const p of properties) {
            if (typeof object[p] === 'string' &&
                i >= startingIndex) {
                if (object[p].search(regexp) !== -1) {
                    index = Number.parseInt(p);
                    break;
                }
            }
            i++;
        }

        if (index !== -1) {
            return index;
        }

        return undefined;
    }

    private termCount(collection: string[], term: string, startingIndex: Number = 0) {
        let
            i: any,
            regexp: RegExp,
            count = 0
            ;

        const
            clone = Object.assign([], collection)
            ;

        term = term.trim();

        regexp = new RegExp(term, 'i');

        i = this.firstFromTerm(clone, term, startingIndex);

        if (i > -1) {
            while (i < collection.length) {
                if (clone[i].trim().search(regexp) > -1) {
                    count += 1;
                    i++;
                } else {
                    break;
                }
            }
        }

        return count;
    }

    private amountOf(collection: string[], item: string) {

        let
            amount = 0,
            i = 0
            ;

        if (item || typeof item === 'number') {
            while (true) {
                i = collection.indexOf(item, i);
                if (i > -1) {
                    amount++;
                    if (++i === collection.length) {
                        break;
                    }
                } else {
                    break;
                }
            }
        } else {
            amount = collection.length;
        }

        return amount;
    }

}
