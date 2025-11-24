export declare function mqttStart({ username, password, customTopics, devUrl }: {
    username?: string;
    password?: string;
    customTopics?: string[];
    devUrl?: string;
}): void;
export declare function mqttStop(): void;
