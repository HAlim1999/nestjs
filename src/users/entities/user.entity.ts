import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({timestamps: true})
export class User extends Document {
    @Prop({ unique: true, index: true, trim: true })
    email: string;
  
    @Prop({ trim: true })
    password: string;
  
    @Prop({ trim: true })
    firstName: string;
  
    @Prop({ trim: true })
    lastName: string;
  
    @Prop({ default: false })
    isTfaEnabled: boolean;
  
    @Prop({ trim: true })
    tfaSecret: string;
  
    @Prop({ default: "user", trim: true })
    role: string;
  
    @Prop({ default: false })
    isDeleted: boolean;

}


export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.toJSON = function(){
    const { __v, password, isTfaEnabled, tfaSecret, ...record } = this.toObject();
    return record;
}




