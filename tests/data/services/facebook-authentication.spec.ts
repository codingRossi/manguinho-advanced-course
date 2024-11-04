import { AuthenticationError } from "@/domain/errors";
import { SaveFacebookAccountRepository, LoadUserAccontRepository } from "@/data/contracts/repos";
import { FacebookAuthenticationService } from "@/data/services";
import { mock, MockProxy } from 'jest-mock-extended'
import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { TokenGenerator } from "@/data/contracts/crypto";
import { AccessToken } from "@/domain/models";

// type SutTypes = {
//     sut: FacebookAuthenticationService,
//     LoadFacebookUserApi: MockProxy<LoadFacebookUserApi>,
// }
// const makeSut = (): SutTypes => {
//     const LoadFacebookUserApi = mock<LoadFacebookUserApi>()
//     const sut = new FacebookAuthenticationService(LoadFacebookUserApi)
//     return {
//         sut,
//         LoadFacebookUserApi
//     }
// }

describe('FacebookAuthenticationService', () => {
    const token = 'any_token'
    let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
    let crypto: MockProxy<TokenGenerator>
    let userAccountRepo: MockProxy<LoadUserAccontRepository & SaveFacebookAccountRepository>
    let sut: FacebookAuthenticationService

    beforeEach(() => {
        loadFacebookUserApi = mock()
        loadFacebookUserApi.loadUser.mockResolvedValue({
            name: 'any_fb_name',
            email: 'any_fb_email',
            facebookId: 'any_fb_id'
        })
        userAccountRepo = mock(),
        userAccountRepo.load.mockResolvedValue(undefined),
        userAccountRepo.saveWithFacebook.mockResolvedValue({ id: 'any_account_id'}),
        crypto = mock(),
        crypto.generateToken.mockResolvedValue('any_generated_token')
        sut = new FacebookAuthenticationService(
            loadFacebookUserApi,
            userAccountRepo,
            crypto
        )
    })
    it('Should call LoadFacebookUserApi with correct params', async () => {
        await sut.perform({ token: 'any_token' })

        expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
        expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
    })

    it('Should return AuthenticationError when LoadFacebookUserApi return undefined', async () => {
        loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)

        const authResult = await sut.perform({ token })
        expect(authResult).toEqual(new AuthenticationError())
    })

    it('Should call LoadUserAccountRepo when LoadFacebookUserApi return data', async () => {
        await sut.perform({ token })

        expect(userAccountRepo.load).toHaveBeenCalledWith({email: 'any_fb_email'})
        expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
    })

    it('Should create account with facebook data', async () => {
        await sut.perform({ token })

        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
            email: 'any_fb_email',
            name: "any_fb_name",
            facebookId: 'any_fb_id'
        })
        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
    })

    it('Should not update account name', async () => {
        userAccountRepo.load.mockResolvedValueOnce({
            id: 'any_id',
            name: 'any_name',
        })

        await sut.perform({ token })

        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
            id: 'any_id',
            name: 'any_name',
            email: 'any_fb_email',
            facebookId: 'any_fb_id'
        })
        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
    })

    it('Should update account name', async () => {
        userAccountRepo.load.mockResolvedValueOnce({
            id: 'any_id',
        })

        await sut.perform({ token })

        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
            id: 'any_id',
            name: "any_fb_name",
            email: 'any_fb_email',
            facebookId: 'any_fb_id'
        })
        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
    })

    it('Should call TokenGenerator with correct params', async () => {
        await sut.perform({ token })

        expect(crypto.generateToken).toHaveBeenCalledWith({
             key: 'any_account_id',
             expirationInMs: AccessToken.expirationInMs,
            })
        expect(crypto.generateToken).toHaveBeenCalledTimes(1)
    })

    it('Should return an AccessToken on success', async () => {
        const authResult = await sut.perform({ token })

        expect(authResult).toEqual(new AccessToken('any_generated_token'))
    })

    it('Should rethrow if LoadFacebookUserApi throws', async () => {
        loadFacebookUserApi.loadUser.mockRejectedValueOnce(new Error('fb_error'))

        const promise = sut.perform({ token })

        await expect(promise).rejects.toThrow(new Error('fb_error'))
    })

    it('Should rethrow if LoadFacebookUserApi throws', async () => {
        userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'))

        const promise = sut.perform({ token })

        await expect(promise).rejects.toThrow(new Error('load_error'))
    })

    it('Should rethrow if SaveFacebookAccountRepository throws', async () => {
        userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))

        const promise = sut.perform({ token })

        await expect(promise).rejects.toThrow(new Error('save_error'))
    })

    it('Should rethrow if SaveFacebookAccountRepository throws', async () => {
        crypto.generateToken.mockRejectedValueOnce(new Error('token_error'))

        const promise = sut.perform({ token })

        await expect(promise).rejects.toThrow(new Error('token_error'))
    })
})

