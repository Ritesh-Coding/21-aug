import { IconType } from 'react-icons';
export interface NotificationType {
    id: number;
    employee_id: {
      first_name: string;
    };
    message: string;
    status: string;
    total_notification: number
  }

export interface SubNavItemType {
    title: string;
    path: string;
    icon: IconType;
  }
export interface SidebarItemType {
    title: string;
    path: string;
    icon: IconType;
    iconClosed?: IconType;
    iconOpened?: IconType;
    subNav?: SubNavItemType[];
  }

export interface SubMenuPropsType {
    item: SidebarItemType;
  }