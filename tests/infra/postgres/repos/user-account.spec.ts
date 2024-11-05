import { LoadUserAccontRepository } from "@/data/contracts/repos"
import { IBackup, newDb } from 'pg-mem'
import { BaseEntity, Column, Entity, getConnection, getRepository, PrimaryGeneratedColumn, Repository } from "typeorm"

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
        let sut: PgUserAccountRepository
        let pgUserRepo: Repository<PgUser>
        let backup: IBackup

        beforeAll(async () => {
            const db = newDb();
            const connection = await db.adapters.createTypeormConnection({
                type: 'postgres',
                entities: [PgUser]
            })

            await connection.synchronize();
            backup = db.backup()
            pgUserRepo = getRepository(PgUser)
        })

        afterAll(async () => {
            await getConnection().close()
        })
        beforeEach(() => {
            backup.restore()
            sut = new PgUserAccountRepository()

        })
        it('Should return an account id email exists', async () => {
            await pgUserRepo.save({ email: 'existing_email' })

            const account = await sut.load({ email: 'existing_email' })
            expect(account).toEqual({ id: '1' })
        })

        it('Should return undefined if email does not exists', async () => {

            const account = await sut.load({ email: 'existing_email' })
            expect(account?.name).toBeUndefined();
        })
    })
})
