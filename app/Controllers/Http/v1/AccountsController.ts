import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Account from "App/Models/Account";

export default class AccountsController {
  public async create(ctx: HttpContextContract): Promise<any> {
    const titular_name: string = String(ctx.params.titular_name)
    const account_verify: Account | null = await Account.findBy("titular", titular_name)
    if (account_verify) {
      return ctx.response.unauthorized({
        "message": "You already have an account with this name, log in",
        "code": 403
      })
    }
    const account: Account = await Account.create({
      titular: titular_name,
      money: 0
    })
    return ctx.response.accepted( {
      "message": "Account create with success",
      "secret-code": account.password,
      "code": 201
    })
  }

  public async delete(ctx: HttpContextContract): Promise<any> {
    const titular_name: string = String(ctx.params.titular_name)
    const code: string = String(ctx.params.code)
    const account_verify: Account | null = await Account.findBy("titular", titular_name)
    if (account_verify) {
      if (account_verify.password === code) {
        await account_verify.delete()
        return {
          "message": "Account delete with success",
          "code": 202
        }
      } else {
        return {
          "message": "Code is not correct",
          "code": 401
        }
      }
    } else {
      return {
        "message": "Account not exist",
        "code": 401
      }
    }
  }
}
