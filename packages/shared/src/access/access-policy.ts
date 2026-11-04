export type LockableKind = 'city' | 'topic' | 'game';

export interface LockableItem {
  readonly kind: LockableKind;
  readonly id: string;
}

export interface AccessPolicy {
  canOpen(item: LockableItem): boolean;
}