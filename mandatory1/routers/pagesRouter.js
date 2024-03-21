import { aboutPage, cleancodePage, contactPage, homePage, nodePage, renderingPage, vercelPage, stylingPage } from '../util/readPages.js'
import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.send(homePage)
})

router.get('/about', (req, res) => {
  res.send(aboutPage)
})

router.get('/contact', (req, res) => {
  res.send(contactPage)
})

router.get('/cleancode', (req, res) => {
  res.send(cleancodePage)
})

router.get('/node', (req, res) => {
  res.send(nodePage)
})

router.get('/rendering', (req, res) => {
  res.send(renderingPage)
})

router.get('/vercel', (req, res) => {
  res.send(vercelPage)
})

router.get('/styling', (req, res) => {
  res.send(stylingPage)
})

export default router
