const { MessageEmbed } = require("discord.js");
const genshindb = require("genshin-db");
const _ = require("lodash");

module.exports = {
  name: "character",
  description: "Shows Genshin Characters List Available In Database",
  options: [
    {
      type: "SUB_COMMAND",
      name: "list",
      description: "Shows Genshin Characters List Available In Database",
    },
    {
      type: "SUB_COMMAND",
      name: "info",
      description: "Shows Info On Genshin Characters",
      options: [
        {
          type: "STRING",
          name: "character",
          description: "The Character",
          required: true,
        },
      ],
    },
  ],
  run: async (client, interaction) => {
    let command = interaction.options.getSubcommand();

    if (command === "list") {
      let data = genshindb.characters("names", { matchCategories: true });
      data = _.chunk(data, 10);
      let pages = [];

      for (let page of data) {
        pages.push(
          new MessageEmbed()
            .setTitle("Character List")
            .setColor(client.color())
            .setDescription(`${page.join("\n")}`)
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
        );
      }

      return client.pagination.button(interaction, pages);
    } else if (command === "info") {
      let character = interaction.options.getString("character");
      let data = genshindb.characters(character);
      if (!data)
        return interaction.followUp({
          content: `> That Character Does Not Exist In My Database`,
          ephemeral: true,
        });

      let data2 = genshindb.talents(character);
      let data3 = genshindb.constellations(character);

      let embed = new MessageEmbed()
        .setTitle("Basic Info")
        .setColor(client.color())
        .setDescription(
          `${data.name} - ${data.rarity} 🌟\nGender - ${data.gender}\nBirthday - ${data.birthday}\n\n${data.description}`
        )
        .setThumbnail(`${data.images.icon}`)
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

      let embed2 = new MessageEmbed()
        .setTitle("Talents Info")
        .setColor(client.color())
        .setDescription(
          `${data.name} - ${data.rarity} 🌟\nGender - ${data.gender}\nBirthday - ${data.birthday}\n\n${data.description}`
        )
        .setThumbnail(`${data.images.icon}`)
        .setTimestamp()
        .addField(
          "Passive Skills",
          `${data2.passive1.name}\n${data2.passive1.info}\n\n${data2.passive2.name}\n${data2.passive2.info}\n\n${data2.passive3.name}\n${data2.passive3.info}\n\n`
        )
        .addField(
          "Active Skills",
          `${data2.combat1.name}\n${data2.combat1.info}\n\n${data2.combat2.name}\n${data2.combat2.info}\n\n${data2.combat3.name}\n${data2.combat3.info}\n\n`
        );

      let embed3 = new MessageEmbed()
        .setTitle("Constellations Info")
        .setColor(client.color())
        .setDescription(
          `${data.name} - ${data.rarity} 🌟\nGender - ${data.gender}\nBirthday - ${data.birthday}\n\n${data.description}`
        )
        .setThumbnail(`${data.images.icon}`)
        .setTimestamp()
        .addField(
          "All Constellations",
          `${data3.c1.name}\n${data3.c1.effect}\n\n${data3.c2.name}\n${data3.c2.effect}\n\n${data3.c3.name}\n${data3.c3.effect}\n\n${data3.c4.name}\n${data3.c4.effect}\n\n${data3.c5.name}\n${data3.c5.effect}\n\n${data3.c6.name}\n${data3.c6.effect}\n\n`
        );

      return client.pagination.button(interaction, [embed, embed2, embed3]);
    }
  },
};
