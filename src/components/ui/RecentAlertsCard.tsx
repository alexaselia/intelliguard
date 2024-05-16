// src/components/ui/RecentAlertsCard.tsx
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const RecentAlertsCard: React.FC = () => {
  return (
    <Card className="bg-[#262B31] text-white h-48">
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
        <CardDescription>Alert summary</CardDescription>
      </CardHeader>
      <CardContent>
        <ul>
          <li>4 Janelas estão abertas</li>
          <li>1 Garagem está fechada</li>
          <li>1 Portão está fechada</li>
          <li>A porta dos fundos está aberta</li>
        </ul>
      </CardContent>
    </Card>
  );
}

export default RecentAlertsCard;
