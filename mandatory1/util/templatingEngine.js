import fs from 'fs'

export function readPage (path) {
  return fs.readFileSync(path).toString()
}

export function renderPage (page, config = {}) {
  // Hvis config er undefined er det bare et tomt objekt.
  const header = fs.readFileSync('./public/components/header/header.html').toString()
  const footer = fs.readFileSync('./public/components/footer/footer.html').toString()
  const menu = fs.readFileSync('./public/components/menu/menu.html').toString()
  return header + page + menu + footer
}
