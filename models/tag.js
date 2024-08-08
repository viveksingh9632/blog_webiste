const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,        // नाम का प्रकार स्ट्रिंग होगा
    required: true       // यह आवश्यक है, यानी इसका होना अनिवार्य है
},


  slug: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now 
  }
});

module.exports = mongoose.model('Tag', tagSchema);
