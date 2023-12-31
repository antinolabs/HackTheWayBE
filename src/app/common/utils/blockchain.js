const crypto = require("crypto");
const moment = require("moment");
const { Response } = require("../helpers/serviceResponse.Handler");

class Block {
	constructor(index, previousHash, data, timestamp = moment().format("DD/MM/YYYY-HH:mm:ss")) {
		this.index = index;
		this.previousHash = previousHash?.toString();
		this.timestamp = timestamp;
		this.data = data;
		this.hash = this.calculateHash();
	}

	calculateHash() {
		return crypto
			.createHash("sha256")
			.update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data))
			.digest("hex");
	}
}

class Blockchain {
	constructor(data) {
		this.chain = [this.createGenesisBlock(data)];
	}

	createGenesisBlock(data) {
		return new Block(0, "0", data, moment().format("DD/MM/YYYY-HH:mm:ss"));
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	getGenesisBlock() {
		return this.chain[0];
	}

	addBlock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.index = this.getLatestBlock().index + 1;
		newBlock.hash = newBlock.calculateHash();
		this.chain.push(newBlock);
	}

	isChainValid() {
		for (let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];

			if (currentBlock.hash !== currentBlock.calculateHash()) {
				return false;
			}

			if (currentBlock.previousHash !== previousBlock.hash) {
				return false;
			}
		}
		return true;
	}

	getTheHighestBidder() {
		let user = this.getGenesisBlock().data.auctioneer;
		let bidAmount = Number(this.getGenesisBlock().data.initialPrice);

		if (!this.isChainValid()) return Response(false, "There is an issue with chain validity");

		this.chain.map((elem) => {
			if (elem.data?.amount) {
				const bid = Number(elem.data.amount);

				if (bidAmount < bid) {
					bidAmount = bid;
					user = elem.data.userId;
				}
			}
		});

		return Response(true, "Success", { user, bidAmount });
	}

	getChain() {
		return this.chain;
	}
}

module.exports = { Blockchain, Block };
