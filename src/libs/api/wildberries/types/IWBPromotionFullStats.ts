export interface IWBPromotionFullStats {
  views: number;
  clicks: number;
  ctr: number;
  cpc: number;
  sum: number;
  atbs: number;
  orders: number;
  cr: number;
  shks: number;
  sum_price: number;
  dates: string[];
  days: IWBDay[];
  boosterStats: IWBBoosterStat[];
  advertId: number;
}

export interface IWBDay {
  date: string;
  views: number;
  clicks: number;
  ctr: number;
  cpc: number;
  sum: number;
  atbs: number;
  orders: number;
  cr: number;
  shks: number;
  sum_price: number;
  apps: IWBAdvertAppFullStats[];
}

export interface IWBAdvertAppFullStats {
  views: number;
  clicks: number;
  ctr: number;
  cpc: number;
  sum: number;
  atbs: number;
  orders: number;
  cr: number;
  shks: number;
  sum_price: number;
  nm: IWbNmFullStats[];
  appType: number;
}

export interface IWbNmFullStats {
  views: number;
  clicks: number;
  ctr: number;
  cpc: number;
  sum: number;
  atbs: number;
  orders: number;
  cr: number;
  shks: number;
  sum_price: number;
  name: string;
  nmId: number;
}

export interface IWBBoosterStat {
  date: string;
  nm: number;
  avg_position: number;
}
