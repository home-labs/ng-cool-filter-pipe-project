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

        let amountFound = 0;

        let wordIndexFound = -1;

        let pieceOfLastTermFound = ``;

        let lastWordFound = ``;

        let lastWordFoundIndex = -1;

        let lastTermFoundWasWhole = false;

        const piecesOfTerms = term.trim().split(' ').filter(item => item !== '');

        const words = text.trim().split(' ');

        const hashTableOfWords: IHashTableOfWords = this.asCountableLiteral(words);

        const map = {
            terms: piecesOfTerms,
            mapping: {}
        };

        if (hashTableOfWords.length >= piecesOfTerms.length) {

            for (const termPiece of piecesOfTerms) {

                if (amountFound) {
                    wordIndexFound = this.indexOfTerm(hashTableOfWords, termPiece, true);
                } else {
                    wordIndexFound = this.indexOfTerm(hashTableOfWords, termPiece);
                }

                // a partir do primeiro termo a busca é feita em qualquer parte do texto; a partir do segundo a busca só retorna algo
                // se o último termo encontrado coincidiu com a palavra inteira ou com o final dela. Se foi coincidido com a palavra inteira
                // qualquer outra a direita da última palavra encontrada poderá ser encontrado
                if (wordIndexFound !== -1 &&
                    (lastTermFoundWasWhole ||
                        !amountFound ||
                        (wordIndexFound === (lastWordFoundIndex + 1) &&
                            (lastWordFound.search(new RegExp(`${pieceOfLastTermFound}$`, 'i')) !== -1) &&
                            amountFound === 1
                        )
                    )
                ) {
                    pieceOfLastTermFound = termPiece;
                    lastWordFound = words[`${wordIndexFound}`];
                    termIndex = lastWordFound.search(new RegExp(termPiece, 'i'));

                    map.mapping[`${wordIndexFound}`] = {
                        researchedPiece: termPiece,
                        termIndex: `${termIndex}`
                    };

                    amountFound += 1;

                    if (termPiece.toUpperCase() === hashTableOfWords[`${wordIndexFound}`].toUpperCase()) {
                        lastTermFoundWasWhole = true;
                    } else {
                        lastTermFoundWasWhole = false;
                    }

                    lastWordFoundIndex = wordIndexFound;

                    // to search only in order
                    do {
                        delete hashTableOfWords[`${wordIndexFound}`];
                    }
                    while (--wordIndexFound >= 0);
                } else {
                    break;
                }
            }

            if (amountFound === piecesOfTerms.length) {
                return map;
            }
        }

        return null;
    }

    private indexOfTerm(words: object, term: string, fromBeginning: boolean = false): number {
        let regexp: RegExp;

        let word: string;

        const indexes = Object.keys(words);

        term = term.trim();

        regexp = new RegExp(term, 'i');

        if (fromBeginning) {
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

}
