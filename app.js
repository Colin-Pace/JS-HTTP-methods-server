const express = require('express')

const cors = require('cors')

const knex = require('knex')

const app = express()

const router = express.Router()

const port = 8000

const knexInstance = knex({

  client: 'pg',

  connection: 'postgresql://colinpace@localhost/knex-practice'

})

app.use( cors() )

app.use( express.json() )

app.use( router )



router

  .route('/')

    .post((req, res) => {

      const item = req.body;

      const name = item['item'];

      knexInstance('name')

        .insert( { user_name: name } )

        .then( result => {

          if (result['rowCount'] === 1) {

            res.sendStatus(200);

          } else {

            res.sendStatus(500);

          }
        })
    })


    .get((req, res) => {

      knexInstance('name')

        .select( '*' )

        .then( result => {

          let data = [];

          for (let i = 0; i < result.length; i++) {

            data.push( result[i]['user_name'] );

          }

          res.send(data);

          res.sendStatus(200);

        })
    })


router

  .route('/del')

    .all((req, res) => {

      knexInstance('name')

        .select('*')

        .then( result => {

          let userNames = result.map(row => row['user_name']);

          knexInstance('name')

            .whereIn('user_name', userNames)

            .del()

            .then( result => {

              if (result === 1) {

                res.sendStatus(200);

              } else {

                res.sendStatus(500);

              }
            })
        })
    })


app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
