const mongoose = require("mongoose");
const moment = require("moment");

const auctionSchema = new mongoose.Schema(
	{
		auctioneer: {
			type: mongoose.Types.ObjectId,
			ref: "user",
		},
		bidder: {
			type: [
				{
					type: mongoose.Types.ObjectId,
					ref: "user",
				},
			],
			select: false,
		},
		endTime: String,
		itemDescription: {
			type: {
				itemName: String,
				initialPrice: String,
				itemInfo: String,
			},
		},
		chain: {
			type: Array,
			select: false,
		},
		status: String,
		winningBid: {
			type: {
				user: {
					type: mongoose.Types.ObjectId,
					ref: "user",
				},
				amount: Number,
			},
		},
	},
	{ timestamps: true }
);

module.exports = auction = mongoose.model("auction", auctionSchema);
