var express = require('express');
var router = express.Router();

const SUPER_SECRET_TOKEN = 'some-super-secret-token-you-must-keep'

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'bob' && password === 'topsecret') {
    console.log('Bob authenticated!')

    res.cookie('auth-token', SUPER_SECRET_TOKEN, {
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      // secure: true, (Disabled because, yeah)
      httpOnly: true,
      // Let's just say we forgot to set 'SameSite'.
    })

    res.json({
      result: 'Authentication successful.'
    })
  } else {
    res.json({
      result: 'Incorrect username or password.'
    })
  }
})

router.get('/transfer', (req, res) => {
  if (req.cookies['auth-token'] === SUPER_SECRET_TOKEN) {
    res.render('transfer')
  } else {
    res.redirect('/login')
  }
})

router.post('/transfer', (req, res) => {
  const { recipient, amount } = req.body

  if (req.cookies['auth-token'] === SUPER_SECRET_TOKEN) {
    console.log(`Bob transferred ${amount} to ${recipient}.`)
    
    res.json({
      result: 'Transfer successful.'
    })
  } else {
    console.log(`Transfer of ${amount} to ${recipient} failed.`)

    res.json({
      result: 'No.'
    })
  }
})

module.exports = router;
