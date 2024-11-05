import { LoadUserAccontRepository } from "@/data/contracts/repos"
import { newDb } from 'pg-mem'
import { BaseEntity, Column, Entity, getRepository, PrimaryGeneratedColumn } from "typeorm"

class PgUserAccountRepository implements LoadUserAccontRepository {
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

@Entity({ name: 'usuarios' })
class PgUser {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ name: 'nome', nullable: true })
    name?: string

    @Column()
    email!: string

    @Column({ name: 'id_facebook', nullable: true })
    facebookId?: string
}

describe('PgUserAccountRepository', () => {
    describe("Load", () => {
        it('Should return an account id email exists', async () => {
            const db = newDb();
            const connection = await db.adapters.createTypeormConnection({
                type: 'postgres',
                entities: [PgUser]
            })

            // create schema
            await connection.synchronize();
            const pgUserRepo = getRepository(PgUser)
            await pgUserRepo.save({ email: 'existing_email' })
            const sut = new PgUserAccountRepository()

            const account = await sut.load({ email: 'existing_email' })
            expect(account).toEqual({ id: '1' })
            await connection.close()
        })

        it('Should return undefined if email does not exists', async () => {
            const db = newDb();
            const connection = await db.adapters.createTypeormConnection({
                type: 'postgres',
                entities: [PgUser]
            })

            await connection.synchronize();
            const sut = new PgUserAccountRepository()

            const account = await sut.load({ email: 'existing_email' })
            expect(account).toBeUndefined();
            await connection.close()
        })
    })
})
