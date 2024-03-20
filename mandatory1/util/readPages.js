import { readPage, renderPage } from './templatingEngine.js'

const about = readPage('./public/pages/about.html')
export const aboutPage = renderPage(about)

const cleancode = readPage('./public/pages/cleancode.html')
export const cleancodePage = renderPage(cleancode)

const contact = readPage('./public/pages/contact.html')
export const contactPage = renderPage(contact)

const home = readPage('./public/pages/home.html')
export const homePage = renderPage(home)

const node = readPage('./public/pages/node.html')
export const nodePage = renderPage(node)

const rendering = readPage('./public/pages/rendering.html')
export const renderingPage = renderPage(rendering)

const vercel = readPage('./public/pages/vercel.html')
export const vercelPage = renderPage(vercel)
