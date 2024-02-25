module.exports = async (interaction, message) => {
	const reply = { content: `Err! \`${message}.\``, ephemeral: true };

	if (!interaction.replied) return await interaction.reply(reply);
	await interaction.followUp(reply);
};
