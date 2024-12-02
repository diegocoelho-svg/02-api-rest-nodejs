import { it, beforeAll, afterAll, describe } from 'vitest'
import request from 'supertest'
import { app } from '../src/app' //vai tentar subir um servidor na porta 3333

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  }) //executa antes de todos os testes -> Each
  
  afterAll(async () => {
    await app.close()
  })
  
  it.only('should be able to create a new transaction', async () => {
    // fazer a chamada http p/ criar uma nova transação
    const response = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })
  
      .expect(201) // -> valida se o retorno foi um status 201

    console.log(response.headers) // ou pode ser console.log(response.get('Set-cookie'))
  })

  it.skip('should be able to list all transactions', async () => {

  })

})

