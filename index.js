const path = require("path");

const {
	Client,
	IntentsBitField,
	Partials,
	ActivityType,
} = require("discord.js");
const WOK = require("wokcommands");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
	path: "./.env",
});

const { DefaultCommands } = WOK;
const { TOKEN, MONGO_URI } = process.env;

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.DirectMessages,
		IntentsBitField.Flags.MessageContent,
	],
	partials: [Partials.Channel],
});

client.on("ready", async () => {
	console.log(`${client.user.username} is running 🤖`);

	
	client.user.setPresence({
		activities: [{ type: ActivityType.Listening, name: "NB Warnings" }],
		status: "dnd",
	});

	mongoose.set("strictQuery", true);

	mongoose
		.connect(MONGO_URI, () => {
			console.log("Successfully connected to database 🧶");
		})
		.catch((e) => console.log("Something went wrong with the database...", e));

	new WOK({
		client,
		commandsDir: path.join(__dirname, "./commands"),

		events: {
			dir: path.join(__dirname, "events"),
		},

		disabledDefaultCommands: [
			DefaultCommands.ChannelCommand,
			DefaultCommands.CustomCommand,
			DefaultCommands.Prefix,
			DefaultCommands.RequiredPermissions,
			DefaultCommands.RequiredRoles,
			DefaultCommands.ToggleCommand,
		],
		cooldownConfig: {
			errorMessage: "Please wait {TIME} before doing that again.",
			botOwnersBypass: false,

			dbRequired: 300,
		},
	});
});

client.login(TOKEN);
