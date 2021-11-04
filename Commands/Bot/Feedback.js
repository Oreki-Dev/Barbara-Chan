const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "feedback",
  description: "Give Feedback Related To Bot To The Owner",
  options: [
    {
      type: "STRING",
      name: "feedback",
      description: "The Feedback",
      required: true,
    },
  ],
  run: async (client, interaction) => {
    let feedback = interaction.options.getString("feedback");

    let embed = new MessageEmbed()
      .setTitle(`New Feedback | ${interaction.user.tag}`)
      .setDescription(`${feedback}`)
      .setColor(client.color())
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    client.channels.cache
      .get(client.config.feedbackChannel)
      .send({ embeds: [embed] });

    return interaction.followUp({
      content: `Feedback Sent, Thank You`,
      ephemeral: true,
    });
  },
};
