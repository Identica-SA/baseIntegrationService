const mongoose = require('mongoose')
const Base = require('../models/Base')
//const Base2 = require('../models/Base2'); //LINK TO ANOTHER COLLECTION

async function getAllBase() {
  try {
    return await Client.find({}).lean() //The lean option tells Mongoose to skip hydrating the result documents. This makes queries faster and less memory intensive
  } catch (error) {
    //logger.err(error)
    return error
  }
}

async function getBase(search) {
  try {
    return await Base.find(search).lean() //The lean option tells Mongoose to skip hydrating the result documents. This makes queries faster and less memory intensive
  } catch (error) {
    //logger.err(error)
    return error
  }
}

async function createBase(data) {
  try {
    //form1
    let newBase = new Base({
      example1: data.example1,
      example2: data.example2,
      example3: data.example3,
      example4: data.example4
    })
    //form2
    //let newBase = new Base({...data});
    await newBusiness.save()
    return newBase.toObject() //toObject Returns a native js Array of plain js objects
  } catch (error) {
    return error
  }
}

async function updateBase(search, data) {
  try {
    let base = await Base.findOneAndUpdate(
      search,
      data,
      { new: true } // true: return updated object
    )
    return base.toObject() //toObject Returns a native js Array of plain js objects
  } catch (error) {
    return error
  }
}

async function deleteBase(search) {
  try {
    let base = await Base.findOneAndDelete(search)
    return base.toObject() //The lean option tells Mongoose to skip hydrating the result documents. This makes queries faster and less memory intensive
  } catch (error) {
    //logger.err(error)
    return error
  }
}

module.exports = {
  getAllBase,
  getBase,
  createBase,
  updateBase,
  deleteBase
}
