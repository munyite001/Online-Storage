const express = require('express')
const router = express.Router()

//// Load Controllers
const { registerNewUser, loginUser,getUser } = require('../controllers/user.controller')



//// GENERAL ROUTES
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' })
})

//// AUTH ROUTES
router.post('/register', registerNewUser)

router.post('/login', loginUser)

router.get('/user/:userId', getUser)

router.post("/logout")

module.exports = router;