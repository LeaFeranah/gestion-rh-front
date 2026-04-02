import { Home,Building2 , Users, UserPlus, Clock, DollarSign, TrendingUp, Calendar, FileText, Award, Settings } from 'lucide-react';

export const MENU_ITEMS = [
  { id: 'dashboard', icon: Home, label: 'Tableau de bord', color: 'gray' },
  // { id: 'company', icon: Building2 , label: 'Sociétés', color: 'gray' },
  { id: 'employees', icon: Users, label: 'Employés', color: 'gray' },
  { id: 'recruitment', icon: UserPlus, label: 'Recrutement', color: 'gray' },
  { id: 'attendance', icon: Clock, label: 'Présence', color: 'gray' },
  { id: 'payroll', icon: DollarSign, label: 'Paie', color: 'gray' },
  { id: 'performance', icon: TrendingUp, label: 'Performance', color: 'gray' },
  { id: 'leave', icon: Calendar, label: 'Congés', color: 'gray' },
  { id: 'documents', icon: FileText, label: 'Documents', color: 'gray' },
  { id: 'awards', icon: Award, label: 'Récompenses', color: 'gray' },
  { id: 'settings', icon: Settings, label: 'Paramètres', color: 'gray' },
];

