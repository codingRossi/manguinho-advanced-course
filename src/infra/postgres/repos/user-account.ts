import { LoadUserAccontRepository, SaveFacebookAccountRepository } from "@/data/contracts/repos"
import { getRepository } from "typeorm"
import { PgUser } from "@/infra/postgres/entities"

type LoadParams = LoadUserAccontRepository.Params
type LoadResult = LoadUserAccontRepository.Result
type SaveParams = SaveFacebookAccountRepository.Params
type SaveResult = SaveFacebookAccountRepository.Result


export class PgUserAccountRepository implements LoadUserAccontRepository, SaveFacebookAccountRepository {
    private readonly pgUserRepo = getRepository(PgUser)
    async load(params: LoadParams): Promise<LoadResult> {
        const pgUserRepo = getRepository(PgUser)
        const pgUser = await this.pgUserRepo.findOne({
            where: {
                email: params.email
            },
        })
        if (pgUser !== undefined) {
            return {
                id: pgUser!.id?.toString(),
                name: pgUser?.name ?? undefined,
            }
        }
    }

    async saveWithFacebook(params: SaveParams): Promise<SaveResult> {
        let id: string
        if (params.id === undefined) {
            const pgUser = await this.pgUserRepo.save({
                email: params.email,
                name: params.name,
                facebookId: params.facebookId,
            })
            id = pgUser.id.toString()
        } else {
            id = params.id
            await this.pgUserRepo.update({
                id: parseInt(params.id)
            }, {
                name: params.name,
                facebookId: params.facebookId,
            })
        }
        return { id }

    }
}
