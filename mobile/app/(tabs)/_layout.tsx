import { Tabs } from "expo-router";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import {
  Home,
  MessageCircle,
  Calendar,
  AlignJustify,
  Plus,
} from "lucide-react-native";
import { useUnreadCount } from "../../lib/hooks/useConversations";
import { useUnreadNotificationCount } from "../../lib/hooks/useNotifications";

const PRIMARY = "#2F5BFF";
const INACTIVE = "#9ca3af";

const badgeStyle = {
  position: "absolute" as const,
  top: -2,
  right: -4,
  backgroundColor: "#ef4444",
  borderRadius: 999,
  minWidth: 18,
  height: 18,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  paddingHorizontal: 4,
};

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <View style={badgeStyle}>
      <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
        {count > 99 ? "99+" : count}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const { data: unreadMessages } = useUnreadCount();
  const { data: unreadNotifications } = useUnreadNotificationCount();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          borderTopColor: "#e5e7eb",
          height: Platform.OS === "ios" ? 88 : 64,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          paddingTop: 8,
          backgroundColor: "#fff",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        headerStyle: {
          backgroundColor: PRIMARY,
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          headerTitle: "Papa pour la Vie",
          tabBarLabel: "Accueil",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messagerie"
        options={{
          title: "Messages",
          headerShown: false,
          tabBarLabel: "Messages",
          tabBarIcon: ({ color, size }) => (
            <View>
              <MessageCircle size={size} color={color} />
              <Badge count={unreadMessages ?? 0} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="rdv"
        options={{
          title: "RDV",
          headerShown: false,
          tabBarLabel: " ",
          tabBarIcon: () => null,
          tabBarButton: (props) => (
            <TouchableOpacity
              onPress={props.onPress}
              activeOpacity={0.85}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginTop: -24,
              }}
              accessibilityRole="button"
              accessibilityLabel="Prendre rendez-vous"
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: PRIMARY,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Plus size={28} color="#fff" strokeWidth={2.5} />
              </View>
              <Text style={{ fontSize: 10, fontWeight: "600", color: INACTIVE, marginTop: 2 }}>
                RDV
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="calendrier"
        options={{
          title: "Calendrier",
          headerShown: false,
          tabBarLabel: "Calendrier",
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          headerShown: false,
          tabBarLabel: "Menu",
          tabBarIcon: ({ color, size }) => <AlignJustify size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="forum"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="notifications"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="parametres"
        options={{ href: null }}
      />
    </Tabs>
  );
}
