import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import {beforeCreate} from "@adonisjs/lucid/build/src/Orm/Decorators";
import { v4 as uuidv4 } from 'uuid';

export default class Account extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public titular: string

  @column()
  public iban: string

  @column()
  public bic: string

  @column()
  public password: string

  @column()
  public money: number


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  private static generateRandomNumericString(length: number): string {
    let result: string = '';
    const characters  = '0123456789';
    const charactersLength: number = characters.length;

    for (let i: number = 0; i < length; i++) {
      const randomIndex: number = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }

    return String(result);
  }

  private static generateRandomAlphaNumericString(length: number): string {
    let result: string = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength: number = characters.length;

    for (let i: number = 0; i < length; i++) {
      const randomIndex: number = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  private static generateIBAN(): string {
    const countryCode: "FR" = 'FR';
    const bankCode: string = this.generateRandomNumericString(5);
    const branchCode: string = this.generateRandomNumericString(5);
    const accountNumber: string = this.generateRandomNumericString(11);

    const ibanBase: string = `${countryCode}00${bankCode}${branchCode}${accountNumber}00`;
    const ibanDigits: string = ibanBase.replace(/[A-Z]/g, (match) => {
      return (match.charCodeAt(0) - 55).toString();
    });

    const remainder: string = ibanDigits.slice(0, 2);
    const ibanCheckDigits: string = (98 - (parseInt(remainder) % 97)).toString().padStart(2, '0');

    return `${countryCode}${ibanCheckDigits}${bankCode}${branchCode}${accountNumber}` as string;
  }

  private static generateBIC(): string {
    const bankCode: string = this.generateRandomAlphaNumericString(4);
    const country: "FR" = 'FR';
    const locationCode: string = this.generateRandomAlphaNumericString(2);
    const branchCode: string = this.generateRandomAlphaNumericString(3);

    return `${bankCode}${country}${locationCode}${branchCode}`;
  }

  @beforeCreate()
  public static async addUUID (account: Account) {
    account.id = uuidv4()
  }

  @beforeCreate()
  public static async addIban (account: Account): Promise<void> {
    account.iban = this.generateIBAN()
  }

  @beforeCreate()
  public static async addBic (account: Account): Promise<void> {
    account.bic = this.generateBIC()
  }

  @beforeCreate()
  public static async setPassword (account: Account): Promise<void> {
    account.password = this.generateRandomNumericString(12)
  }
}
