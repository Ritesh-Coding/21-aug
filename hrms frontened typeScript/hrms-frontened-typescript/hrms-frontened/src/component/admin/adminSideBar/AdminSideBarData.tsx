import { IconType } from 'react-icons';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as RiIcons from 'react-icons/ri';
import { MdOutlinePolicy } from 'react-icons/md';
import { SidebarItemType } from '../../../types/sideBar/sideBar';


export const AdminSidebarData: SidebarItemType[] = [
  {
    title: 'Employee',
    path: '/dashboard',
    icon: AiIcons.AiFillHome,
    iconClosed: RiIcons.RiArrowDownSFill,
    iconOpened: RiIcons.RiArrowUpSFill,    
  },  
  {
    title: 'Attendance',
    path: '/dashboard/attendance',
    icon: FaIcons.FaRegClock,
  },
  {
    title: 'Leaves',
    path: '/dashboard/leaves',
    icon: FaIcons.FaNotesMedical,
  },
  {
    title: 'Holidays',
    path: '/dashboard/holidays',
    icon: FaIcons.FaCalculator,
  },
 
  {
    title: 'Committee',
    path: '/dashboard/committee',
    icon: FaIcons.FaNotesMedical,
  },
  {
    title: 'Sensation',
    path: '/dashboard/sensation',
    icon: FaIcons.FaNotesMedical,
  },
  {
    title: 'Employee Comments',
    path: '/dashboard/comments',
    icon: FaIcons.FaNotesMedical,
  }
];