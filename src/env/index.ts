import { config } from 'dotenv' //ler o arquivo env, expondo as variaveis ambiente dentro de process.env
import { z } from 'zod'

if(process.env.NODE_ENV === 'test') {
  config({path: '.env.test'})
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'), //enum deve ser: development OU test OU production
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
})  //formato de dados que receberá da variavel ambiente

const _env = envSchema.safeParse(process.env) //valida porém não dispara um erro quando a validação falhe

if (_env.success === false) {
  console.error('⚠ Invalid environment variables!', _env.error.format())
  
  throw new Error('⚠ Invalid environment variables.')
}

export const env = _env.data
