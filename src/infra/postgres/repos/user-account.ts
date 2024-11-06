import { LoadUserAccontRepository, SaveFacebookAccountRepository } from "@/data/contracts/repos"
import { getRepository } from "typeorm"
import { PgUser } from "@/infra/postgres/entities"

type LoadParams = LoadUserAccontRepository.Params
type LoadResult = LoadUserAccontRepository.Result
type SaveParams = SaveFacebookAccountRepository.Params


export class PgUserAccountRepository implements LoadUserAccontRepository {
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

    async saveWithFacebook (params: SaveParams): Promise<void> {
        if (params.id === undefined ) {
            await this.pgUserRepo.save({
                email: params.email,
                name: params.name,
                facebookId: params.facebookId,
            }) 
        } else {
            await this.pgUserRepo.update({
                id: parseInt(params.id),
            }, {
                name: params.name,
                facebookId: params.facebookId,
            })
        }
    }
}
