import cors, { CorsOptions } from 'cors'
import { Express, urlencoded, json } from 'express'
import morgan from 'morgan'
import fileUpload, { Options } from 'express-fileupload'
import bodyParser from 'body-parser'

// const whitelistCorsOrigins = ENVIRONMENT.CORS_WHITELIST

// const corsOptions = {
//   origin: whitelistCorsOrigins,
//   credentials: true,
//   optionsSuccessStatus: 204
// } satisfies CorsOptions

const fileUploadOptions = {
  limits: { fileSize: 8 * 1024 * 1024 },
  useTempFiles: true,
  tempFileDir: '/tmp/'
} satisfies Options

const urlencodedOptions = {
  extended: true,
  limit: '2mb'
} satisfies bodyParser.OptionsUrlencoded

const bodyParserOptions = {
  limit: '2mb'
} satisfies bodyParser.OptionsJson

/**
 * Configure all express app settings
 * @param app Express app
 */
const configureExpressApp = (app: Express) => {
  // Enable HTTP request logger in development mode
 app.use(morgan('common'))

  // Enable CORS
//   app.use(cors(corsOptions))

  // Add body parser, reading data from body into req.body
  app.use(json(bodyParserOptions))

  // Add file upload middleware
  app.use(fileUpload(fileUploadOptions))

  // Add urlencoded parser
  app.use(urlencoded(urlencodedOptions))

  // Remove powered by express header
  app.disable('x-powered-by')

  // Add all routes
//   app.use(router)
}

export default configureExpressApp
