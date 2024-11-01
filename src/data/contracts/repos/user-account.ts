export interface LoadUserAccontRepository {
    load: (params: LoadUserAccontRepository.Params) => Promise<LoadUserAccontRepository.Result>
}

export namespace LoadUserAccontRepository {
    export type Params = {
        email: string
    }

    export type Result = undefined
}

export interface createFacebookAccountRepository {
    createFromFacebook: (params: CreateFacebookAccountRepository.Params) => Promise<void>
}

export namespace CreateFacebookAccountRepository {
    export type Params = {
        email: string
        name: string,
        facebookId: string
    }

}

