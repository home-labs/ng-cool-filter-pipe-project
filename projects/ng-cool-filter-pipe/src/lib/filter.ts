export class Filter {

    private initialMaps: Object[];

    private filteredCollectionCache: Object[];

    private filteredCollectionCacheHashTableIndex: Object;

    constructor() {
        this.initialMaps = [];
        this.filteredCollectionCache = [];
        this.filteredCollectionCacheHashTableIndex = {};
    }

    getMaps(
        collection: Object[],
        term: string,
        ...properties: string[]
    ): Object[] {
        let
            filtered: Object[] = [],
            map: Object,
            maps: Object[] = []
            ;

        if (this.filteredCollectionCacheHashTableIndex.hasOwnProperty(term)) {
            collection = this.filteredCollectionCacheHashTableIndex[term];
        } else if (this.filteredCollectionCache.length) {
            collection = this.filteredCollectionCache;
        }

        if (!properties.length) {
            properties = Object.keys(collection[0]);
        }

        if (term === '') {
            if (
                !this.filteredCollectionCacheHashTableIndex
                    .hasOwnProperty(term)
                ) {
                collection.forEach(
                    (object: Object) => {
                        map = new Object();
                        map['source'] = object;
                        this.initialMaps.push(map);
                    }
                );
            }

            filtered = collection;
            maps = this.initialMaps;
        } else {
            collection.forEach(
                (object: Object) => {
                    for (const property of properties) {
                        map = this.mapIfFound(term, object[property]);
                        if (map) {
                            filtered.push(object);
                            map['source'] = object;
                            maps.push(map);
                            break;
                        }
                    }
                }
            );
        }

        this.filteredCollectionCache = filtered;
        this.filteredCollectionCacheHashTableIndex[term] = filtered;

        return maps;
    }

    private mapIfFound(
        term: string,
        text: string,
    ): Object | null {

        let
            termIndex: Number,
            amount = 0,
            regexp: RegExp,
            wordIndex: Number = -1,
            cachedWordIndex: Number = -1,
            termSlice: string
            ;

        const
            termSlices = term.split(' ').filter(item => item !== ''),
            words = text.split(' '),
            wordsHashTable: Object = this.asCountableLiteral(words),
            map = {
                terms: termSlices,
                mapping: {}
            }
            ;

        if (wordsHashTable['length'] >= termSlices.length) {
            for (let i = 0; i < termSlices.length; i++) {
                termSlice = termSlices[i].trim();

                if (i < termSlices.length - 1) {
                    wordIndex = this.indexOf(wordsHashTable, termSlice);
                } else if (this.termCount(words, termSlice) >=
                    this.termCount(termSlices, termSlice)
                ) {
                    wordIndex = this.indexOf(wordsHashTable, termSlice, false);
                }

                if (wordIndex !== -1
                    && (wordIndex > cachedWordIndex)
                ) {
                    cachedWordIndex = wordIndex;

                    regexp = new RegExp(termSlice, 'i');

                    termIndex = words[`${wordIndex}`].search(regexp);
                    map.mapping[`${wordIndex}`] = {
                        researchedSlice: termSlice,
                        termIndex: termIndex
                    };

                    delete wordsHashTable[`${wordIndex}`];

                    amount += 1;
                } else {
                    break;
                }
            }

            if (amount === termSlices.length) {
                return map;
            }
        }

        return null;
    }

    private asCountableLiteral(collection: Object) {
        const
            clone: Object = {},

            setAccessors: Function = (object: Object) => {
                const
                    calculateLength: Function = () => {
                        return Object.keys(object).length;
                    };

                let
                    length: number = calculateLength();

                const

                    accessors: Function = () => {
                        return {
                            get: () => {
                                return length;
                            },
                            set: () => {
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

    private indexOf(
        object: Object,
        term: string,
        wholeWord: Boolean = true
    ): Number {
        let
            regexp: RegExp,
            index = -1,
            i = 0
            ;

        const
            properties = Object.keys(object)
            ;

        term = term.trim();

        if (wholeWord) {
            for (const p of properties) {
                if (typeof object[p] === 'string') {
                    if (`${object[p]}`.toLocaleLowerCase()
                        === term.toLowerCase()
                    ) {
                        index = Number.parseInt(p, 10);
                        break;
                    }
                }
                i++;
            }
        } else {
            regexp = new RegExp(term, 'i');

            for (const p of properties) {
                if (typeof object[p] === 'string') {
                    if (object[p].search(regexp) === 0) {
                        index = Number.parseInt(p, 10);
                        break;
                    }
                }
                i++;
            }
        }

        if (index !== -1) {
            return index;
        }

        return -1;
    }

    private termCount(
        collection: string[],
        term: string
    ) {
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

        i = this.indexOf(clone, term, false);

        if (i > -1) {
            while (i < collection.length) {
                if (clone[i].trim().search(regexp) > -1) {
                    count += 1;
                }
                i++;
            }
        }

        return count;
    }

}
