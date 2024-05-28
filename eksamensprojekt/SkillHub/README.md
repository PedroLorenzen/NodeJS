<img src="./README-header-image.png" alt="" />
<p align="center">
<img src="https://badgen.net/badge/license/MIT/blue" />
</p>

# svelte SKILLHUB

> This is my examnproject for the Svelte course in my fourth semester of Computer Science at KEA.

> SKILLHUB is an easy-to-use job portal where you can post job opportunities or seek assistance with tasks. 

## Installation

1. CD into client and install the packages:

```
npm install
```
2. start the client:

```
npm run dev
```
3. follow the link assigned in the console ( propably: "http://localhost:5173/")

4. CD into server and install the packages aswell.

5. Create a .env file (you can copy the .env.example file) and fill out the necessary values.
```
cp .env.example .env
```
6. Make sure to have mongoDB installed.
7. run this script to create the local mongoDB database

```
npm run database-create
```
8. start the server:
```
node app.js
```
