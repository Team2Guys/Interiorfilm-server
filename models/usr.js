const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const schema   = mongoose.Schema
const usersSchema = new schema ({
  fullName:{
    type: String,
    require: true
},
email:{
    type: String,
    require: true
},
password:{
    type: String,
    require: true
},
ProfilePhoto: [{
  public_id: {
    type: String,
  },
  imageUrl: {
    type: String,
  }
}],

})


usersSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) {
      return next();
    }
    try {
        const saltRounds = 10;

      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      user.password = hashedPassword;
      next();
    } catch (error) {
      next(error);
    }
  });


const users = mongoose.model("users",usersSchema)


module.exports = {users}