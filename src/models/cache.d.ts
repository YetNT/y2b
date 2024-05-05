declare module "mongoose" {
    import { Schema, Document, Model } from "mongoose";

    export interface CachedModel<T extends Document> extends Model<T> {}

    export function model<T extends Document>(
        name: string,
        schema?: Schema
    ): CachedModel<T>;
}

declare module "node-cache" {
    export class NodeCache {
        constructor();
        set(key: string, value: string): void;
        get(key: string): string | undefined;
    }
}

declare module "lodash" {
    interface LoDashStatic {
        isEqual(value: any, other: any): boolean;
    }
}

interface Cache<T> {
    set(key: string, value: T): void;
    get(key: string): T | undefined;
}

import { withoutShield } from "../utils/misc/items/getItems";
import { default as badges } from "../utils/misc/badges/badges.json";
import { default as promocodes } from "../../promocodes.json";
import * as cooldowns from "../utils/misc/cooldowns";

interface User {
    userId: string;
    balance?: number;
    bank?: number;
    badges?: {
        [key: keyof typeof badges]: boolean;
    };
    inventory: {
        shield: {
            amt: number;
            hp: number;
        };
        [key: keyof typeof withoutShield]: number;
    };
    blacklist?: {
        ed: boolean;
        reason: string;
        time: Date;
    };
    promocode?: {
        [key: keyof typeof promocodes]: boolean;
    };
    cooldowns?: {
        [key: keyof typeof cooldowns]: boolean;
    };
}

interface ServerCommand {
    guildId: string;
    rob: boolean;
}

declare class CachedSchema {
    name: "user" | "serverCommand";
    id: "userId" | "guildId";
    model: any;
    cache: Cache<string>;

    constructor(name: string, body: object);

    addDocument(doc: object): void;

    getDocument(query: object): Promise<User | ServerCommand>;

    getDocuments(
        filter: (doc: object) => boolean
    ): Promise<User | ServerCommand[]>;

    findOne(query: object): Promise<User | ServerCommand>;

    find(filter: (doc: object) => boolean): Promise<User | ServerCommand[]>;

    save(doc: object): Promise<void>;

    newDoc(obj: object): object;

    runDb(func: (model: any) => any): Promise<any>;
}

declare const cache: Cache<string>;

export { CachedSchema, cache };
