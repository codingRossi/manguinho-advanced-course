import { FacebookAccount } from "@/domain/models";

describe('FacebookAccont', () => {
    const fbData = {
        name: 'any_fb_name',
        email: 'any_fb_email',
        facebookId: 'any_fb_id'
    }
  it('Should create with facebook data only' , () => {
    const sut = new FacebookAccount(fbData);

    expect(sut).toEqual({
        name: 'any_fb_name',
        email: 'any_fb_email',
        facebookId: 'any_fb_id'
    })
  })

  it('Should update name if its empty', () => {
    const accountData = {id: 'any_id'}
    const sut = new FacebookAccount(fbData, accountData);

    expect(sut).toEqual({
        id: 'any_id',
        name: 'any_fb_name',
        email: 'any_fb_email',
        facebookId: 'any_fb_id'
    })
})

it('Should not update name if its empty', () => {
    const accountData = {id: 'any_id', name: 'any_name'}
    const sut = new FacebookAccount(fbData, accountData);

    expect(sut).toEqual({
        id: 'any_id',
        name: 'any_name',
        email: 'any_fb_email',
        facebookId: 'any_fb_id'
    })
})
})
