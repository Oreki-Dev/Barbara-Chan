const { MessageEmbed } = require("discord.js");
const genshindb = require("genshin-db");
const _ = require("lodash");

module.exports = {
  name: "domains",
  description: "Shows All Domains In Genshin Impact",
  options: [
    {
      type: "SUB_COMMAND",
      name: "list",
      description: "Shows Genshin Domain List Available In Database",
    },
    {
      type: "SUB_COMMAND",
      name: "info",
      description: "Shows Info On Genshin Domain",
      options: [
        {
          type: "STRING",
          name: "domain",
          description: "The Domain",
          required: true,
        },
      ],
    },
  ],
  run: async (client, interaction) => {
    let option = interaction.options.getSubcommand();

    if (option === "list") {
      let pages = [];

      let data = genshindb.domains("names", { matchCategories: true });
      data = _.chunk(data, 10);

      for (let page of data) {
        pages.push(
          new MessageEmbed()
            .setTitle("Domain List")
            .setColor(client.color())
            .setDescription(`${page.join("\n")}`)
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
        );
      }

      return client.pagination.button(interaction, pages);
    } else if (option === "info") {
      let domain = interaction.options.getString("domain");
      let data = genshindb.domains(fomain);
      if (!data)
        return interaction.followUp({
          content: `> That Domain Does Not Exist In My Database`,
          ephemeral: true,
        });

      let embed = new MessageEmbed()
        .setTitle("Domain Info")
        .setDescription(
          `${data.name}\nRegion - ${data.region}\nEntrance - ${
            data.domainentrance
          }\nType - ${data.domaintype}\nDescription - ${
            data.description
          }\nRecommended Level - ${
            data.recommendedlevel
          }\nRecommended Elements - ${data.recommendedelements.join(
            ", "
          )}\nMonsters Inside - ${data.monsterlist.join(
            ", "
          )}\nDays Of Unlock - ${data.daysofweek.join(", ")}`
        )
        .setColor(client.color())
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp()
        .addField(
          "Rewards",
          `${data.rewardpreview
            .map((field) => `${field.name} - ${field.count}`)
            .join("\n")}`
        );

      return interaction.followUp({ embeds: [embed] });
    }
  },
};
