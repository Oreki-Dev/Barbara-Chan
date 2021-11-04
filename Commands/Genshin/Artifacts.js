const { MessageEmbed } = require("discord.js");
const genshindb = require("genshin-db");
const _ = require("lodash");

module.exports = {
  name: "artifacts",
  description: "Shows All Artifacts In Genshin Impact",
  options: [
    {
      type: "SUB_COMMAND",
      name: "list",
      description: "Shows Genshin Artifact List Available In Database",
    },
    {
      type: "SUB_COMMAND",
      name: "info",
      description: "Shows Info On Genshin Artifact",
      options: [
        {
          type: "STRING",
          name: "artifact",
          description: "The Artifact",
          required: true,
        },
      ],
    },
  ],
  run: async (client, interaction) => {
    let option = interaction.options.getSubcommand();

    if (option === "list") {
      let pages = [];

      let data = genshindb.artifacts("names", { matchCategories: true });
      data = _.chunk(data, 10);

      for (let page of data) {
        pages.push(
          new MessageEmbed()
            .setTitle("Artifacts List")
            .setColor(client.color())
            .setDescription(`${page.join("\n")}`)
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
        );
      }

      return client.pagination.button(interaction, pages);
    } else if (option === "info") {
      let artifact = interaction.options.getString("artifact");
      let data = genshindb.artifacts(artifact);
      if (!data)
        return interaction.followUp({
          content: `> That Artifact Does Not Exist In My Database`,
          ephemeral: true,
        });

      let embed = new MessageEmbed()
        .setTitle("Artifact Info")
        .setDescription(
          `${data.name}\n${data.rarity.map((x) => `${x} 🌟`).join("\n")}`
        )
        .setColor(client.color())
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp()
        .addField(
          "Flower",
          `Name - ${data.flower.name}\nType - ${data.flower.relictype}\nDescription - ${data.flower.description}`
        )
        .addField(
          "Plume",
          `Name - ${data.plume.name}\nType - ${data.plume.relictype}\nDescription - ${data.plume.description}`
        )
        .addField(
          "Sands",
          `Name - ${data.sands.name}\nType - ${data.sands.relictype}\nDescription - ${data.sands.description}`
        )
        .addField(
          "Goblet",
          `Name - ${data.goblet.name}\nType - ${data.goblet.relictype}\nDescription - ${data.goblet.description}`
        )
        .addField(
          "Circlet",
          `Name - ${data.circlet.name}\nType - ${data.circlet.relictype}\nDescription - ${data.circlet.description}`
        );

      return interaction.followUp({ embeds: [embed] });
    }
  },
};
