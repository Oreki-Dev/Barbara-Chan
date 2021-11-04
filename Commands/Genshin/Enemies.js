const { MessageEmbed } = require("discord.js");
const genshindb = require("genshin-db");
const _ = require("lodash");

module.exports = {
  name: "enemies",
  description: "Shows All Enemies In Genshin Impact",
  run: async (client, interaction) => {
    let pages = [];

    let data = genshindb.enemies("names", { matchCategories: true });
    data = _.chunk(data, 10);

    for (let page of data) {
      pages.push(
        new MessageEmbed()
          .setTitle("Enemies List")
          .setColor(client.color())
          .setDescription(`${page.join("\n")}`)
          .setThumbnail(client.user.displayAvatarURL())
          .setTimestamp()
      );
    }

    return client.pagination.button(interaction, pages);
  },
};
