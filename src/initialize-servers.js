function initializeServers(client, sourceServerConfigs) {
    const sourceServers = [];
    const missingSourceServers = [];

    // Look up the guild data for each source server, and build a "source
    // server" object that includes the guild data, and our shortcode for it.
    for (const { shortcode, serverId } of sourceServerConfigs) {
        const guild = client.guilds.get(serverId);

        // If we can't find the guild data for this server, then we're probably
        // not invited, or maybe there's a network issue. Track this server in
        // a separate list, so we can surface a warning.
        if (!guild) {
            missingSourceServers.push({ shortcode, serverId });
            continue;
        }

        sourceServers.push({ shortcode, guild });
    }

    return { sourceServers, missingSourceServers };
}

module.exports = initializeServers;
