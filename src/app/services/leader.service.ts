import { Injectable } from '@angular/core';

import { LEADERS } from '../shared/leaders';
import { Leader } from '../shared/leader';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  getLeader(id: String) : Leader{
      return LEADERS.filter((leader) => {leader.id === id})[0];
  }

  getLeaders() : Leader[]{
    return LEADERS;
  }

  getFeaturedLeader() : Leader{
    return LEADERS.filter((leader) => leader.featured)[0];
  }
}
