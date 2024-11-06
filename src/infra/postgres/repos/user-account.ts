import { LoadUserAccontRepository, SaveFacebookAccountRepository } from "@/data/contracts/repos"
import { getRepository } from "typeorm"
import { PgUser } from "@/infra/postgres/entities"

export class PgUserAccountRepository implements LoadUserAccontRepository {
    async load(params: LoadUserAccontRepository.Params): Promise<LoadUserAccontRepository.Result> {
        const pgUserRepo = getRepository(PgUser)
        const pgUser = await pgUserRepo.findOne({
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

    async saveWithFacebook (params: SaveFacebookAccountRepository.Params): Promise<void> {
        const pgUserRepo = getRepository(PgUser)
        if (params.id === undefined ) {
            await pgUserRepo.save({
                email: params.email,
                name: params.name,
                facebookId: params.facebookId,
            }) 
        } else {
            await pgUserRepo.update({
                id: parseInt(params.id),
            }, {
                name: params.name,
                facebookId: params.facebookId,
            })
        }
    }
}
