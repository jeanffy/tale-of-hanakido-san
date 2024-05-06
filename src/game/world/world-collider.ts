import { GeomRect } from '../geom/geom-rect.js';
import { WorldItem } from './world-item.js';

export interface WorldCollider {
  itemCollides(hitBox: GeomRect): WorldItem | undefined;
}
