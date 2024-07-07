const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: {
      url: String,
      filename: String,
    },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true },
    reviews : [
      {
        type : Schema.Types.ObjectId,
        ref : "Review"
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref : "User"
    }
  });

// when listing is delete at a time also delete reviews of particular listing
listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await Review.deleteMany({ _id : {$in : listing.reviews}})
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;