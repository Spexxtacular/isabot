const conversions = require('../conversions.js');

const formatRoles = (member) => {
    roles = member.roles.cache.map(r => r.toString()); roles.pop();
    const rolesFiltered = roles.filter((r, i) => i > 41 ? false : true);
    const size = roles.length - rolesFiltered.length;
    return size > 0 ? rolesFiltered.join(', ') + ` + ${size} more` : roles.join(', ');
}

const getRank = (user) => {
    return new Promise(async (resolve) => {
        const m = await client.guilds.cache.get('513806689787445261').members.fetch(user.id);
        if (!m) return resolve('');
    
        const developer = '<:developer:621656187213185065>';
        const contributor = '<:contributor:621656187456192517>';
        const tester = '<:tester:621656187217248287>';
        let str = ' ';
    
        if (await m.roles.cache.has('513807019048828929')) str += developer;
        if (await m.roles.cache.has('518002389366865930')) str += contributor;
        if (await m.roles.cache.has('513813580441714688')) str += tester;
        return resolve(str);
    });
}

const formatStatus = (s) => {
    switch (s) {
        case 'online': return 'Online';
        case 'idle': return 'Idle';
        case 'dnd': return 'Do Not Disturb';
        case 'offline': return 'Offline';
    }
}

const formatActivity = (a) => {
    switch (a.type) {
        case 'PLAYING': return 'Playing ' + a.name;
        case 'STREAMING': return 'Streaming ' + a.name;
        case 'LISTENING': return 'Listening to ' + a.name;
        case 'WATCHING': return 'Watching ' + a.name;
        case 'CUSTOM_STATUS': return a.state;
        case 'COMPETING': return 'Competing in ' + a.name;
    }
}

const formatPresence = (p) => {
    if (p.activities.length === 0) return formatStatus(p.status);
    let id = p.activities[0].type === 'CUSTOM_STATUS' && p.activities[0].state === null ? 1 : 0;
    return formatActivity(p.activities[id]);
}

module.exports = {
    name: 'user',
    aliases: ['member', 'u'],
    usage: ['<user>'],
    description: 'Shows information about a user. If no arguments are provided, information will be shown about yourself.',
    category: 'info',
    execute: (msg, args) => {
        return new Promise(async (resolve, reject) => {
            const u = await conversions.parseUser(msg, args.join(' '));
            if (!u) return msg.channel.send('Please provide a valid argument!').then(resolve(msg.author.tag + ' didn\'t provide an argument for user')).catch(e => reject(e));
            const m = await conversions.userToMember(u, msg);

            const embed = new Discord.MessageEmbed()
                .setTitle(u.tag + await getRank(u) + ' (' + u.id + ')')
                .setColor(m.displayHexColor)
                .setThumbnail(m.user.avatarURL())
                .addField('Created At', u.createdAt.toUTCString())
                .addField('Guild Join Date', m.joinedAt.toUTCString())
                .addField('Nickname', m.nickname ? m.nickname : 'None', true)
                .addField('Status', formatPresence(m.presence))
                .addField(`Roles (${m.roles.cache.size - 1})`, formatRoles(m))
                .setFooter('Requested by ' + msg.author.tag, msg.author.avatarURL())
                .setTimestamp();
            if (u.id === client.user.id) embed.addField('Other Information', 'The best! <:isaThonk:537312545682489345>');
            return msg.channel.send(embed)
            .then(resolve(msg.author.tag + ' got info for ' + u.tag + ' in ' + msg.guild.name))
            .catch((e) => reject(e));
        });
    }
};
