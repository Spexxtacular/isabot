module.exports = {
    name: 'info',
	description: 'Shows information about a server, user, or channel.',
	usage: '<item> <instance>',
    arguments: '``me``, ``user``, ``server``, ``channel``, none',
    execute(msg, args) {
        if (!args[0]) {
			const embedServer = new Discord.RichEmbed() .setTitle('``server``') .setColor('0xCF2BCF') .addField('``Description``', 'Shows information about the server.') .addField('Usage', '``>info server``') .addField('Arguments', 'None');
			const embedUser = new Discord.RichEmbed() .setTitle('``user``') .setColor('0xCF2BCF') .addField('``Description``', 'Shows information about a user. If no arguments are provided, information will be shown about yourself.') .addField('Usage', '``>info user <mention>``') .addField('Arguments', 'Any user mention, none');
			const embedMe = new Discord.RichEmbed() .setTitle('``me``') .setColor('0xCF2BCF') .addField('``Description``', 'Shows information about yourself.') .addField('Usage', '``>info me``') .addField('Arguments', 'None');
			const embedChannel = new Discord.RichEmbed() .setTitle('``channel``') .setColor('0xCF2BCF') .addField('``Description``', 'Shows information about a channel. If no arguments are provided, information will be shown about the current channel.') .addField('Usage', '``>info channel <channel>``') .addField('Arguments', 'Any channel mention, ``this``, none');
			try {
				msg.author.send('__Help for ``>info``__')
				.then(() => msg.author.send(embedServer))
				.then(() => msg.author.send(embedUser))
				.then(() => msg.author.send(embedMe))
				.then(() => msg.author.send(embedChannel))
				.then(() => msg.reply('I have DM\'d you help for the ``>info`` command!'));
			}
			catch (error) {
				sendLog('<@&513807019048828929> there was an error!\n\n```' + error + '```');
				msg.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
			}
		}
		else if (msg.channel.type === 'dm') {
			msg.channel.send('That command is not available in DMs.');
			return;
		}

		function userFromMention(mention) {
			const matches = mention.match(/^<@!?(\d+)>$/);
			if (matches) {
				const id = matches[1];
				return msg.guild.members.get(id).user;
			}
			else { return null; }
		}
		function roleFromMention(mention) {
			const matches = mention.match(/^<@&(\d+)>$/);
			if (matches) {
				const id = matches[1];
				return msg.guild.roles.get(id);
			}
			else { return null; }
		}
		function channelFromMention(mention) {
			const matches = mention.match(/^<#(\d+)>$/);
			if (matches) {
				const id = matches[1];
				return msg.guild.channels.get(id);
			}
			else { return null; }
		}
		function stringToEmoji(emoji) {
			const matches = emoji.match(/^<a?:(\w+):(\d+)>$/);
			if (matches) {
				const emoji = {
					name: matches[1],
					id: matches[2]
				}
				return emoji;
			}
			else { return null; }
		}
		function userToMember(usr) {
			return msg.guild.members.get(usr.id);
		}

		msg.guild.fetchMembers().then(() => {
			if (args[0] === 'server') {
				const g = msg.guild;
				const createTime = g.createdAt;
				let roleCount = g.roles.size;
				let channelCount = g.channels.size;
				let min; if (createTime.getMinutes().toString().length === 1) { min = '0' + createTime.getMinutes(); } else { min = createTime.getMinutes(); }
				let sec; if (createTime.getSeconds().toString().length === 1) { sec = '0' + createTime.getSeconds(); } else { sec = createTime.getSeconds(); }
				const embed = new Discord.RichEmbed() .setTitle(g.name) .setColor('0xCF2BCF') .setThumbnail(g.iconURL) .addField('Created At', createTime.toDateString() + ' at ' + createTime.getHours() + ':' + min + ':' + sec + ', EST') .addField('Owner', g.owner.user.tag) .addField('Members', g.memberCount) .addField('Channel Count', channelCount) .addField('Role Count', roleCount);
				msg.channel.send(embed);
				sendLog(msg.author.tag + ' got ' + msg.guild.name + '\'s info');
			}
			else if (args[0] === 'me' || (args[0] === 'user' && args[1] === 'me') || (args[0] === 'user' && !args[1])) {
				const u = msg.author;
				const m = userToMember(u)
				const createTime = u.createdAt;
				const joinTime = msg.member.joinedAt;
				let min; if (createTime.getMinutes().toString().length === 1) { min = '0' + createTime.getMinutes(); } else { min = createTime.getMinutes(); }
				let sec; if (createTime.getSeconds().toString().length === 1) { sec = '0' + createTime.getSeconds(); } else { sec = createTime.getSeconds(); }
				let minJ; if (joinTime.getMinutes().toString().length === 1) { minJ = '0' + joinTime.getMinutes(); } else { minJ = joinTime.getMinutes(); }
				let secJ; if (joinTime.getSeconds().toString().length === 1) { secJ = '0' + joinTime.getSeconds(); } else { secJ = joinTime.getSeconds(); }
				const embed = new Discord.RichEmbed() .setTitle(u.username) .setColor(userToMember(u).displayHexColor) .setThumbnail(u.avatarURL) .addField('Created At', createTime.toDateString() + ' at ' + createTime.getHours() + ':' + min + ':' + sec + ', EST') .addField('Guild Join Date', joinTime.toDateString() + ' at ' + joinTime.getHours() + ':' + minJ + ':' + secJ + ', EST') .addField('Roles', m.roles.map(r => r.name).join(', '));
				msg.channel.send(embed);
				sendLog(msg.author.tag + ' got their info in ' + msg.guild.name);
			}
			else if (args[0] === 'user') {
				if (!msg.mentions.users.array().includes(userFromMention(args[1]))) { return msg.reply('please mention a user!'); }
				const u = userFromMention(args[1]);
				const m = userToMember(u);
				const createTime = u.createdAt;
				const joinTime = msg.guild.members.get(u.id).joinedAt;
				let min; if (createTime.getMinutes().toString().length === 1) { min = '0' + createTime.getMinutes(); } else { min = createTime.getMinutes(); }
				let sec; if (createTime.getSeconds().toString().length === 1) { sec = '0' + createTime.getSeconds(); } else { sec = createTime.getSeconds(); }
				let minJ; if (joinTime.getMinutes().toString().length === 1) { minJ = '0' + joinTime.getMinutes(); } else { minJ = joinTime.getMinutes(); }
				let secJ; if (joinTime.getSeconds().toString().length === 1) { secJ = '0' + joinTime.getSeconds(); } else { secJ = joinTime.getSeconds(); }
				let embed = new Discord.RichEmbed();
				if (u.id === '513515391155175424') {
					embed .setTitle(u.username) .setColor(m.displayHexColor) .setThumbnail(u.avatarURL) .addField('Created At', createTime.toDateString() + ' at ' + createTime.getHours() + ':' + min + ':' + sec + ', EST') .addField('Guild Join Date', joinTime.toDateString() + ' at ' + joinTime.getHours() + ':' + minJ + ':' + secJ + ', EST') .addField('Roles', m.roles.map(r => r.name).join(', ')) .addField('Other Information', 'The best!');
				}
				else {
					embed .setTitle(u.username) .setColor(m.displayHexColor) .setThumbnail(u.avatarURL) .addField('Created At', createTime.toDateString() + ' at ' + createTime.getHours() + ':' + min + ':' + sec + ', EST') .addField('Guild Join Date', joinTime.toDateString() + ' at ' + joinTime.getHours() + ':' + minJ + ':' + secJ + ', EST') .addField('Roles', m.roles.map(r => r.name).join(', '));
				}
				msg.channel.send(embed);
				sendLog(msg.author.tag + ' got info for ' + u.tag + ' in ' + msg.guild.name);
			}
			else if ((args[0] === 'channel' && (!args[1])) || (args[0] === 'channel' && args[1] === 'this')) {
				const c = msg.channel;
				const createTime = c.createdAt;
				let cTopic;
				if (c.topic) { cTopic = c.topic; } else { cTopic = 'No channel topic'; }
				let min; if (createTime.getMinutes().toString().length === 1) { min = '0' + createTime.getMinutes(); } else { min = createTime.getMinutes(); }
				let sec; if (createTime.getSeconds().toString().length === 1) { sec = '0' + createTime.getSeconds(); } else { sec = createTime.getSeconds(); }
				const embed = new Discord.RichEmbed() .setTitle(c.name) .setColor('0xCF2BCF') .setThumbnail(msg.guild.iconURL) .addField('Created At', createTime.toDateString() + ' at ' + createTime.getHours() + ':' + min + ':' + sec + ', EST') .addField('Channel Topic', cTopic) .addField('Members', c.members.size);
				msg.channel.send(embed);
				sendLog(msg.author.tag + ' got info for ' + c.name + ' in ' + msg.guild.name);
			}
			else if (args[0] === 'channel') {
				if (!msg.mentions.channels.array().includes(channelFromMention(args[1]))) { return msg.reply('please mention a channel!'); }
				const c = channelFromMention(args[1]);
				const createTime = c.createdAt;
				let cTopic;
				if (c.topic) { cTopic = c.topic; } else { cTopic = 'No channel topic'; }
				let min; if (createTime.getMinutes().toString().length === 1) { min = '0' + createTime.getMinutes(); } else { min = createTime.getMinutes(); }
				let sec; if (createTime.getSeconds().toString().length === 1) { sec = '0' + createTime.getSeconds(); } else { sec = createTime.getSeconds(); }
				const embed = new Discord.RichEmbed() .setTitle(c.name) .setColor('0xCF2BCF') .setThumbnail(msg.guild.iconURL) .addField('Created At', createTime.toDateString() + ' at ' + createTime.getHours() + ':' + min + ':' + sec + ', EST') .addField('Channel Topic', cTopic) .addField('Members', c.members.size);
				msg.channel.send(embed);
				sendLog(msg.author.tag + ' got info for ' + c.name + ' in ' + msg.guild.name);
			}
			else if (args[0] === 'emoji' || args[0] === 'emote') {
				if (!/^<a?:(\w+):(\d+)>$/.test(args[1])) return msg.channel.send('Please provide a custom emoji!');
				let e = stringToEmoji(args[1]);
				const x = /^<a:(\w+):(\d+)>$/.test(args[1]) ? '.gif' : '.png';
				const link = `https://cdn.discordapp.com/emojis/${e.id}${x}`;
				let embed = new Discord.RichEmbed() .setTitle(`:${e.name}:`) .setColor('0xCF2BCF') .addField('ID', e.id);
				if (client.emojis.get(e.id)) {
					e = client.emojis.get(e.id);
					const createTime = e.createdAt;
						let min; if (createTime.getMinutes().toString().length === 1) { min = '0' + createTime.getMinutes(); } else { min = createTime.getMinutes(); }
						let sec; if (createTime.getSeconds().toString().length === 1) { sec = '0' + createTime.getSeconds(); } else { sec = createTime.getSeconds(); }
						embed.addField('Created At', createTime.toDateString() + ' at ' + createTime.getHours() + ':' + min + ':' + sec + ', EST') .addField('Guild', e.guild);
					/*try {
						let creator; e.fetchAuthor().then(u => creator = u.username).then(() => {
							embed.addField('Created By', creator)
						}).then(() => { return msg.channel.send(embed).then(() => sendLog(msg.author.tag + ' got info for ' + e.name + ' in ' + msg.guild.name)); });
					}
					catch(e) {
						if (e instanceof )
						sendLog(`\`\`\`${e}\`\`\``);
						return msg.channel.send(embed).then(() => sendLog(msg.author.tag + ' got info for ' + e.name + ' in ' + msg.guild.name));
					}*/
				}
				embed.addField('Link', link) .setImage(link);
				msg.channel.send(embed).then(() => sendLog(msg.author.tag + ' got info for :' + e.name + ': in ' + msg.guild.name));
			}
		});
    }
};