import { AuthenticationError } from "@/domain/errors";
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
    let LoadFacebookUserApi: MockProxy<LoadFacebookUserApi>
    let sut: FacebookAuthenticationService

    beforeEach(() => {
        LoadFacebookUserApi = mock()
        sut = new FacebookAuthenticationService(LoadFacebookUserApi)
    })
    it('Should call LoadFacebookUserApi with correct params', async () => {
        await sut.perform({ token: 'any_token' })

        expect(LoadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
        expect(LoadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
    })

    it('Should return AuthenticationError when LoadFacebookUserApi return undefined', async () => {
        LoadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)

        const authResult = await sut.perform({ token: 'any_token' })
        expect(authResult).toEqual(new AuthenticationError())
    })
})
