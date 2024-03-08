import { readPage, renderPage } from "./templatingEngine.js"

const homepage = readPage("./public/pages/homepage/homepage.html");
export const homepagePage = renderPage(homepage, {
    tabTitle: "DogInder Homepage",
    CSSLinks: '<link rel="stylesheet" href="/pages/homepage/homepage.css"'
});

const contact = readPage("./public/pages/contact/contact.html");
export const contactPage = renderPage(contact, {
    tabTitle: "DogInder Contact",
    CSSLinks: '<link rel="stylesheet" href="/pages/contact/contact.css"'
});

const matches = readPage("./public/pages/matches/matches.html");
export const matchesPage = renderPage(matches, {
    tabTitle: "DogInder Matches",
    CSSLinks: '<link rel="stylesheet" href="/pages/matches/matches.css"'
});