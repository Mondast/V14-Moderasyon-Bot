const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("yardım")
        .setDescription("Yardım menüsünü gösterir."),
    run: async (client, interaction) => {
        const Yardım = new EmbedBuilder()
            .setColor("Blurple")
            .setImage("https://media.discordapp.net/attachments/1235344694569865277/1237397037239238747/bot_gif.gif?ex=663b7f4b&is=663a2dcb&hm=609c722e418bb4f5eefccf2cd6dd1de4a3708841cdd07fa1d181346055090a3b&=")
            .setTitle("Stones10 • Moderasyon Menüsü")
            .setDescription(`                
                **/ban** • Belirtilen kişiyi sunucudan banlar.
                **/kick** • Belirtilen kişiyi sunucudan atar.
                **/unban** • Belirtilen idli kişinin banını açar.
                **/kilit kilitle** • Kanalı kilitler.
                **/kilit kaldır** • Eğerki kanal kilitliyse o kiliti kaldırır.
                **/oto-rol** • Sunucuya gelen üyelere otomatik rol verir.
                **/reklam-engel** • Reklam engel sistemini açar.
                **/slowmode** • Kanala yavaş mod ekler.
                **/temizle** • Belirtilen miktarda mesaj siler.

            `);

        interaction.reply({ embeds: [Yardım] });
    },
};
