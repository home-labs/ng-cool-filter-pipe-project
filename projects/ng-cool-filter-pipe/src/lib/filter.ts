import { stringify } from '@angular/compiler/src/util';
import { IFilteredMap } from './i-filtered-map';

import { IHashTableOfWords } from './i-hash-table-of-words';


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
            collection = (this.filteredCollectionCacheHashTableIndex as any)[term];
        } else if (this.filteredCollectionCache.length) {
            collection = this.filteredCollectionCache;
        }

        if (!properties.length) {
            properties = Object.keys(collection[0]);
        }

        if (term === '') {
            if (!this.filteredCollectionCacheHashTableIndex.hasOwnProperty(term)) {
                collection.forEach(
                    (item: object) => {
                        map = new Object();
                        map.source = item;
                        this.initialMaps.push(map);
                    }
                );
            }

            filtered = collection;
            maps = this.initialMaps;
        } else {
            collection.forEach(
                (item: object) => {
                    for (const property of properties) {
                        map = this.mapIfFound(term, (item as any)[property]) as IFilteredMap;
                        if (map) {
                            filtered.push(item);
                            map.source = item;
                            maps.push(map);
                            break;
                        }
                    }
                }
            );
        }

        this.filteredCollectionCache = filtered;
        (this.filteredCollectionCacheHashTableIndex as any)[term] = filtered;

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

        if ((hashTableOfWords.length)! >= piecesOfTerms.length) {

            for (const termPiece of piecesOfTerms) {

                if (amountFound) {
                    wordIndexFound = this.indexOfTerm(hashTableOfWords, termPiece, true);
                } else {
                    wordIndexFound = this.indexOfTerm(hashTableOfWords, termPiece);
                }

                // a partir do primeiro termo a busca é feita em qualquer parte do texto; a partir do segundo a busca só retorna algo se o último termo encontrado coincidiu com a palavra à esquerda inteira ou com o final desta. Se foi coincidido com a palavra inteira qualquer outra à direita da última palavra encontrada poderá ser encontrada
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
                    lastWordFound = words[wordIndexFound];
                    termIndex = lastWordFound.search(new RegExp(termPiece, 'i'));

                    (map.mapping as any)[wordIndexFound] = {
                        researchedPiece: termPiece,
                        termIndex: `${termIndex}`
                    };

                    amountFound += 1;

                    if (termPiece.toUpperCase() === (hashTableOfWords as any)[wordIndexFound].toUpperCase()) {
                        lastTermFoundWasWhole = true;
                    } else {
                        lastTermFoundWasWhole = false;
                    }

                    lastWordFoundIndex = wordIndexFound;

                    // to search only in order
                    do {
                        delete (hashTableOfWords as any)[wordIndexFound];
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

        let i = -1;

        let word: string;

        term = term.trim();

        if (fromBeginning) {
            term = `^${term}`;
        }

        regexp = new RegExp(term, 'i');

        for (const wordIndex in words) {
            word = (words as any)[wordIndex];
            ++i;
            if (typeof word === 'string') {
                if (word.search(regexp) !== -1) {
                    return i;
                }
            }
        }

        return -1;
    }

    private asCountableLiteral(collection: object): object {
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
