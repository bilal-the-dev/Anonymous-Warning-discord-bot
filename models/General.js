const { Schema, model } = require("mongoose");

const generalSchema = new Schema({
	guildId: { type: String, required: true, unique: true },
	ticketNo: { type: Number, default: 0 },
});

module.exports = model("General", generalSchema);
