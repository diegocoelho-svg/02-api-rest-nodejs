import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {

  app.get('/', async () => {
    const transactions = await knex('transactions').select()

    return { transactions }
  })

  // http://localhost:3333/transactions/UUID
  app.get('/:id', async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(), // request.params //parametros nomeados na URL
    })
    
    const { id } = getTransactionParamsSchema.parse(request.params)

    const transaction = await knex('transactions').where('id', id).first()

    return transaction
  })

  app.get('/summary', async () => {
    const summary = await knex('transactions').sum('amount', { as: 'amount' }).first()
    
    return { summary }
  })

  app.post('/', async (request, reply) => {
  //title, amount, type: credit or debit
    const createTransactionBodySchema = z.object({
    title: z.string(),
    amount: z.number(),
    type: z.enum(['credit', 'debit']),
    })

    let sessionId = request.cookies.sessionId // procurando dentro dos cookies, se já existe uma session id (dentro do POST)

    if (!sessionId) {
      sessionId = randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/', //qualquer rota pode acessar
        maxAge: 60 * 60 * 24 * 7 // 7 days CLEAN CODE
      })
    }

    const { title, amount, type } = createTransactionBodySchema.parse(request.body) //validando os dados para ver se bate com o schema

     await knex ('transactions')
    .insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })
 
    return reply.status(201).send()
  })
}

