const mongoose = require("mongoose");
const { campgroundSchema } = require("../schemas");
const Schema = mongoose.Schema;
const Review = require("./review");
const User = require("./user");

const ImageSchema = new Schema ({
  url: String,
  filename: String
})
ImageSchema.virtual('thumbnail').get(function(){
return this.url.replace('/upload','/upload/w_200')
})
const opts = {toJSON: {virtuals : true}};

const campGroundSchema = new Schema({
  title: String,
  // image:String,
  images: [ImageSchema],
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  // properties:{
  //   popUpMarkup:
  // }
},opts);

campGroundSchema.virtual('properties.popUpMarkup').get(function(){
  return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>`
  })

campGroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
  // console.log("Deleted");
});
module.exports = mongoose.model("Campground", campGroundSchema);
