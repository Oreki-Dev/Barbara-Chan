module.exports = {
  name: "interactionCreate",
  run: async (client, interaction) => {
    if (interaction.isCommand()) {
      await interaction.deferReply();

      const command = client.commands.get(interaction.commandName);
      if (!command)
        return interaction.followUp({
          content: "That Command Does Not Exist",
          ephemeral: true,
        });

      if (command.botPermission) {
        let neededPerms = [];
        command.botPermission.forEach((p) => {
          if (!interaction.guild.me.permissions.has(p)) neededPerms.push(p);
        });

        if (neededPerms.length)
          return interaction.followUp({
            content: `I Need ${neededPerms} To Be Able To Use This Command Without Any Errors`,
            ephemeral: true,
          });
      }

      if (command.authorPermission) {
        let neededPerms = [];
        command.authorPermission.forEach((p) => {
          if (!interaction.member.permissions.has(p)) neededPerms.push(p);
        });

        if (neededPerms.length)
          return interaction.followUp({
            content: `You Need ${neededPerms} To Be Able To Use This Command Without Any Errors`,
            ephemeral: true,
          });
      }

      if (
        command.ownerOnly &&
        !client.config.owners.includes(interaction.user.id)
      )
        return interaction.followUp({
          content: `Owner Only Command`,
          ephemeral: true,
        });

      if (command) {
        command.run(client, interaction);
      }
    }
  },
};
