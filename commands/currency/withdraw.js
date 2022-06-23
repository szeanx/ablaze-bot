const Discord = require("discord.js");
const profileModel = require("../../models/profileSchema");

module.exports = {
    name: "withdraw",
    description: "Withdraw some money",
    aliases: ["w"],
    async execute(message, args, client, profileData) {
        const amount = args[0];
        if (amount % 1 != 0 || amount <= 0)
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor(
                        client.user.username,
                        client.user.displayAvatarURL(),
                    )
                    .setDescription(
                        `${client.emotes.error} Please enter a valid amount of money!`,
                    ),
            );
        try {
            if (amount > profileData.bank)
                return message.channel.send(
                    new Discord.MessageEmbed()
                        .setColor("RED")
                        .setAuthor(
                            client.user.username,
                            client.user.displayAvatarURL(),
                        )
                        .setDescription(
                            `${client.emotes.error} You don't have that much money in the bank!`,
                        ),
                );
            await profileModel.findOneAndUpdate(
                {
                    userID: message.author.id,
                },
                {
                    $inc: {
                        coins: amount,
                        bank: -amount,
                    },
                },
            );
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setAuthor(
                        client.user.username,
                        client.user.displayAvatarURL(),
                    )
                    .setDescription(
                        `${client.emotes.success} You withdrew ${amount} coins!`,
                    ),
            );
        } catch (err) {
            console.log(err);
        }
    },
};
