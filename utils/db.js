const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/wpu', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
});


// Add one data
// const contact1 = new Contact({
//     name: 'Makoto Yuki',
//     nohp: '081812345678',
//     email: 'makoto.y@gmail.com',
// })

// Save to collection
// contact1.save().then((contact) => console.log(contact))