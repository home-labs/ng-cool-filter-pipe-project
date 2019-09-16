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

        let wordIndex = -1;

        let cachedTermSlice = ``;

        let cachedWord = ``;

        let cachedWordIndex = -1;

        let lastTermWasWhole = false;

        const termSlices = term.trim().split(' ').filter(item => item !== '');

        const words = text.trim().split(' ');

        const hashTableOfWords: IHashTableOfWords = this.asCountableLiteral(words);

        const map = {
            terms: termSlices,
            mapping: {}
        };

        if (hashTableOfWords.length >= termSlices.length) {

            for (const termSlice of termSlices) {

                if (cachedWordIndex === -1) {
                    wordIndex = this.indexOfTerm(hashTableOfWords, termSlice, false);
                } else {
                    wordIndex = this.indexOfTerm(hashTableOfWords, termSlice);
                }

                // a partir do primeiro termo a busca é feita em qualquer parte do texto; a partir do segundo a busca só retorna algo
                // se o último termo encontrado coincidiu com a palavra inteira ou com o final dela. Se foi coincidido com a palavra inteira
                // qualquer outra a direita da última palavra encontrada poderá ser encontrado
                if (wordIndex !== -1 &&
                    (lastTermWasWhole ||
                        cachedWordIndex === -1 ||
                        (wordIndex === (cachedWordIndex + 1) &&
                            (cachedWord.search(new RegExp(`${cachedTermSlice}$`, 'i')) !== -1) &&
                            amount === 1
                        )
                    )
                ) {
                    cachedTermSlice = termSlice;
                    cachedWord = words[`${wordIndex}`];
                    termIndex = cachedWord.search(new RegExp(termSlice, 'i'));

                    map.mapping[`${wordIndex}`] = {
                        researchedSlice: termSlice,
                        termIndex: `${termIndex}`
                    };

                    amount += 1;

                    if (termSlice.toUpperCase() === hashTableOfWords[`${wordIndex}`].toUpperCase()) {
                        lastTermWasWhole = true;
                    } else {
                        lastTermWasWhole = false;
                    }

                    cachedWordIndex = wordIndex;

                    // to search only in order
                    do {
                        delete hashTableOfWords[`${wordIndex}`];
                    }
                    while (--wordIndex >= 0);
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

    private indexOfTerm(words: object, term: string, findOnlyBeginning: boolean = true): number {
        let regexp: RegExp;

        let word: string;

        const indexes = Object.keys(words);

        term = term.trim();

        regexp = new RegExp(term, 'i');

        if (findOnlyBeginning) {
            for (const i of indexes) {
                if (typeof words[i] === 'string') {
                    word = words[i];

                    if (word.search(regexp) === 0) {
                        return parseInt(i, 10);
                    }
                }
            }
        } else {
            for (const i of indexes) {
                if (typeof words[i] === 'string') {
                    word = words[i];

                    if (word.search(regexp) !== -1) {
                        return parseInt(i, 10);
                    }
                }
            }
        }

        return -1;
    }

}
