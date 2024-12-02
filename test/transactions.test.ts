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

  it('should be able to get a specific transaction', async () => {
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

    const transactionId = listTransactionsResponse.body.transactions[0].id
    
    const getTransactionsResponse = await request(app.server)
    .get(`/transactions/${transactionId}`)
    .set('Cookie', cookies)
    .expect(200)

    expect(getTransactionsResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New Transaction',
        amount: 5000,
      })
     )
  })

  it('should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Credit Transaction',
        amount: 5000,
        type: 'credit',
      })
    
    const cookies = createTransactionResponse.get('set-cookie');

    if (!cookies) throw new Error ('error!!')
    await request(app.server)
    .post('/transactions')
    .set('Cookie', cookies)
    .send({
      title: 'Debit Transaction',
      amount: 2000,
      type: 'debit',
    })

    if (!cookies) throw new Error ('error!!')
    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
      amount: 3000,
    })
  })
})

