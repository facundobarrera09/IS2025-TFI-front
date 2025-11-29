/** @typedef {string | number | boolean | null | undefined | {Array<Jsonable>} | { [key: string]: Jsonable } | { toJSON(): Jsonable }} Jsonable */

export const ErrorMessages = {
    UNKNOWN_ERROR: "An unknown error has occured",
    NOT_IMPLEMENTED: "Not implemented"
}

class BaseError extends Error {

    /**
     * 
     * @param {string} message 
     * @param {object} options
     * @param {Error} [options.error]
     * @param {BaseError} [options.cause]
     * @param {Jsonable} [options.context] 
     */
    constructor(message, options = {}) {
        super(message)

        const { cause, context } = options
        
        this.name = this.constructor.name
        /** @type {BaseError | unknown} */
        this.cause = cause
        /** @type {Jsonable} */
        this.context = context
    }
}

export default BaseError