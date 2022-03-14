const mongoose = require("mongoose");
const { compare, hash } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const Schema = mongoose.Schema;

const SeriesSchema = new Schema(
  {
    userId: { type: String, trim: true },
    seriesId: { type: String, trim: true },
    totalChapterUnlocked: { type: Number, trim: true, default: 4 },
    title: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

var Content = mongoose.model("contentPass", SeriesSchema);

module.exports = Content;
