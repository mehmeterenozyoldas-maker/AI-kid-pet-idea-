export enum SidekickAction {
  IDLE = 'IDLE',
  NOD = 'NOD',
  SHAKE = 'SHAKE',
  EMPHASIS = 'EMPHASIS',
  THINKING = 'THINKING',
  LISTENING = 'LISTENING',
  // Cognitive States
  CONFUSED = 'CONFUSED',
  IDEA = 'IDEA',
  WAITING = 'WAITING',
  // Emotions
  HAPPY = 'HAPPY',
  SAD = 'SAD',
  SURPRISED = 'SURPRISED',
  LOVE = 'LOVE',
  // New States
  SLEEPY = 'SLEEPY',
  ANGRY = 'ANGRY',
  SILLY = 'SILLY'
}

export interface SidekickConfig {
  color: string;
  isAudioReactive: boolean;
  scale: number;
}

export interface AnimationState {
  action: SidekickAction;
  isActive: boolean;
}