import { LoadUserAccontRepository } from "@/data/contracts/repos"
import { IBackup, IMemoryDb, newDb } from 'pg-mem'
import { getConnection, getRepository, Repository } from "typeorm"
import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from "@/infra/postgres/repos"

const makeFakeDb = async (entities?: any[]): Promise<IMemoryDb> => {
    const db = newDb();
    const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: entities ?? ['src/infra/postgres/entities/index.ts']
    })

    await connection.synchronize();
    return db;
}

describe('PgUserAccountRepository', () => {
    let sut: PgUserAccountRepository
    let pgUserRepo: Repository<PgUser>
    let backup: IBackup

    beforeAll(async () => {
        const db = await makeFakeDb([PgUser])
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
    describe("Load", () => {
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

    describe("SaveWithFacebook", () => {
        it('Should create an account if id is undefined', async () => {
            const { id } = await sut.saveWithFacebook({
                email: 'any_email',
                name: 'any_name',
                facebookId: 'any_fb_id',
            })
            const pgUser = await pgUserRepo.findOne({ email: 'any_email' })

            expect(pgUser?.id).toBe(1)
            expect(id).toBe(id)
        })

        it('Should update an account if id is defined', async () => {
            await pgUserRepo.save({
                email: 'any_email',
                name: 'any_name',
                facebookId: 'any_fb_id',
            })

            const { id } = await sut.saveWithFacebook({
                id: '1',
                email: 'new_email',
                name: 'new_name',
                facebookId: 'new_fb_id',
            })

            const pgUser = await pgUserRepo.findOne({ id: 1 })


            expect(pgUser).toEqual({
                id: 1,
                email: 'any_email',
                name: 'new_name',
                facebookId: 'new_fb_id',
            })
            expect(id).toBe('1')
        })
    })
})
