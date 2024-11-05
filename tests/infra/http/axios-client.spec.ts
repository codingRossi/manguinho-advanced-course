import { HttpGetClient } from "@/infra/http"
import axios from 'axios'

jest.mock('axios')

class AxiosHttpClient {
    async get(args: HttpGetClient.Params): Promise<void> {
        await axios.get(args.url, { params: args.params })
    }
}

describe('AxiosHttpClient', () => {
    let sut: AxiosHttpClient;
    let fakeAxios: jest.Mocked<typeof axios>
    let url: string
    let params: object

    beforeAll(() => {
        url = 'any_url'
        fakeAxios = axios as jest.Mocked<typeof axios>
        params = {
            any: 'any'
        }
    })

    beforeEach(() => {
        sut = new AxiosHttpClient();
    })
    describe('GET', () => {
        it('Should call get with correct params', async () => {
            const sut = new AxiosHttpClient()

            await sut.get({url: url, params: params })
            expect(fakeAxios.get).toHaveBeenCalledWith(url, { params: params })
            expect(fakeAxios.get).toHaveBeenCalledTimes(1)
        })
    })
})