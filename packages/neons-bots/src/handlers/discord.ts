import Discord from 'discord.js';
import {
  formatBidMessageText,
  formatNewGovernanceProposalText,
  formatNewGovernanceVoteText,
  formatProposalAtRiskOfExpiryText,
  formatUpdatedGovernanceProposalStatusText,
  getAuctionEndingSoonTweetText,
  getNounPngBuffer,
} from '../utils';
import { Bid, IAuctionLifecycleHandler, Proposal, Vote } from '../types';

export class DiscordAuctionLifecycleHandler implements IAuctionLifecycleHandler {
  constructor(public readonly discordClients: Discord.WebhookClient[]) {}

  /**
   * Send Discord message with an image of the current noun alerting users
   * @param auctionId The current auction ID
   */
  async handleNewAuction(auctionId: number) {
    const png = await getNounPngBuffer(auctionId.toString());

    if (png) {
      const attachmentName = `Auction-${auctionId}.png`;
      const attachment = new Discord.MessageAttachment(png, attachmentName);
      const message = new Discord.MessageEmbed()
        .setTitle(`New Auction Discovered`)
        .setDescription(`An auction has started for Neon #${auctionId}`)
        .setURL('https://neons.lol')
        .addField('Neon ID', auctionId, true)
        .attachFiles([attachment])
        .setImage(`attachment://${attachmentName}`)
        .setTimestamp();
      await Promise.all(this.discordClients.map(c => c.send(message)));
    } else {
      const message = new Discord.MessageEmbed()
        .setTitle(`New Auction Discovered`)
        .setDescription(`An auction has started for Neon #${auctionId}`)
        .setURL('https://neons.lol')
        .addField('Neon ID', auctionId, true)
        .setTimestamp();
      await Promise.all(this.discordClients.map(c => c.send(message)));
    }
    console.log(`processed discord new auction ${auctionId}`);
  }

  /**
   * Send Discord message with new bid event data
   * @param auctionId Neon auction number
   * @param bid Bid amount and ID
   */
  async handleNewBid(auctionId: number, bid: Bid) {
    const message = new Discord.MessageEmbed()
      .setTitle(`New Bid Placed`)
      .setURL('https://neons.lol')
      .setDescription(await formatBidMessageText(auctionId, bid))
      .setTimestamp();
    await Promise.all(this.discordClients.map(c => c.send(message)));
    console.log(`processed discord new bid ${auctionId}:${bid.id}`);
  }

  /**
   * Tweet a reply informing observers that the auction is ending soon
   * @param auctionId The current auction id
   */
  async handleAuctionEndingSoon(auctionId: number) {
    const message = new Discord.MessageEmbed()
      .setTitle(`Auction Ending Soon`)
      .setURL('https://neons.lol')
      .setDescription(getAuctionEndingSoonTweetText())
      .setTimestamp();
    await Promise.all(this.discordClients.map(c => c.send(message)));
    console.log(`processed auction ending soon ${auctionId}`);
  }

  async handleNewProposal(proposal: Proposal) {
    const message = new Discord.MessageEmbed()
      .setTitle(`New Governance Proposal`)
      .setURL(`https://neons.lol/vote/${proposal.id}`)
      .setDescription(formatNewGovernanceProposalText(proposal))
      .setTimestamp();
    await Promise.all(this.discordClients.map(c => c.send(message)));
    console.log(`processed discord new proposal ${proposal.id}`);
  }

  async handleUpdatedProposalStatus(proposal: Proposal) {
    const message = new Discord.MessageEmbed()
      .setTitle(`Proposal Status Update`)
      .setURL(`https://neons.lol/vote/${proposal.id}`)
      .setDescription(formatUpdatedGovernanceProposalStatusText(proposal))
      .setTimestamp();
    await Promise.all(this.discordClients.map(c => c.send(message)));
    console.log(`processed discord proposal update ${proposal.id}`);
  }

  async handleProposalAtRiskOfExpiry(proposal: Proposal) {
    const message = new Discord.MessageEmbed()
      .setTitle(`Proposal At-Risk of Expiry`)
      .setURL(`https://neons.lol/vote/${proposal.id}`)
      .setDescription(formatProposalAtRiskOfExpiryText(proposal))
      .setTimestamp();
    await Promise.all(this.discordClients.map(c => c.send(message)));
    console.log(`processed discord proposal expiry warning ${proposal.id}`);
  }

  async handleGovernanceVote(proposal: Proposal, vote: Vote) {
    const message = new Discord.MessageEmbed()
      .setTitle(`New Proposal Vote`)
      .setURL(`https://neons.lol/vote/${proposal.id}`)
      .setDescription(await formatNewGovernanceVoteText(proposal, vote))
      .setTimestamp();
    await Promise.all(this.discordClients.map(c => c.send(message)));
    console.log(`processed discord new vote for proposal ${proposal.id};${vote.id}`);
  }
}
