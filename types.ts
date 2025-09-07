
export interface MqttMessage {
  topic: string;
  payload: string;
  timestamp: string;
}

export enum ConnectionStatus {
  Connected = 'Connected',
  Connecting = 'Connecting',
  Reconnecting = 'Reconnecting',
  Disconnected = 'Disconnected',
  Error = 'Error',
}
