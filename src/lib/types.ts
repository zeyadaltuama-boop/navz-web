export type User = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type Driver = User & {
  vehicle: string;
  rating: number;
  eta?: number;
  status: 'online' | 'offline';
};

export type Ride = {
  id: string;
  passenger: User;
  driver?: Driver;
  pickupLocation: string;
  dropoffLocation: string;
  fare: number;
  status: 'requested' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
};
