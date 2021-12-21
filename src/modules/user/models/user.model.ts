import  {Document,Schema} from 'mongoose'

export type IUser ={
    username:string,
    email:string,
    password:string,
} & Document

const requiredString = {
    type: String,
    required: true,
};
  
const userSchema = new Schema({
    username: {
      ...requiredString,
      required: true,
      lowercase: true,
       unique: true,
    },
    email: {
      ...requiredString,
      unique: true,
    },
    password: {
      ...requiredString,
    },
    role:{
      type:String,
      required:true,
    }
  },
  { timestamps: true }
);
// userSchema.pre('save', async function () {
//   const user = this;
//   if (!user.isModified) return next();
//   const salt = await bcrypt.genSalt(12);
//   await bcrypt.hash(user.password, salt);
//   next();
// });

// userSchema.comparePassword = async function (password) {
//   bcrypt.compare(password, this.password);
    // };

export default  userSchema;