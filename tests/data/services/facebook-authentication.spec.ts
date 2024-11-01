import { AuthenticationError } from "@/domain/errors";
import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { FacebookAuthenticationService } from "@/data/services"; 

    describe('FacebookAuthenticationService', () => {
        it('Should call LoadFacebookUserApi with correct params', async () => {
            const LoadFacebookUserApi = {
                loadUser: jest.fn()
            }
            const sut = new FacebookAuthenticationService(LoadFacebookUserApi)

            await sut.perform({ token: 'any_token' })
            expect(LoadFacebookUserApi.loadUser).toHaveBeenCalledWith({token: 'any_token'})
            expect(LoadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
        })

        it('Should return AuthenticationError when LoadFacebookUserApi return undefined', async () => {
            const LoadFacebookUserApi = {
                loadUser: jest.fn()
            }
            LoadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)
            const sut = new FacebookAuthenticationService(LoadFacebookUserApi)

            const authResult = await sut.perform({ token: 'any_token' })
            expect(authResult).toEqual(new AuthenticationError())
        })
    })
