export class Filter {

    private initialMaps: object[];

    private filteredCollectionCache: object[];

    private filteredCollectionCacheHashTableIndex: object;

    constructor() {
        this.initialMaps = [];
        this.filteredCollectionCache = [];
        this.filteredCollectionCacheHashTableIndex = {};
    }

    getMaps(collection: object[], term: string, ...properties: string[]): object[] {
        let filtered: object[] = [];

        let map: object;

        let maps: object[] = [];

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
                    (object: object) => {
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
                (object: object) => {
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

    private mapIfFound(term: string = '', text: string = ''): object | null {

        let termIndex: Number;

        let amount = 0;

        let regexp: RegExp;

        let wordIndex: Number = -1;

        let cachedWordIndex: Number = -1;

        let termSlice: string;

        const termSlices = term.trim().split(' ').filter(item => item !== '');

        const words = text.trim().split(' ');

        const wordsHashTable: object = this.asCountableLiteral(words);

        const map = {
            terms: termSlices,
            mapping: {}
        };

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

    private asCountableLiteral(collection: object) {
        const clone: object = {};

        const setAccessors: Function = (object: object) => {
            const calculateLength: Function = () => {
                return Object.keys(object).length;
            };

            let length: number = calculateLength();

            const accessors: Function = () => {
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
        };

        Object.assign(clone, collection);
        setAccessors(clone);

        return clone;
    }

    private indexOf( object: object, term: string, wholeWord: Boolean = true): Number {
        let regexp: RegExp;

        let index = -1;

        let i: number = 0;

        let property: string;

        const properties = Object.keys(object);

        term = term.trim();

        if (wholeWord) {
            for (property of properties) {
                if (typeof object[property] === 'string') {
                    if (`${object[property]}`.toLocaleLowerCase()
                        === term.toLowerCase()
                    ) {
                        index = Number.parseInt(property, 10);
                        break;
                    }
                }
                i++;
            }
        } else {
            regexp = new RegExp(term, 'i');

            for (property of properties) {
                if (typeof object[property] === 'string') {
                    if (object[property].search(regexp) === 0) {
                        index = Number.parseInt(property, 10);
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

    private termCount(collection: string[], term: string) {
        let i: any;

        let regexp: RegExp;

        let count = 0;

        const clone = Object.assign([], collection);

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
