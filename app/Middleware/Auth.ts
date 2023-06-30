import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Auth {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const ip: string = String(request.headers().host!.split(":")[0])
    const ips: string[] & string | any = [
      "127.0.0.1"
    ]
    if(!ip.includes(ips)) {
      response.unauthorized({error: "You can't access this"})
      return
    }
    await next()
  }
}
