export interface LoadUserAccontRepository {
    load: (params: LoadUserAccontRepository.Params) => Promise<LoadUserAccontRepository.Result>
}

export namespace LoadUserAccontRepository {
    export type Params = {
        email: string
    }

    export type Result = undefined | {
        id: string,
        name?: string
    }
}

export interface SaveFacebookAccountRepository {
    saveWithFacebook: (params: SaveFacebookAccountRepository.Params) => Promise<SaveFacebookAccountRepository.Result>
}

export namespace SaveFacebookAccountRepository {
    export type Params = {
        id?: string,
        email: string
        name: string,
        facebookId: string
    }

    export type Result = {
        id: string,
    }
}
