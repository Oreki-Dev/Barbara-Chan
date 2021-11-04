module.exports = {
  name: "ping",
  description: "Returns Client's Latency",
  run: async (client, interaction) => {
    return interaction.followUp({ content: `> ${client.ws.ping}'ms 🏓` });
  },
};
