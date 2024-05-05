const { Schema, model } = require("mongoose");
const NodeCache = require("node-cache");
const _ = require("lodash");

// Create a new instance of NodeCache
const cache = new NodeCache();

class CachedSchema {
    constructor(name, body) {
        this.name = name;
        /**
         * Id which to get. User schema uses it's own parameter, userId, and ServerCommand uses guildId
         */
        this.id =
            name === "user"
                ? "userId"
                : name === "serverCommand"
                ? "guildId"
                : undefined;
        const scheme = new Schema(body);
        // model('user', schema: Schema)
        this.model = model(name, scheme);
        this.cache = cache;
    }

    /**
     * Save an array (Collection) to the cache.
     * @param {{}[]} existing
     */
    #cacheSave(existing) {
        const serializedData = JSON.stringify(existing);
        this.cache.set(this.name, serializedData);
    }

    /**
     * Get one array (Collection) from cache
     * @returns {{}[]}
     */
    #cacheGet() {
        const serializedData = this.cache.get(this.name);
        return serializedData ? JSON.parse(serializedData) : [];
    }

    /**
     * Add one document to the class's collection's cache.
     * @param {{*}} doc
     */
    #addDocument(doc) {
        const existing = this.#cacheGet();
        existing.push(doc);
        this.#cacheSave(existing);
    }

    async #documentExistsInDb(query) {
        const doc = await this.model.findOne(query);
        if (doc == null) {
            return false;
        } else {
            return true;
        }
    }

    async #getDocument(query) {
        let existing = this.#cacheGet();
        if (existing.length === 0) {
            const doc = await this.model.findOne(query);
            existing.push(doc);
            this.#cacheSave(existing);
            return doc;
        }

        for (const key of Object.keys(query)) {
            existing = existing.filter((e) => {
                if (e === null) return false;
                const isEqual = _.isEqual(e[key], query[key]);
                return isEqual;
            });
        }
        if (existing.length > 0) {
            return existing[0];
        } else {
            let doc = await this.model.findOne(query);
            if (doc == null) {
                doc = null;
            } else {
                this.#addDocument(doc);
            }
            return doc;
        }
    }

    async #getDocuments(filter) {
        const existing = this.#cacheGet();
        const docs = await this.model.find();
        if (existing.length === docs.length) {
            return existing.filter(filter);
        } else {
            existing.push(...docs);
            this.#cacheSave(existing);
            return docs.filter(filter);
        }
    }

    /**
     * MongoDB get document equalvalent with caching though.
     * @param {{*}} query Object query
     * @returns
     */
    async findOne(query) {
        return await this.#getDocument(query);
    }

    /**
     * @param {(({}) => {})} filter
     * @returns {{}[]}
     */
    async find(filter) {
        let docs = await this.#getDocuments(filter);

        return docs;
    }

    /**
     * MongoDB save document. Saves a single document to both the database, then copies over the entries to the cache.
     */
    async save(doc) {
        delete doc._id;
        delete doc.__v;
        if (
            (await this.#documentExistsInDb({ [this.id]: doc[this.id] })) ==
            false
        ) {
            await this.model.create(doc);
        } else {
            await this.model.updateOne(
                { [this.id]: doc[this.id] },
                { $set: doc }
            ); // since this is a single document, we can just use mongodb's save method
        }
        let existing = this.#cacheGet();

        if (existing.length !== 0) {
            existing = existing.filter((e) => {
                return e !== null && e[this.id] !== doc[this.id];
            });
        }
        existing.push(doc);
        this.#cacheSave(existing);
    }

    /**
     * MongoDB equavlianet for Document.save(). Since i cant find  way to append this method to the actual document to keep old code the same, this has to be used.
     * @param {{*}} obj
     * @returns
     */
    newDoc(obj) {
        return new this.model(obj);
    }

    /**
     * This method is purely for commands that just fucking refuse to work with the cache in any sort of way. So just give access to the model.
     * Run a db command with the provided model. Intended for leaderboard only
     * @param {(model: model) => {}} func
     * @returns {any}
     */
    async runDb(func) {
        return await func(this.model);
    }

    // (only the functions i need will be added)
}

module.exports = { CachedSchema, cache };
