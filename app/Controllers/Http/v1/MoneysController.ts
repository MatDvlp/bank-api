import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Account from "App/Models/Account";

export default class MoneysController {
  public async give(ctx: HttpContextContract): Promise<any> {
    const iban: string = String(ctx.params.iban)
    const verify_account: Account | null = await Account.findBy("iban", iban)
    if (verify_account) {
      const amount: number = ctx.params.amount
      await Account
        .query()
        .where("iban", iban)
        .increment("money", amount)

      return {
        "message": "Money add with success",
        "code": 200
      }
    } else {
      return {
        "message": "No account with this IBAN number",
        "code": 401
      }
    }
  }

  public async remove(ctx: HttpContextContract): Promise<any> {
    const iban: string = String(ctx.params.iban)
    const verify_account: Account | null = await Account.findBy("iban", iban)
    if (verify_account) {
      const amount: number = ctx.params.amount
      await Account
        .query()
        .where("iban", iban)
        .decrement("money", amount)

      return ctx.response.accepted({
        "message": "Money remove with success",
        "code": 200
      })
    } else {
      return ctx.response.notFound({
        "message": "No account with this IBAN number",
        "code": 404
      })
    }
  }

  public async transfer(ctx: HttpContextContract): Promise<void> {
    const first_iban: string = String(ctx.params.iban_first)
    const verify_account: Account | null = await Account.findBy("iban", first_iban)
    if(verify_account) {
      const second_iban: string = String(ctx.params.iban_second)
      const verify_account: Account | null = await Account.findBy("iban", second_iban)
      if(verify_account) {
        const first_account: Account | null = await Account.findBy("iban", ctx.params.iban_first)
        const amount: number = ctx.params.amount
        if(first_account!.money > amount) {
          await Account
            .query()
            .where("iban", ctx.params.iban_first)
            .decrement("money", amount)

          await Account
            .query()
            .where("iban", ctx.params.iban_second)
            .increment("money", amount)

          ctx.response.accepted({
            "message": "Money well transferred",
            "code": 200
          })
        } else {
          return ctx.response.notAcceptable({
            "message": "The account transferring the money does not have enough funds",
            "code": 406
          })
        }
      } else {
        return ctx.response.notFound({
          "message": "Second IBAN is invalid",
          "code": 404
        })
      }
    } else {
      return ctx.response.notFound({
        "message": "First IBAN is invalid",
        "code": 404
      })
    }
  }
}
