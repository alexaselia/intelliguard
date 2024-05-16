import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const MonitoringCard: React.FC = () => {
  return (
    <Card className="bg-[#262B31] text-white p-0 cursor-pointer h-80">
      <CardHeader className="p-4">
        <CardTitle>Monitoring</CardTitle>
        <CardDescription>2 of 2 points activated</CardDescription>
      </CardHeader>
      <CardContent className="relative p-0 h-full">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="text-2xl">🛡️</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MonitoringCard;
