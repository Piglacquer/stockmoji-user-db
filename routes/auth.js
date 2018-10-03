const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const db = require('../database-connection')

router.get('/', (req, res, next) => {
    if (req.session.userId){
        return res.json({"loggedIn": true})
    }
    return res.json({"loggedIn": false}) 
})

router.post('/login', (req, res, next) => {
    return db('stockmoji_users').where({username: req.body.username})
        .then(([user]) => {
            if(!user){
                return res.json({"msg": "no user found, bitch"}).sendStatus(404)
            }
            if(bcrypt.compareSync(req.body.password, user.password)){
                req.session.userId = user.id
                console.log(req.session)
                res.json(req.session)
            } else {
                res.send('could not authenticate, bitch')
            }
        })
        .catch(next)
})

router.post('/signup', (req, res, next) => {
    var hash = bcrypt.hashSync(req.body.password, 12); 
    const user = {
        username: req.body.username,
        password: hash
    }
    return db('stockmoji_users').insert(user).returning('*')
        .then((response) => res.json(response))
})

router.get('/logout', (req, res, next) => {
    console.log('logout', req.session)
    if (req.session.userId){
        return store.destroy(req.sessionID, () => {
            console.log('hi')
        })
         
    }
    return res.json({"status": "not logged in"})
})

module.exports = router