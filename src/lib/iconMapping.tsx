import { ReactElement } from "react";
import { IconType } from "react-icons/lib";
import { IoIosArrowDown } from "react-icons/io";
import { IoEyeOffOutline } from "react-icons/io5";
import { MdOutlineRemoveRedEye } from "react-icons/md";

export type IconKey = 
  | "arrowDown"
  | "eyeOff"
  | "eyeOn"

type IconMapping = {
  [key in IconKey]: IconType;
}

export const iconMapping: IconMapping = {
  arrowDown: IoIosArrowDown,
  eyeOff: IoEyeOffOutline,
  eyeOn: MdOutlineRemoveRedEye,
}

export const getListIcon = (icon: IconKey, className?: string): ReactElement | null => { 
  const Icon = iconMapping[icon];
  return Icon ? <Icon className={className} /> : null;
}
