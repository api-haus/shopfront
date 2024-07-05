export interface IPromotionAdvertsInfo {
  endTime: string;
  createTime: string;
  changeTime: string;
  startTime: string;
  name: string;
  params: IPromotionAdvertParam[];
  dailyBudget: number;
  advertId: number;
  status: number;
  type: number;
  paymentType: string;
  searchPluseState: boolean;
}

export interface IPromotionAdvertParam {
  intervals: IPromotionIntervals[];
  price: number;
  subjectId: number;
  subjectName: string;
  nms: IPromotionNMs[];
  active: boolean;
}

export interface IPromotionIntervals {
  begin: number;
  end: number;
}

export interface IPromotionNMs {
  nm: number;
  active: boolean;
}
