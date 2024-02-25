const { Schema, model } = require("mongoose");

const reqString = {
	type: String,
	required: true,
	unique: [true, "ID must be unique"],
};

const userSchema = new Schema({
	userId: reqString,
	channelId: reqString,
});

module.exports = model("UserData", userSchema);
