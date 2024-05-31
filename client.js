import {
  Client,
  GatewayIntentBits,
  Partials,
  ApplicationCommandOptionType,
  Events,
} from "discord.js";

export const client = async () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.User, Partials.Reaction, Partials.Message],
  });

  client
    .login(process.env.DISCORD_TOKEN)
    .then(() => console.log("connected the bot"))
    .catch((err) => console.log(err));

  client.on(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    let commands;
    if (guild) {
      commands = guild.commands;
    } else {
      commands = client?.application.commands;
    }

    // commands?.create({
    //   name: "vote",
    //   description: "vote for user",
    //   options: [
    //     {
    //       name: "username",
    //       required: true,
    //       description: "username of the user to vote for",
    //       type: ApplicationCommandOptionType.User,
    //     },
    //   ],
    // });
  });

  client.on(Events.MessageCreate, async (msg) => {});
  client.on(Events.MessageReactionRemove, async (reaction, user) => {});
};
