const { MessageEmbed } = require("discord.js");
const { exec } = require("child_process");

module.exports = {
  name: "shell",
  description: "Owner Only Command",
  options: [
    {
      type: "STRING",
      name: "code",
      description: "The Code To Run In Console",
      required: true,
    },
  ],
  run: async (client, interaction) => {
    let code = interaction.options.getString("code");

    try {
      exec(code, (error, stdout) => {
        let result = stdout || error;

        let embed = new MessageEmbed()
          .setTitle("Shell")
          .addField("Input", `\`\`\`js\n${truncate(clean(code), 1500)}\`\`\``)
          .setColor(client.color())
          .setTimestamp();

        if (error) {
          embed.addField(
            "Output",
            `\`\`\`js\n${truncate(clean(result), 1500)}\`\`\``
          );
        } else {
          embed.addField(
            "Output",
            `\`\`\`js\n${truncate(clean(result), 1500)}\`\`\``
          );
        }

        return interaction.followUp({ embeds: [embed] });
      });
    } catch (e) {
      let embed = new MessageEmbed()
        .setTitle("Shell Error")
        .setColor(client.color())
        .setTimestamp()
        .addField("Input", `\`\`\`js\n${truncate(clean(code), 1500)}\`\`\``)
        .addField("Output", `\`\`\`js\n${truncate(clean(e), 1500)}\`\`\``);

      return interaction.followUp({ embeds: [embed] });
    }
  },
};

function clean(text) {
  return String(text)
    .replace(/`/g, `\`${String.fromCharCode(8203)}`)
    .replace(/@/g, `@${String.fromCharCode(8203)}`);
}

function truncate(str, length, end = "...") {
  return (
    String(str).substring(0, length - end.length) +
    (str.length > length ? end : "")
  );
}
