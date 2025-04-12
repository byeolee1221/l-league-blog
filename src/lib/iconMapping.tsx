import { ReactElement } from "react";
import { IconType } from "react-icons/lib";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { IoEyeOffOutline } from "react-icons/io5";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";

export type IconKey = 
  | "arrowDown"
  | "arrowForward"
  | "eyeOff"
  | "eyeOn"
  | "spinner"

type IconMapping = {
  [key in IconKey]: IconType;
}

export const iconMapping: IconMapping = {
  arrowDown: IoIosArrowDown,
  arrowForward: IoIosArrowForward,
  eyeOff: IoEyeOffOutline,
  eyeOn: MdOutlineRemoveRedEye,
  spinner: FaSpinner,
}

export const getListIcon = (icon: IconKey, className?: string): ReactElement | null => { 
  const Icon = iconMapping[icon];
  return Icon ? <Icon className={className} /> : null;
}
