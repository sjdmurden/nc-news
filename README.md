# Northcoders News API
---
## Hosted Project [here](https://nc-news-7ps8.onrender.com)

This is an API built for the purpose of accessing application data programmatically. It allows users to view articles, comments, and topics, as well as interact with them by posting comments, voting on articles, and more. The API is built using Node.js and Express, with a PostgreSQL database to store data.The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture. \
\
The accessible data includes:
- Users
- Articles
- Topics
- Comments

An example endpoint to the api would be POST/api/article/:article_id/comments which adds a comment to the specific article by its article_id.

# Setup Instructions
## Clone repo
To clone this repo, click the green `Code` button and copy the HTTPS link.\
Within your command line, navigate to the folder you want to store the repo contents and type `git clone <link>`

## Installing the dependencies
Navigate to repo directory\
`cd <project>`\
Run the following command to install necessary packages\
`npm install`

## Seed database

Install PostgrSQL [here](https://www.postgresql.org/download/)\
Run the following command to seed the database\
`npm run seed`

## Run tests

Install jest by running the following command\
`npm install --save-dev jest`\
Run the following command to run the test scripts\
`npm test`

## Creating .env files

To connect to the two databses locally you need to add your own '.env.test' and '.env.development' files at the top level of the folder.\
Into each, add `PGDATABASE = `, with the correct database name for that environment 

---

Necessary versions to run the project:\
Node.js version 14 or later
PostgreSQL database version 14 or later
