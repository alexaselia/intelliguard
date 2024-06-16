// src/components/ui/SystemStatusCard.tsx
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const SystemStatusCard: React.FC = () => {
  return (
    <Card className="bg-[#262B31] text-white h-48">
      <CardHeader>
        <CardTitle>Eventos Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          <li>A janela da entrada foi aberta</li>
          <li>Alguém entrou na garagem</li>
          <li>Maria acessou o sistema</li>
        </ul>
      </CardContent>
    </Card>
  );
}

export default SystemStatusCard;
