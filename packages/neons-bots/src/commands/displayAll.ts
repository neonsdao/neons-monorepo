import Discord from 'discord.js';
import { isError, tryF } from 'ts-try';
import { SlashCommandBuilder } from '@discordjs/builders';
import { getNounPngBuffer } from '../utils';
import { nounsTokenContract } from '../clients';

export const data = new SlashCommandBuilder()
  .setName('display_all')
  .setDescription('Displays all Neons owned by an address')
  .addStringOption((option: any) =>
    option
      .setName('owner_address')
      .setDescription('The owner of the Neons to display')
      .setRequired(true),
  );

export async function execute(interaction: any) {
  const ownerAddress = interaction.options.getString('owner_address');
  let response = await tryF(() => nounsTokenContract.tokenOfOwnerByIndex(ownerAddress, i));

  let i = 0;
  while (!isError(response)) {
    const neonId = response;
    console.log('neonId', response);
    const png = await getNounPngBuffer(neonId.toString());

    if (!png) return;

    const attachmentName = `Neon-${neonId}.png`;
    const attachment = new Discord.MessageAttachment(png, attachmentName);
    const emb = new Discord.MessageEmbed()
      .setTitle(`Neon ${neonId}`)
      .setDescription(`Neon #${neonId}`)
      .setURL('https://neons.lol')
      .addField('Neon ID', neonId, true)
      .setImage(`attachment://${attachmentName}`)
      .setTimestamp();

    await interaction.reply({ embeds: [emb], files: [attachment] });

    response = await tryF(() => nounsTokenContract.tokenOfOwnerByIndex(ownerAddress, ++i));
  }
}
