//-Path: "PokeRotom/client/src/types/types.ts"

export type QueryOptions = Partial<
    Record<string, string | boolean | number | undefined | null>
>;

export type Url = `https://${string}` | null;
