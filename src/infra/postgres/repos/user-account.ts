import { LoadUserAccontRepository } from "@/data/contracts/repos"
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
}
