import express from 'express'
import User from './models/User.js';
import path from 'path'
import basicAuth from 'express-basic-auth'
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url'
import session from 'express-session'
import 'dotenv/config';
const app = express()

import mongoose from 'mongoose';
import weatherRouter from './router/weatherrouter.js'
import cageRouter from './router/openCageRouter.js'
import bookRouter from './router/bookrouter.js'
import historyRouter from './router/historyRouter.js'
import router from './router/user-router.js'
import { render } from 'ejs';
app.set("view engine", "ejs");

app.use(bodyParser.json())

const users = {
  'yerlan': 'lolol1',
}

app.use(basicAuth({
  users,
  challenge: true,
}))

app.use(
  session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: true,
  })
)

app.use("/api/user", router)
app.use("/book", bookRouter)
app.use("/history", historyRouter)

app.get("/", (req, res) => {
    res.render("index", { latestWeatherData: null, flagsImageUrl: null, latestOpenCageData: null,  error: null});
})


app.get("/history", (req, res) => {
  res.render("histories", { apiCall: null,  error: null});
})





const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/css', express.static(path.join(__dirname, '..','frontend', 'css')));
app.set('views', path.join(__dirname, 'views'))

app.get('/profile', (req, res) => {
  const one_user = req.session.user 
  if (one_user) {
      res.render('profile', { user: one_user })
  } else {
      res.status(401).json({ message: 'User not authenticated' })
  } 
})

app.get('/admin', async (req, res) => {
  const currentUser = req.session.user;

  if (currentUser && currentUser.isAdmin) {
    const users = await User.find();
    if (users) {
      res.render('admin', { users });
    } else {
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.get('/login', (req, res) => {
  res.render('signin',{ user: req.session.user});
})

app.get('/register', (req, res) => {
  res.render('signup', {user: req.session.user});
})

app.use('/cage', cageRouter);
app.use('/weather', weatherRouter);

mongoose.connect(process.env.MONGO_URI).then(async () => {
  app.listen(5010, () => {
    console.log("Connected to database and listening on port 5010");
  });
}).catch((err) => console.error('Error connecting to database:', err));
