import fastify from 'fastify'
import { knex } from './database'
import crypto from 'node:crypto'
import { env } from './env'

const app = fastify()

app.get('/hello', async () => {
  const transactions = await knex('transactions')
    .where('Amount', 500)
    .select('*') //selecionar todas as transações criadas

  return transactions
})

app.listen({
  port: env.PORT,
}).then(() => {
  console.log('HTTP Server Running!')
})