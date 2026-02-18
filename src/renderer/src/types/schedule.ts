export type TrashDay = {
  name: string;
  icon: string;
};

export type TrashSchedule = Partial<Record<string, TrashDay>>;
