import fastify from 'fastify'
import { knex } from './database'
import crypto from 'node:crypto'

const app = fastify()

app.get('/hello', async () => {
  const transaction = await knex('transactions').insert({
    id: crypto.randomUUID(),
    title: 'Transação de teste',
    amount: 1000,
  }).returning('*') //todas as informações inseridas

  return transaction
})

app.listen({
  port: 3333,
}).then(() => {
  console.log('HTTP Server Running!')
})