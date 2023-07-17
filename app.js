const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const { body, validationResult, check } = require('express-validator');
const methodOverride = require('method-override');

require('./utils/db');
const Contact = require('./model/contact');

const app = express();
const port = 3000;

// setup method overrides
app.use(methodOverride('_method'))

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// flash configuration
app.use(cookieParser('secret'))
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
)
app.use(flash())

app.get('/', (req, res) => {
    // res.sendFile('./index.html', {root: __dirname})
    const mahasiswa = [
      {
        nama: 'Sendy Adriansyah',
        email: 'sendy.adriansyah17@gekkou.ac.jp'
      },
      {
        nama: 'Makoto Yuki',
        email: 'makoto.y@gekkou.ac.jp'
      },
      {
        nama: 'Yukari Takeba',
        email: 'yukari.t@gekkou.ac.jp'
      }
    ];
    res.render('index', {
      nama: 'Sendy',
      title: 'Home Page',
      mahasiswa,
      layout: 'layout/main-layout'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
      layout: 'layout/main-layout',
      title: 'About Page'
    })
})

app.get('/contact', async(req, res) => {
    const contacts = await Contact.find();
  
    res.render('contact', {
      layout: 'layout/main-layout',
      title: 'Contact Page',
      contacts,
      msg: req.flash('msg'),
    })
})

app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
      title: 'Add Contact Form',
      layout: 'layout/main-layout',
    })
})  

app.post('/contact', [
    body('name').custom(async (value) => {
      const duplicate = await Contact.findOne({ name: value })
      if(duplicate){
        throw new Error('Contact name already exists')
      }
      return true
    }),
    check('email', 'Invalid email address').isEmail(),
    check('nohp', 'Invalid Phone Number').isMobilePhone('id-ID')
  ], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      res.render('add-contact', {
        title: 'Add contact form',
        layout: 'layout/main-layout',
        errors: errors.array(),
      })
    } else {
        Contact.insertMany(req.body, (error, result) => {
            req.flash('msg', 'Contact added successfully')
            res.redirect('/contact')
        })
    }
})

app.delete('/contact', (req, res) => {
    Contact.deleteOne({ name: req.body.name }).then((result) => {
        req.flash('msg', 'Contact deleted successfully')
        res.redirect('/contact')
    })
})

app.get('/contact/edit/:name', async(req, res) => {
    const contact = await Contact.findOne({ name: req.params.name })
  
    res.render('edit-contact', {
      title: 'Edit contact form',
      layout: 'layout/main-layout',
      contact
    })
})

app.put('/contact', [
    body('name').custom(async (value, { req }) => {
      const duplicate = await Contact.findOne({ name: value })
      if(value !== req.body.oldName && duplicate){
        throw new Error('Contact name already exists')
      }
      return true
    }),
    check('email', 'Invalid email address').isEmail(),
    check('nohp', 'Invalid Phone Number').isMobilePhone('id-ID')
  ], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      res.render('edit-contact', {
        title: 'Edit contact form',
        layout: 'layout/main-layout',
        errors: errors.array(),
        contact: req.body
      })
    } else {
        Contact.updateOne(
            { _id: req.body._id }, 
            {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    nphp: req.body.nohp,
                },
            }
        ).then((result) => {
            req.flash('msg', 'Contact edited successfully')
            res.redirect('/contact')
        })
    }
})

app.get('/contact/:name', async(req, res) => {
    const contact = await Contact.findOne({ name: req.params.name })
  
    res.render('detail', {
      layout: 'layout/main-layout',
      title: 'Detail Page',
      contact
    })
})

app.listen(port, () => {
    console.log(`Mongo Contact App | Listening at http://localhost:${port}`);
});