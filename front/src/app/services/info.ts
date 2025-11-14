import { Injectable } from '@angular/core';


export interface Shops {
  id: string;
  name: string;
  text: string;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class Info {
  
}
