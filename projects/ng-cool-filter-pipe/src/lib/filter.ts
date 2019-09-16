import { IFilteredMap } from './i-filtered-map';


interface IHashTableOfWords {

    length?: number;

}


export class Filter {

    private initialMaps: object[];

    private filteredCollectionCache: object[];

    private filteredCollectionCacheHashTableIndex: object;

    constructor() {
        this.initialMaps = [];
        this.filteredCollectionCache = [];
        this.filteredCollectionCacheHashTableIndex = {};
    }

    getMaps(collection: object[], term: string = '', ...properties: string[]): object[] {
        let filtered: object[] = [];

        let map: IFilteredMap;

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
            if (!this.filteredCollectionCacheHashTableIndex.hasOwnProperty(term)) {
                collection.forEach(
                    (object: object) => {
                        map = new Object();
                        map.source = object;
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
                            map.source = object;
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

        let termIndex: number;

        let amount = 0;

        let regexp: RegExp;

        let wordIndex = -1;

        let cachedWordIndex = -1;

        let termSlice: string;

        const termSlices = term.trim().split(' ').filter(item => item !== '');

        const words = text.trim().split(' ');

        const hashTableOfWords: IHashTableOfWords = this.asCountableLiteral(words);

        const map = {
            terms: termSlices,
            mapping: {}
        };

        if (hashTableOfWords.length >= termSlices.length) {
            for (let i = 0; i < termSlices.length; i++) {
                termSlice = termSlices[i].trim();

                // what is the purpose?
                if (i < termSlices.length - 1) {
                    wordIndex = this.indexOf(hashTableOfWords, termSlice);
                } else if (this.termCount(words, termSlice) >=
                    this.termCount(termSlices, termSlice)
                ) {
                    wordIndex = this.indexOf(hashTableOfWords, termSlice);
                }

                if (wordIndex !== -1
                    && (wordIndex > cachedWordIndex)
                ) {
                    cachedWordIndex = wordIndex;

                    regexp = new RegExp(termSlice, 'i');
                    termIndex = words[`${wordIndex}`].search(regexp);

                    do {
                        delete hashTableOfWords[`${wordIndex}`];
                    }
                    while (--wordIndex >= 0);

                    // só deve fazer isso se o termIndex for igual a 0
                        map.mapping[`${wordIndex}`] = {
                            researchedSlice: termSlice,
                            termIndex: `${termIndex}`
                        };

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

        const setAccessors: (object: object) => void = (object: object) => {
            const calculateLength: () => number = () => {
                return Object.keys(object).length;
            };

            let length: number = calculateLength();

            const accessors: (length: number) => object = () => {
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

    private indexOf(words: object, term: string): number {
        let regexp: RegExp;

        let index = -1;

        let word: string;

        const indexes = Object.keys(words);

        term = term.trim();

        regexp = new RegExp(term, 'i');

        for (const i of indexes) {
            if (typeof words[i] === 'string') {
                word = words[i];

                if (word.search(regexp) > -1) {
                    index = parseInt(i, 10);
                    break;
                }
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

        i = this.indexOf(clone, term);

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
