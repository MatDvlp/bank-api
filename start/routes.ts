/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group((): void => {
  Route.group((): void => {
    Route.group((): void => {
      Route.get('/create/:titular_name', 'AccountsController.create').as("createAccount")
      Route.get('/delete/:titular_name/:code', 'AccountsController.delete').as("deleteAccount")
    }).prefix("/account")

    Route.group((): void => {
      Route.get('/give/:iban/:amount', 'MoneysController.give').as("giveMoney")
      Route.get('/remove/:iban/:amount', 'MoneysController.remove').as("removeMoney")
      Route.get('/transfer/:iban_first/:iban_second/:amount', 'MoneysController.transfer').as("transferMoney")
    }).prefix("/money")
  }).prefix("/v1").namespace("App/Controllers/Http/v1")
}).prefix("/api").middleware('auth')



