import { AreaResponse } from '../model/area.model';

export const mapAreaToOptions = (areas: AreaResponse[]) => {
  return areas.map(a => ({
    label: a.name,
    value: a.id,
  }));
};