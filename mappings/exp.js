module.exports = {
    id: { type: 'keyword' },
    name: { type: 'text' },
    uuid: { type: 'text' },
    policy_id: { type: 'text' },
    sequence: { type: 'long' },
    action: { type: 'text' },
    status: { type: 'text' },
    comment: { type: 'text' },
    source_address: { type: 'text' },
    destination_addresses: { type: 'text' },
    source_interface: { type: 'text' },
    destination_interface: { type: 'text' },
    service: { type: 'text' },
    schedule: { type: 'text' },

    nat: { type: 'text' },
    nat_ip: { type: 'text' },
    nat_inbound: { type: 'text' },
    nat_outbound: { type: 'text' },
    ip_pool: { type: 'text' },
    pool_name: {
        type: 'nested',
        properties: {
            name: { type: 'text' },
            q_origin_key: { type: 'text' }
        }
    },

    bytes: { type: 'long' },
    packets: { type: 'long' },
    last_used: { type: 'long' },
    first_used: { type: 'long' },
    hit_count: { type: 'long' },

    create_source: { type: 'text' },
    last_modify_time: {
        type: 'date',
        format: 'yyyy-MM-dd HH:mm:ss||epoch_millis',
    },
    last_modifier: { type: 'text' },

    ha: {
        type: 'object',
        properties: {
            ha_name: { type: 'text' },
            ha_id: { type: 'long' },
            ha_role: { type: 'text' }
        }
    },

    access_layer: { type: 'text' },
    firewall: { type: 'text' },
    firewall_id: { type: 'long' },
    firewall_ip: { type: 'text' },
    vendor: { type: 'text' },
    vdom: { type: 'text' },
    master: { type: 'boolean'},
    date: {
        type: 'date',
        format: 'yyyy-MM-dd',
    },
    timestamp: {
        type: 'date',
        format: 'yyyy-MM-dd HH:mm:ss||epoch_millis',
    },
};
