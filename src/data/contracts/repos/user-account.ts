export interface LoadUserAccontRepository {
    load: (params: LoadUserAccontRepository.Params) => Promise<void>
}

export namespace LoadUserAccontRepository {
    export type Params = {
        email: string
    }
}