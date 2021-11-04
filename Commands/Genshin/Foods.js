const { MessageEmbed } = require("discord.js");
const genshindb = require("genshin-db");
const _ = require("lodash");

module.exports = {
  name: "foods",
  description: "Shows All Food In Genshin Impact",
  options: [
    {
      type: "SUB_COMMAND",
      name: "list",
      description: "Shows Genshin Food List Available In Database",
    },
    {
      type: "SUB_COMMAND",
      name: "info",
      description: "Shows Info On Genshin Food",
      options: [
        {
          type: "STRING",
          name: "food",
          description: "The Food",
          required: true,
        },
      ],
    },
  ],
  run: async (client, interaction) => {
    let option = interaction.options.getSubcommand();

    if (option === "list") {
      let pages = [];

      let data = genshindb.foods("names", { matchCategories: true });
      data = _.chunk(data, 10);

      for (let page of data) {
        pages.push(
          new MessageEmbed()
            .setTitle("Food List")
            .setColor(client.color())
            .setDescription(`${page.join("\n")}`)
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
        );
      }

      return client.pagination.button(interaction, pages);
    } else if (option === "info") {
      let food = interaction.options.getString("food");
      let data = genshindb.foods(food);
      if (!data)
        return interaction.followUp({
          content: `> That Food Does Not Exist In My Database`,
          ephemeral: true,
        });

      let embed = new MessageEmbed()
        .setTitle("Food Info")
        .setDescription(
          `${data.name}\n${data.rarity} 🌟\nDescription - ${data.description}\nType - ${data.foodtype}\nFilter - ${data.foodfilter}\nEffect - ${data.effect}`
        )
        .setColor(client.color())
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp()
        .addField(
          "Ingredients",
          `${data.ingredients
            .map((field) => `${field.name} - ${field.count}`)
            .join("\n")}`
        );

      return interaction.followUp({ embeds: [embed] });
    }
  },
};
