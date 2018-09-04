var express = require('express');
var app = express();
var cors = require('cors')

app.use(cors())

const oauth2 = require('simple-oauth2').create({
  client: {
    id: '169a193bbe75c0e129d0',
    secret: '5d983e55b626b3de2c4de5f34189390134a1d957'
  },
  auth: {
    tokenHost: 'https://github.com',
    tokenPath: '/login/oauth/access_token',
    authorizePath: '/login/oauth/authorize',
  },
})

const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: 'http://localhost:3000/callback',
  scope: 'notifications, gist',
  state: '3(#0/!~',
})


app.get('/', (req, res) => {
  res.send('<a href="/auth">Log in with Github</a>')
})

app.get('/some', (req, res) => {
  res.send('{ "some": "tolo" }')
})

app.get('/auth', (req, res) => {
  console.log(authorizationUri);
  res.redirect(authorizationUri);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  const options = {
    code,
  };

  try {
    const result = await oauth2.authorizationCode.getToken(options);

    console.log('The resulting token: ', result);

    const token = oauth2.accessToken.create(result);

    return res.status(200).json(token)
  } catch(error) {
    console.error('Access Token Error', error.message);
    return res.status(500).json('Authentication failed');
  }
});

app.listen(3000, () => {
  console.log('listening on port http://localhost:3000')
})