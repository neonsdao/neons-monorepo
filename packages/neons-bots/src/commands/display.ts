import Discord from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { getNounPngBuffer } from '../utils';

export const data = new SlashCommandBuilder()
  .setName('display')
  .setDescription('Displays a Neon')
  .addStringOption((option: any) =>
    option.setName('neon_id').setDescription('The token id of the Neon').setRequired(true),
  );

export async function execute(interaction: any) {
  const neonId = interaction.options.getString('neon_id');
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
}
