import type BaseError from "./base-error.schema"

export type Result<T = unknown, E extends BaseError = BaseError> = { success: true, result: T } | { success: false, error: E }

export interface ServiceCallConfig<C = object> {
    context?: C
}

export type ServiceFunction<ServiceCallData, ResultType> = {
    (data: ServiceCallData, config?: ServiceCallConfig): Promise<Result<ResultType>>
}

export type APIFunction<ResultType, Data extends {} = {}> = {
    (endpoint: string, data?: Data): Promise<Result<ResultType>>
}