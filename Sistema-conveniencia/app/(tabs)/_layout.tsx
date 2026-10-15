import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        // Cores fixas da identidade visual do Brasileirinho
        tabBarActiveTintColor: "#FFE800", // Amarelo ativo
        tabBarInactiveTintColor: "#FFFFFF", // Branco inativo
        tabBarStyle: {
          backgroundColor: "#1B2A4A", // Fundo azul escuro da barra
          borderTopColor: "#1B2A4A",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="fiados"
        options={{
          title: "Fiados",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.2.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notinhas"
        options={{
          title: "Notinhas",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="clipboard.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="festas"
        options={{
          title: "Festas",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="festival.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="estoque"
        options={{
          title: "Estoque",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="product.quantity" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
