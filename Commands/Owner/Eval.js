const { MessageEmbed } = require("discord.js");
const { inspect } = require("util");

module.exports = {
  name: "eval",
  description: "Owner Only Command",
  ownerOnly: true,
  options: [
    {
      type: "STRING",
      name: "code",
      description: "The Code To Evaluate",
      required: true,
    },
  ],
  run: async (client, interaction) => {
    let code = interaction.options.getString("code");

    try {
      let evaled = eval(code);
      if (typeof evaled !== "string") evaled = inspect(evaled, { depth: 0 });

      let embed = new MessageEmbed()
        .setTitle("Eval")
        .setColor(client.color())
        .addField("Input", `\`\`\`js\n${truncate(clean(code), 1000)}\`\`\``)
        .addField("Output", `\`\`\`js\n${truncate(clean(evaled), 1000)}\`\`\``)
        .setTimestamp();

      return interaction.followUp({ embeds: [embed] });
    } catch (e) {
      let embed = new MessageEmbed()
        .setTitle("Eval Error")
        .setColor("RED")
        .addField("Input", `\`\`\`js\n${truncate(clean(code), 1000)}\`\`\``)
        .addField("Output", `\`\`\`js\n${truncate(clean(e), 1000)}\`\`\``)
        .setTimestamp();
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
