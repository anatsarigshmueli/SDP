
const environment = {
    QUEUE : {
        PRIMARY_CONNECTION_STRING: process.env.Q_PRIMARY_CONNECTION_STRING || "Endpoint=sb://sdp-service-bus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=FT8Bm9KILHzpawSqFSC9m8eQ2UhY5fA6uP5oC8zwmkA=",
        SECONDARY_CONNECTION_STRING: process.env.Q_SECONDARY_CONNECTION_STRING || "Endpoint=sb://sdp-service-bus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=auRksUsw1ia0BVfphInRgaaXXNn9puxMgfaXaMexy9k=",
        PRIMARY_KEY: process.env.Q_PRIMARY_KEY || "FT8Bm9KILHzpawSqFSC9m8eQ2UhY5fA6uP5oC8zwmkA=",
        SECONDARY_KEY: process.env.Q_SECONDARY_KEY || "auRksUsw1ia0BVfphInRgaaXXNn9puxMgfaXaMexy9k=",
    },
    
    TOPIC : {
        PRIMARY_LISTEN_CONNECTION_STRING:  process.env.T_L_PRIMARY_CONNECTION_STRING || "Endpoint=sb://sdp-service-bus.servicebus.windows.net/;SharedAccessKeyName=anatlisten;SharedAccessKey=3A1zG1ie0/h0Mn7Kik2TasQXhwe/p5QCXwyjE7AeFgI=",
        SECONDARY_LISTEN_CONNECTION_STRING: process.env.T_L_SECONDARY_CONNECTION_STRING || "Endpoint=sb://sdp-service-bus.servicebus.windows.net/;SharedAccessKeyName=anatlisten;SharedAccessKey=lRO7anozX9K09DAqVUNhxoyph9Rver6twv2+f5Lm094=",
        PRIMARY_LISTEN_KEY: process.env.T_L_PRIMARY_KEY || "3A1zG1ie0/h0Mn7Kik2TasQXhwe/p5QCXwyjE7AeFgI=",
        SECONDARY_LISTEN_KEY: process.env.T_L_SECONDARY_KEY || "lRO7anozX9K09DAqVUNhxoyph9Rver6twv2+f5Lm094=",

        PRIMARY_SEND_CONNECTION_STRING:  process.env.T_S_PRIMARY_CONNECTION_STRING || "Endpoint=sb://sdp-service-bus.servicebus.windows.net/;SharedAccessKeyName=anatsend;SharedAccessKey=R/810seKBC9O7DdnM5jbsFIT3LHGMcrOXSaVBpn5MvA=",
        SECONDARY_SEND_CONNECTION_STRING: process.env.T_S_SECONDARY_CONNECTION_STRING || "Endpoint=sb://sdp-service-bus.servicebus.windows.net/;SharedAccessKeyName=anatsend;SharedAccessKey=eiOEEw846HF3DvnxiNLOpx2MTajhJpM8XADhJjbMBnY=",
        PRIMARY_SEND_KEY: process.env.T_S_PRIMARY_KEY || "R/810seKBC9O7DdnM5jbsFIT3LHGMcrOXSaVBpn5MvA=",
        SECONDARY_SEND_KEY: process.env.T_S_SECONDARY_KEY || "eiOEEw846HF3DvnxiNLOpx2MTajhJpM8XADhJjbMBnY=",

        SUBBSCRIPTION: process.env.T_SUBBSCRIPTION || "anatsubscription"
    },

    // global Azure parameters
    SUBSCRIPTION_NAME: process.env.SUBSCRIPTION_NAME || "ACC-NPROD-18722-uDas",
    QUEUE_NAME: process.env.QUEUE_NAME || "anatqueue",
    TOPIC_NAME: process.env.TOPIC_NAME || "anatopic",

    // global control parameters
    CONTROL_OPTIONS: {
        USE_QUEUE: process.env.USE_QUEUE || true,
        MESSAGES_COUNT: process.env.MESSAGES_COUNT || 1,
        INTERVAL: process.env.INTERVAL || 0,      
        BATCH_COUNT: process.env.BATCH_COUNT || 0,    
        SEND_ASYNC: process.env.SEND_ASYNC || false, 
        SESSION_ID: process.env.SESSION_ID || '',
    }
};

export default environment;
