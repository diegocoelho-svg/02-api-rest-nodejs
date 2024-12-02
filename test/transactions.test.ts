import { expect, it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import { execSync } from 'child_process' // executar comandos do terminal por dentro da aplicação node
import request from 'supertest'
import { app } from '../src/app' //vai tentar subir um servidor na porta 3333

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  }) //executa antes de todos os testes -> Each
  
  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })
  
  it('should be able to create a new transaction', async () => {
    await request(app.server).post('/transactions').send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server).post('/transactions').send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })
    
    const cookies = createTransactionResponse.get('set-cookie');
    console.log(cookies)

    if (!cookies) throw new Error ('error!!')
    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New Transaction',
        amount: 5000,
      })
    ])
  })

})

