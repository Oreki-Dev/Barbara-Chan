const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
  name: "help",
  description: "Shows All Bot Commands",
  run: async (client, interaction) => {
    let slash = "/";

    let categories = [];

    readdirSync("./Commands/").forEach((dir) => {
      if (dir.toLowerCase() !== "owner") {
        const commands = readdirSync(`./Commands/${dir}/`).filter((file) =>
          file.endsWith(".js")
        );

        const cmds = commands.map((command) => {
          let file = require(`../../Commands/${dir}/${command}`);
          if (!file.name) return "No command name.";
          let name = file.name.replace(".js", "");
          return `\`${slash}${name} - ${file.description}\`\n`;
        });

        let data = new Object();

        data = {
          name: dir.toUpperCase() + " | " + cmds.length,
          value: cmds.length === 0 ? "In progress" : cmds.join(""),
        };
        categories.push(data);
      }
    });

    const embed = new MessageEmbed()
      .setTitle(client.user.username)
      .setDescription("All My Commands")
      .addFields(categories)
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp()
      .setColor(client.color());

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Support")
        .setStyle("LINK")
        .setURL("https://discord.gg/dZW8hXQfm3")
    );

    return interaction.followUp({ embeds: [embed], components: [row] });
  },
};
