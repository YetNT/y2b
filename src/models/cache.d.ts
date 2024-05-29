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

interface Inventory {
    shield: {
        amt: number;
        hp: number;
    };
    [key: keyof typeof withoutShield]: number;
}

interface User {
    userId: string;
    balance?: number;
    bank?: number;
    badges?: {
        [key: keyof typeof badges]: boolean;
    };
    inventory: Inventory;
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

    #addDocument(doc: { [key: string]: any }): void;

    /**
     * Get a single document
     */
    async #getDocument(query: {
        [key: string]: any;
    }): Promise<User | ServerCommand>;

    /**
     * Get a single document
     */
    async #getDocument(query: { userId: string }): Promise<User>;

    /**
     * Get a single document
     */
    async #getDocument(query: { guildId: string }): Promise<ServerCommand>;

    async #getDocuments(
        filter: (doc: { userId: string }) => boolean
    ): Promise<User[]>;
    async #getDocuments(
        filter: (doc: { guildId: string }) => boolean
    ): Promise<ServerCommand[]>;
    async #getDocuments(
        filter: (doc: { [key: string]: any }) => boolean
    ): Promise<User | ServerCommand[]>;

    async findOne(query: { userId: string }): Promise<User>;
    async findOne(query: { guildId: string }): Promise<ServerCommand>;
    //async findOne(query: { [key: string]: any }): Promise<User | ServerCommand>;

    // async find(
    //     filter: (doc: { [key: string]: any }) => boolean
    // ): Promise<User | ServerCommand[]>;
    async find(filter: (doc: { userId: string }) => boolean): Promise<User[]>;
    async find(
        filter: (doc: { guildId: string }) => boolean
    ): Promise<ServerCommand[]>;

    async save(doc: object): Promise<void>;

    newDoc(obj: User): object;
    newDoc(obj: ServerCommand): object;

    runDb(func: (model: any) => any): Promise<any>;
}

declare const cache: Cache<string>;

export { CachedSchema, cache, Inventory, User };
