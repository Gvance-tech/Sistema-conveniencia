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
          height: 80,
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
        name="financas"
        options={{
          title: "Finanças",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="moneybill" color={color} />
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
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.circle.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sub_pages/novo-fiado"
        options={{
          title: "Novo Fiado",
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="sub_pages/detalhes-fiado"
        options={{
          title: "Detalhes do Fiado",
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="sub_pages/nova-notinha"
        options={{
          title: "Nova Notinha",
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="sub_pages/detalhes-notinha"
        options={{
          title: "Detalhes da Notinha",
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="sub_pages/nova-despesa"
        options={{
          title: "Nova Despesa",
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="sub_pages/nova-receita"
        options={{
          title: "Nova Receita",
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="sub_pages/nova-festa"
        options={{
          title: "Nova Festa",
          href: null,
          tabBarStyle: { display: "none" },
        }}
        />
      <Tabs.Screen
        name="sub_pages/detalhes-festa"
        options={{
          title: "Detalhes da Festa",
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="sub_pages/editar-fiado"
        options={{
          title: "Editar Fiado",
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
