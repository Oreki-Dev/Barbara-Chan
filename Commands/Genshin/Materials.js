const { MessageEmbed } = require("discord.js");
const genshindb = require("genshin-db");
const _ = require("lodash");

module.exports = {
  name: "materials",
  description: "Shows All Materials In Genshin Impact",
  options: [
    {
      type: "SUB_COMMAND",
      name: "list",
      description: "Shows Genshin Material List Available In Database",
    },
    {
      type: "SUB_COMMAND",
      name: "info",
      description: "Shows Info On Genshin Material",
      options: [
        {
          type: "STRING",
          name: "material",
          description: "The Material",
          required: true,
        },
      ],
    },
  ],
  run: async (client, interaction) => {
    let option = interaction.options.getSubcommand();

    if (option === "list") {
      let pages = [];

      let data = genshindb.materials("names", { matchCategories: true });
      data = _.chunk(data, 10);

      for (let page of data) {
        pages.push(
          new MessageEmbed()
            .setTitle("Material List")
            .setColor(client.color())
            .setDescription(`${page.join("\n")}`)
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
        );
      }

      return client.pagination.button(interaction, pages);
    } else if (option === "info") {
      let material = interaction.options.getString("material");
      let data = genshindb.materials(material);
      if (!data)
        return interaction.followUp({
          content: `> That Artifact Does Not Exist In My Database`,
          ephemeral: true,
        });

      let embed = new MessageEmbed()
        .setTitle("Material Info")
        .setDescription(
          `${data.name}\n${data.rarity} 🌟\nDescription - ${
            data.description
          }\nCategory - ${data.category}\nType - ${
            data.materialtype
          }\nSource - ${data.source.map((x) => x).join(", ")}\nDays Of Week - ${
            data.daysofweek
          }`
        )
        .setColor(client.color())
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp();

      return interaction.followUp({ embeds: [embed] });
    }
  },
};
