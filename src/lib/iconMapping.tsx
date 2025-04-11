import { ReactElement } from "react";
import { IconType } from "react-icons/lib";
import { IoIosArrowDown } from "react-icons/io";

export type IconKey = 
  | "arrowDown"

type IconMapping = {
  [key in IconKey]: IconType;
}

export const iconMapping: IconMapping = {
  arrowDown: IoIosArrowDown,
}

export const getListIcon = (icon: IconKey, className?: string): ReactElement | null => { 
  const Icon = iconMapping[icon];
  return Icon ? <Icon className={className} /> : null;
}
