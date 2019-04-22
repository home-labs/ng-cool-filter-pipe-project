export class Filter {

    constructor() {

    }

    getMaps(
        collection: Object[],
        term: string,
        options: Object = {},
        ...properties: string[]
    ): Object[] {
        let
            map: Object
            ;

        const
            maps: Object[] = [];

        if (term !== '') {
            if (typeof options !== 'object') {
                properties.push(options);
            }

            if (!properties.length) {
                properties = Object.keys(collection[0]);
            }

            collection.forEach(
                (object: Object) => {
                    for (const property of properties) {
                        map = this.mapIfFound(term, object[property], options);
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

    private mapIfFound(
        term: string,
        text: string,
        options: Object = {}
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

        if (!options.hasOwnProperty('wholeWhenMoreThanOneWord')) {
        //     options['wholeWhenMoreThanOneWord'] = true;
        }

        if (wordsHashTable['length'] >= termSlices.length) {
            // for (let termSlice of termSlices) {
                // termSlice = termSlice.trim();
            for (let i = 0; i < termSlices.length; i++) {
                termSlice = termSlices[i].trim();

                // se o índice da fatia não for o último a palavra buscada deve ser comparada na íntegra

                // debugger
                // if () {
                //     wordIndex = this.indexOf(wordsHashTable, termSlice,
                //         wordIndex, options['wholeWhenMoreThanOneWord']);
                // } else {
                //     wordIndex = this.indexOf(wordsHashTable, termSlice,
                //         wordIndex);
                // }
                wordIndex = this.indexOf(wordsHashTable, termSlice);
                // debugger
                if (wordIndex !== -1
                    && (wordIndex > cachedWordIndex)
                    && (
                        this.termCount(words, termSlice) >=
                        this.amountOf(termSlices, termSlice)
                    )
                ) {
                    cachedWordIndex = wordIndex

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

    private indexOf(
        object: Object,
        term: string,
        wholeWord: Boolean = false)
        : Number
    {
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
                    if (object[p] === term) {
                        index = Number.parseInt(p);
                        break;
                    }
                }
                i++;
            }
        } else {
            regexp = new RegExp(term, 'i');

            for (const p of properties) {
                if (typeof object[p] === 'string') {
                    if (object[p].search(regexp) !== -1) {
                        index = Number.parseInt(p);
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
