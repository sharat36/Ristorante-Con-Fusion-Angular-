import { Injectable } from '@angular/core';

import { LEADERS } from '../shared/leaders';
import { Leader } from '../shared/leader';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  getLeader(id: String) : Promise<Leader>{
      return Promise.resolve(LEADERS.filter((leader) => {leader.id === id})[0]);
  }

  getLeaders() : Promise<Leader[]>{
    return Promise.resolve(LEADERS);
  }

  getFeaturedLeader() : Promise<Leader>{
    return Promise.resolve(LEADERS.filter((leader) => leader.featured)[0]);
  }
}
