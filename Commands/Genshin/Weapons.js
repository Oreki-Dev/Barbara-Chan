const { MessageEmbed } = require("discord.js");
const genshindb = require("genshin-db");
const _ = require("lodash");

module.exports = {
  name: "weapons",
  description: "Shows All Weapons In Genshin Impact",
  options: [
    {
      type: "SUB_COMMAND",
      name: "list",
      description: "Shows Genshin Weapon List Available In Database",
    },
    {
      type: "SUB_COMMAND",
      name: "info",
      description: "Shows Info On Genshin Weapon",
      options: [
        {
          type: "STRING",
          name: "weapon",
          description: "The Weapon",
          required: true,
        },
      ],
    },
  ],
  run: async (client, interaction) => {
    let option = interaction.options.getSubcommand();

    if (option === "list") {
      let pages = [];

      let data = genshindb.weapons("names", { matchCategories: true });
      data = _.chunk(data, 10);

      for (let page of data) {
        pages.push(
          new MessageEmbed()
            .setTitle("Weapons List")
            .setColor(client.color())
            .setDescription(`${page.join("\n")}`)
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
        );
      }

      return client.pagination.button(interaction, pages);
    } else if (option === "info") {
      let weapon = interaction.options.getString("weapon");
      let data = genshindb.weapons(weapon);
      if (!data)
        return interaction.followUp({
          content: `> That Weapon Does Not Exist In My Database`,
          ephemeral: true,
        });

      let embed = new MessageEmbed()
        .setTitle("Weapon Info")
        .setDescription(
          `${data.name}\n${data.rarity} 🌟\nType - ${data.weapontype}\nDescription - ${data.description}\n\nBase Attack - ${data.baseatk}\nEffect - ${data.effectname} - ${data.effect}`
        )
        .setColor(client.color())
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp()
        .addField(
          "Ascends",
          `Ascend 1 - ${data.costs.ascend1
            .map((field) => `${field.name} - ${field.count}`)
            .join("\n")}\nAscend 2 - ${data.costs.ascend2
            .map((field) => `${field.name} - ${field.count}`)
            .join("\n")}\nAscend 3 - ${data.costs.ascend3
            .map((field) => `${field.name} - ${field.count}`)
            .join("\n")}\nAscend 4 - ${data.costs.ascend4
            .map((field) => `${field.name} - ${field.count}`)
            .join("\n")}\nAscend 5 - ${data.costs.ascend5
            .map((field) => `${field.name} - ${field.count}`)
            .join("\n")}\nAscend 6 - ${data.costs.ascend6
            .map((field) => `${field.name} - ${field.count}`)
            .join("\n")}`
        );

      return interaction.followUp({ embeds: [embed] });
    }
  },
};
