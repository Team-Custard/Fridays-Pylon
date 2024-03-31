const kingid = '1199700559763091557';
const adminid = '1198797822552711219';
const modid = '1222295580123074591';

const verifyKv = new pylon.KVNamespace('verification');

discord.on('GUILD_MEMBER_ADD', async (member) => {
  const guild = await member.getGuild();
  // const channel = await guild.getChannel("");
  const channel = await discord.getGuildTextChannel('1199497550143701042');
  channel.sendMessage(
    `<:MarkiplierSpiritualBro:1208448824356642837> Ayo ${member.toMention()} joined real (${
      guild.memberCount
    })`
  );
});

discord.on('GUILD_MEMBER_UPDATE', async (member, oldmember) => {
  if (member.roles != oldmember.roles) {
    // Roles has changed. Run the line below.
    if (
      member.roles.indexOf('1213311894291611648') != -1 &&
      oldmember.roles.indexOf('1213311894291611648') == -1
    ) {
      const channel = await discord.getGuildTextChannel('1213307728227999765');
      channel.sendMessage(`${member.user.getTag()} joined s-chat`);
    }
    if (
      member.roles.indexOf('1213311894291611648') == -1 &&
      oldmember.roles.indexOf('1213311894291611648') != -1
    ) {
      const channel = await discord.getGuildTextChannel('1213307728227999765');
      channel.sendMessage(`${member.user.getTag()} left s-chat`);
    }
  }
});

discord.on('MESSAGE_REACTION_ADD', async (reaction) => {
  const verifyid = await verifyKv.get<string>('channel');
  const serverlocked = await verifyKv.get<string>('locked');
  if (
    reaction.messageId == verifyid &&
    serverlocked != 'yes' &&
    reaction.emoji.id == '1199706585971302420' &&
    reaction.member.roles.indexOf('1198782993444114512') == -1
  ) {
    reaction.member.addRole('1198782993444114512');
    const channel = await discord.getGuildTextChannel(reaction.channelId);
    channel
      .sendMessage(
        `${reaction.member.toMention()} You accepted the terms. Enjoy the server. <:cool:1199711854436560926>`
      )
      .then((m) => {
        setTimeout(() => {
          m.delete();
        }, 5000);
      });
  }
});

discord.on('GUILD_MEMBER_REMOVE', async (removedmember, member) => {
  const guild = await member.getGuild();
  // const channel = await guild.getChannel("");
  const channel = await discord.getGuildTextChannel('1199497550143701042');
  channel.sendMessage(
    `<:MarkiplierHigh:1208448744312283217> Bro left, rip ${member.user.username} (${guild.memberCount})`
  );
});

const commands = new discord.command.CommandGroup({
  defaultPrefix: '=',
  mentionPrefix: true,
});

function memberIsStaff(
  user: discord.GuildMember,
  level: String,
  response?: discord.Message
) {
  //console.log(user.roles);
  switch (level) {
    case 'mod': {
      if (user.roles.indexOf(modid) != -1) {
        return true;
      } else {
        if (response)
          response.reply(
            'No permission to use this command. This command requires level 50 permissions to use.'
          );
        return false;
      }
    }
    case 'admin': {
      if (user.roles.indexOf(adminid) != -1) {
        return true;
      } else {
        if (response)
          response.reply(
            'No permission to use this command. This command requires level 100 permissions to use.'
          );
        return false;
      }
    }
    case 'king': {
      if (user.roles.indexOf(kingid) != -1) {
        return true;
      } else {
        if (response)
          response.reply(
            'No permission to use this command. This command requires level 200 permissions to use.'
          );
        return false;
      }
    }
  }
}

commands.raw('help', async (message) => {
  // Respond to the message, pinging the author.
  await message.reply(
    `## The Fridays\n` +
      `All moderation commands are handled by Aperture. For info on that bot, go to [their website here](https://aperturebot.science).\nThis bot was built by SylveonDev with Pylon. Prefix is \`=\`.\n` +
      `\n### Verification management:\n\`=letmein\` : Verifies you.\n\`=verify\` : Manually verifies a member. This bypasses the verification requirement of the Fridays.\n` +
      `\`=unverified\` : Sends a list of members who currently are not verified.` +
      `\n\n### Sandbox-Member management:\n\`=smember\` : Moves member to s-member.\n\`=unsmember\` : Moves member from s-member to member.` +
      `\n\`=smemberpass\` : Adds a member to sandbox.\n\`=unsmemberpass\` : Removes member from sandbox.\n\`=smembers\` : Returns a list of all s-members.\n\`=sstatus\` : Gets the status of S-member` +
      `\n\n[\`[Pylon Website]\`](<https://pylon.bot>) [\`[The Fridays rules]\`](<https://discord.com/channels/1198780918681313340/1198791053013164143>)`
  );
});

commands.raw('useless', async (message) => {
  // Respond to the message, pinging the author.
  await message.reply(`This command is useless why did you use this.`);
});

commands.raw('vmessage', async (message) => {
  if (memberIsStaff(message.member, 'king', message)) {
    // Respond to the message, pinging the author.
    var msg = await message.reply(
      new discord.Embed({
        title: 'Verification',
        description:
          'By verifying, you agree that you are of age to be in this server, you accept the rules, and you acknowledge that this server is not family friendly, and will contain conversations not suitable for children.\nFailure to follow the terms listed in <#1198791053013164143> will result in moderation action being taken on you.\nIf you accept these terms, react with <:giggle:1199706585971302420> to verify.',
        color: 0x63a1db,
      })
    );
    await msg.addReaction('giggle:1199706585971302420');
    verifyKv.put('channel', msg.id);
  }
});

commands.raw('letmein', async (message) => {
  // Respond to the message, pinging the author.
  const blacklist = ['1145174784754331670', '830817012779319296'];
  if (blacklist.indexOf(message.member.user.id) == -1) {
    message.member.addRole('1198782993444114512');
    message.addReaction('giggle:1199706585971302420');
  } else {
    message.member.addRole('1198782993444114512');
    message.addReaction('braixonBawwww:1218175870204776518');
  }
});

commands.on(
  'sstatus',
  (args) => ({
    input: args.guildMember(),
  }),
  async (message, { input }) => {
    if (input && memberIsStaff(message.member, 'mod', message)) {
      if (input.roles.indexOf('1213306437439193120') != -1) {
        message.reply(
          `✅ ${input.user.getTag()} is an s-member. They are locked to the s-chat.`
        );
      } else if (input.roles.indexOf('1213311894291611648') != -1) {
        message.reply(
          `✅ ${input.user.getTag()} has the s-member pass and can see the s-chat.`
        );
      } else {
        message.reply(
          `🚫 ${input.user.getTag()} is not an s-member. Thay cannot see the s-chat.`
        );
      }
    }
  }
);

commands.on(
  'smemberpass',
  (args) => ({
    input: args.guildMember(),
  }),
  async (message, { input }) => {
    if (input && memberIsStaff(message.member, 'admin', message)) {
      input.addRole('1213311894291611648');
      message.reply(`✅ ${input.user.getTag()} has been added to s-member.`);
    }
  }
);

commands.on(
  'unsmemberpass',
  (args) => ({
    input: args.guildMember(),
  }),
  async (message, { input }) => {
    if (input && memberIsStaff(message.member, 'admin', message)) {
      input.removeRole('1213311894291611648');
      message.reply(`✅ ${input.user.getTag()} has been pulled from s-member.`);
    }
  }
);

commands.on(
  'verify',
  (args) => ({
    input: args.guildMember(),
  }),
  async (message, { input }) => {
    if (input && memberIsStaff(message.member, 'admin', message)) {
      input.addRole('1198782993444114512');
      message.reply(`✅ ${input.user.getTag()} has been verified.`);
    }
  }
);

commands.on(
  'smember',
  (args) => ({
    input: args.guildMember(),
  }),
  async (message, { input }) => {
    if (input && memberIsStaff(message.member, 'admin', message)) {
      input.removeRole('1198782993444114512');
      input.addRole('1213306437439193120');
      message.reply(`✅ ${input.user.getTag()} has been s-membered.`);
    }
  }
);

commands.on(
  'unsmember',
  (args) => ({
    input: args.guildMember(),
  }),
  async (message, { input }) => {
    if (input && memberIsStaff(message.member, 'admin', message)) {
      input.addRole('1198782993444114512');
      input.removeRole('1213306437439193120');
      message.reply(
        `✅ ${input.user.getTag()} has been removed from s-member.`
      );
    }
  }
);

commands.on(
  'unverified',
  (args) => ({}),
  async (message) => {
    if (memberIsStaff(message.member, 'mod', message)) {
      const guild = await message.getGuild();
      const unverified = [];
      for await (const member of guild.iterMembers()) {
        if (!member.roles.find((r) => '1198782993444114512')) {
          unverified.push(`${member.user.getTag()} (${member.user.id})`);
        }
      }
      await message.reply(
        unverified.length == 0
          ? `There is no unverified members. All caught up.`
          : `The following members are unverified:\n${unverified.join(', ')}`
      );
    }
  }
);

commands.on(
  'smembers',
  (args) => ({}),
  async (message) => {
    if (memberIsStaff(message.member, 'mod', message)) {
      const guild = await message.getGuild();
      const unverified = [];
      for await (const member of guild.iterMembers()) {
        if (!member.roles.find((r) => '1213306437439193120')) {
          unverified.push(`${member.user.getTag()} (${member.user.id})`);
        }
      }
      await message.reply(
        unverified.length == 0
          ? `There is no s-members at this time. Note this list doesn't include members with s-member passes.`
          : `The following members are in the s-member list:\n${unverified.join(
              ', '
            )}\n\nNote this list doesn't include members with s-member passes.`
      );
    }
  }
);

commands.defaultRaw(async (message) => {
  await message.reply(
    `No such command found. Use \`=help\` for a list of commands.`
  );
});

discord.interactions.commands.register(
  {
    name: 'test',
    description: 'Test command',
  },
  async (interaction) => {
    await interaction.respond('Works fine lol');
  }
);
