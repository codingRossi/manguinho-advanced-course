import { AuthenticationError } from "@/domain/errors";
import { LoadUserAccontRepository, createFacebookAccountRepository } from "@/data/contracts/repos";
import { FacebookAuthenticationService } from "@/data/services";
import { mock, MockProxy } from 'jest-mock-extended'
import { LoadFacebookUserApi } from "@/data/contracts/apis";


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
    let createFacebookAccountRepo: MockProxy<createFacebookAccountRepository>
    let loadUserAccountRepo: MockProxy<LoadUserAccontRepository>
    let sut: FacebookAuthenticationService

    beforeEach(() => {
        loadFacebookUserApi = mock()
        loadFacebookUserApi.loadUser.mockResolvedValue({
            name: 'any_fb_name',
            email: 'any_fb_email',
            facebookId: 'any_fb_id'
        })
        loadUserAccountRepo = mock(),
        createFacebookAccountRepo = mock(),
        sut = new FacebookAuthenticationService(
            loadFacebookUserApi,
            loadUserAccountRepo,
            createFacebookAccountRepo
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

        expect(loadUserAccountRepo.load).toHaveBeenCalledWith({email: 'any_fb_email'})
        expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
    })

    it('Should call CreateUserAccountRepo when LoadFacebookUserApi return undefined', async () => {
        loadUserAccountRepo.load.mockResolvedValueOnce(undefined)

        await sut.perform({ token })

        expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledWith({
            email: 'any_fb_email',
            name: "any_fb_name",
            facebookId: 'any_fb_id'
        })
        expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
    })
})

