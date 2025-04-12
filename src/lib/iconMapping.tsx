import { ReactElement } from "react";
import { IconType } from "react-icons/lib";
import { IoIosArrowDown, IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { IoEyeOffOutline } from "react-icons/io5";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { HiOutlineX } from "react-icons/hi";

export type IconKey = 
  | "arrowDown"
  | "arrowForward"
  | "arrowBack"
  | "eyeOff"
  | "eyeOn"
  | "spinner"
  | "search"
  | "x"

type IconMapping = {
  [key in IconKey]: IconType;
}

export const iconMapping: IconMapping = {
  arrowDown: IoIosArrowDown,
  arrowForward: IoIosArrowForward,
  arrowBack: IoIosArrowBack,
  eyeOff: IoEyeOffOutline,
  eyeOn: MdOutlineRemoveRedEye,
  spinner: FaSpinner,
  search: HiOutlineMagnifyingGlass,
  x: HiOutlineX,
}

export const getListIcon = (icon: IconKey, className?: string): ReactElement | null => { 
  const Icon = iconMapping[icon];
  return Icon ? <Icon className={className} /> : null;
}
