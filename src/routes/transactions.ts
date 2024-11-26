import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
    const transactions = await knex('transactions')
      .where('Amount', 1000)
      .select('*') //selecionar todas as transações criadas
  
    return transactions
  })
}

