const mongoose = require('mongoose');

// Make a schema object
const Contact = mongoose.model('Contact', {
    name: {
        type: String,
        required: true,
    },
    nohp: {
        type: String,
        required: true,
    },
    email: {
        type: String
    }
})

module.exports = Contact;