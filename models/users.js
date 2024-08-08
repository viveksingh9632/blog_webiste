const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name:  
  { type: String,
    required: true
  },
 

  email: 
  { type: String,
    required: true,
    unique: true 
  },


  tag_id: {
    type: mongoose.Schema.Types.ObjectId, // यह एक ObjectId प्रकार का है
    ref: "Tag", // यह "Tag" मॉडल का संदर्भ है
    required: true, // यह फ़ील्ड आवश्यक है
  },

  
  password: 
  { type: String,
    required: true
  },

  createdAt: 
  { type: Date,
    default: Date.now 
  }
});



userSchema.pre('save', async function(next) {
  const user = this; // वर्तमान उपयोगकर्ता दस्तावेज़ को 'user' में स्टोर करें
  if (!user.isModified('password')) return next(); // यदि पासवर्ड संशोधित नहीं हुआ है, तो अगला मिडलवेयर कॉल करें
  const salt = await bcrypt.genSalt(10); // पासवर्ड हैशिंग के लिए एक नमक (salt) उत्पन्न करें
  const hash = await bcrypt.hash(user.password, salt); // पासवर्ड को हैश करें
  user.password = hash; // हैश किया हुआ पासवर्ड उपयोगकर्ता के पासवर्ड फील्ड में सहेजें
  next(); // अगला मिडलवेयर या सेवर को कॉल करें
});


module.exports = mongoose.model('User', userSchema);

