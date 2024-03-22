import 'reflect-metadata'
import { fixModuleAlias } from './helper/fix-module-alias'

fixModuleAlias(__dirname)

// !IMPORTANT: Do not remove above line, it should be the first line of the file

import 'dotenv/config'

import express from 'express'
import { signIn, signUp } from './services/cognito'
import configureExpressApp from './config/server'

const app = express()

configureExpressApp(app)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/signup', async (req, res) => {
  const input = req.body

  const response = await signUp(input)

  res.json(response)
})

app.post('/signin', async (req, res) => {
  const input = req.body

  const response = await signIn(input)

  res.json(response)
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
