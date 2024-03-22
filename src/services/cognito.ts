import {
  SignUpCommand,
  InitiateAuthCommand,
  CognitoIdentityProviderClient,
  AuthFlowType
} from '@aws-sdk/client-cognito-identity-provider'
import z from 'zod'
import crypto from 'crypto'

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

const signUpSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string(),
  given_name: z.string(),
  family_name: z.string()
})

type SignUpInput = z.infer<typeof signUpSchema>

const signUp = async ({ username, password, email, family_name, given_name }: SignUpInput) => {
  const secretHash = calculateSecretHash({
    username
  })

  const command = new SignUpCommand({
    ClientId: process.env.COGNITO_CLIENT_ID,
    SecretHash: secretHash,
    Username: username,
    Password: password,
    UserAttributes: [
      { Name: 'email', Value: email },
      { Name: 'family_name', Value: family_name },
      { Name: 'given_name', Value: given_name }
    ]
  })

  return await client.send(command)
}

interface ICalculateSecretHash {
  username: string
}

function calculateSecretHash({ username }: ICalculateSecretHash) {
  const message = username + process.env.COGNITO_CLIENT_ID
  return crypto.createHmac('SHA256', process.env.COGNITO_CLIENT_SECRET).update(message).digest('base64')
}

const signInSchema = z.object({
  username: z.string(),
  password: z.string()
})

type SignInInput = z.infer<typeof signInSchema>

const signIn = async ({ username, password }: SignInInput) => {
  const command = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: process.env.COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
      SECRET_HASH: calculateSecretHash({
        username
      })
    }
  })

  return await client.send(command)
}

export { signUp, signIn }
