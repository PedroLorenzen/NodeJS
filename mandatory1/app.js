import express from 'express'

import pagesRouter from './routers/pagesRouter.js'
const app = express()
app.use(express.static('public'))

app.use(pagesRouter)

const PORT = 3000
app.listen(PORT, () => console.log('Server is running on port:', PORT))
