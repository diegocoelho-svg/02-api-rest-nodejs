import { expect, test, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../src/app' //vai tentar subir um servidor na porta 3333

beforeAll(async () => {
  await app.ready()
}) //executa antes de todos os testes -> Each

afterAll(async () => {
  await app.close()
})

test('User can create a new transaction', async () => {
  // fazer a chamada http p/ criar uma nova transação
  const response = await request(app.server)
    .post('/transactions')
    .send({
      title: 'New Transaction',
      amount: 5000,
      type: 'credit',
    })

  expect(201) // -> valida se o retorno foi um status 201
})