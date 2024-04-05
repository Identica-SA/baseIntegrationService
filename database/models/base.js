const mongoose = require('mongoose')

const baseSchema = new mongoose.Schema({
    // _id: String, //ONLY IF NEEDED
    example1: { type: String, required: true },
    example2: { type: String },
    example3: {
      finger1: {
        numFinger: { type: String },
        result: { type: String },
        score: { type: Number }
      },
      finger2: {
        numFinger: { type: String },
        result: { type: String },
        score: { type: Number }
      }
    },
    example4: { type: Boolean, required: true, default: true },
    // example5: [{ type: mongoose.Schema.Types.String, ref: 'base2', default: undefined }], //LINK TO ANOTHER COLLECTION 
    // expirationDate: { type: Date, required: true, expires: 0 } //ONLY IF NEED TO EXPIRE A DOCUMENT 
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt', default: Date.now } }
)

module.exports = mongoose.model('base', baseSchema, 'base')