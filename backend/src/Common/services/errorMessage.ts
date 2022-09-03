export interface GenericError {
    message: string;
}

export function isGenericError(args: unknown): args is GenericError {
    const partialPayload = args as Partial<GenericError>;
    return (
        // args could be a non-object, e.g. a string or number
        typeof args === "object" &&
        // check the fields of the object, also implicitly checks if null or not
        typeof partialPayload.message === "string"
    );
}
