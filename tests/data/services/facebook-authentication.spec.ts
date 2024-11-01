import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthenticationService } from "@/data/services"; 

import { mock } from 'jest-mock-extended'
import { LoadFacebookUserApi } from "@/data/contracts/apis";

    describe('FacebookAuthenticationService', () => {
        it('Should call LoadFacebookUserApi with correct params', async () => {
            const LoadFacebookUserApi = mock<LoadFacebookUserApi>()
            const sut = new FacebookAuthenticationService(LoadFacebookUserApi)

            await sut.perform({ token: 'any_token' })
            expect(LoadFacebookUserApi.loadUser).toHaveBeenCalledWith({token: 'any_token'})
            expect(LoadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
        })

        it('Should return AuthenticationError when LoadFacebookUserApi return undefined', async () => {
            const LoadFacebookUserApi = mock<LoadFacebookUserApi>()
            LoadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)
            const sut = new FacebookAuthenticationService(LoadFacebookUserApi)

            const authResult = await sut.perform({ token: 'any_token' })
            expect(authResult).toEqual(new AuthenticationError())
        })
    })
