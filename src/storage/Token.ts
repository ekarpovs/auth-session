import { Schema, Types, model } from "mongoose";

export interface TokenInterface {
  user: Types.ObjectId;
  token: string;
  craetedAt: Date;
  expiresSec: number, // this is the expiry time in seconds
};

const TokenSchema = new Schema<TokenInterface>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  craetedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  expiresSec: {
    type: Number,
    required: true,
    default: 900,
  }
});

export const Token = model<TokenInterface>("Token", TokenSchema);


