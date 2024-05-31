import { Client, GatewayIntentBits, Partials, Events } from "discord.js";
import amqp from "amqplib";

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
    (async () => {
      const queue = "botQueue";
      try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        process.once("SIGINT", async () => {
          await channel.close();
          await connection.close();
        });

        await channel.assertQueue(queue, { durable: false });
        await channel.consume(
          queue,
          async (message) => {
            if (message) {
              const msg = JSON.parse(message.content.toString());

              console.log(msg);

              try {
                if (msg.type === "project") {
                  const channel = await guild.channels.create({
                    name: msg.projectTitle,
                    type: 0,
                    parent: "1246232415165218816",
                    // your permission overwrites or other options here
                  });

                  // send msg to channel
                  await channel.send(
                    "هەموو ئەرکەکانی تایبەت بەم پرۆجێکتە لێرە دەبن"
                  );
                }
              } catch (error) {
                console.log(error);
              }
            }
          },
          { noAck: true }
        );

        console.log(" [*] Waiting for messages. To exit press CTRL+C");
      } catch (err) {
        console.warn(err);
      }
    })();
  });

  client.on(Events.MessageCreate, async (msg) => {});
  client.on(Events.MessageReactionRemove, async (reaction, user) => {});
};
