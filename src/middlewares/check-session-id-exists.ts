import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkSessionIdExists(request: FastifyRequest, reply: FastifyReply) {
  const sessionId = request.cookies.sessionId

  if(!sessionId) {
    return reply.status(401).send ({
      error: 'Unauthorized.' ,
    })
  }
} //se realmente não existir da um erro. Caso exista, segue o fluxo normalmentee