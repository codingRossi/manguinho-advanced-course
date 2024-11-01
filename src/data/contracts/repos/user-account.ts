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

export interface CreateFacebookAccountRepository {
    createFromFacebook: (params: CreateFacebookAccountRepository.Params) => Promise<void>
}

export namespace CreateFacebookAccountRepository {
    export type Params = {
        email: string
        name: string,
        facebookId: string
    }

}

export interface UpdateFacebookAccountRepository {
    updateWithFacebook: (params: UpdateFacebookAccountRepository.Params) => Promise<void>
}

export namespace UpdateFacebookAccountRepository {
    export type Params = {
        id: string,
        name: string,
        facebookId: string,
        }

}
