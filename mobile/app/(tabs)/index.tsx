import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  BookOpen,
  Calendar,
  Users,
  MessageCircle,
  BookUser,
  CalendarDays,
  Bell,
  MessageSquare,
  Plus,
} from "lucide-react-native";
import { useAuthStore } from "../../lib/stores/auth";
import { ServiceCard } from "../../components/ui/ServiceCard";
import { ForumCard } from "../../components/ui/ForumCard";
import { theme, styles as themeStyles } from "../../lib/theme";
import api from "../../lib/api";

const { width } = Dimensions.get("window");
const PADDING = 32; // 16 * 2
const CARD_GAP = 12;
const CARD_WIDTH = (width - PADDING - CARD_GAP) / 2;

interface Discussion {
  id: string;
  title: string;
  authorName: string;
  isAnonymous: boolean;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  slug: string;
  name: string;
}

const SERVICES = [
  { icon: User, title: "Ma situation", route: "/(tabs)/menu/ma-situation" as const },
  { icon: BookOpen, title: "Programme", route: "/(tabs)/menu/programme" as const },
  { icon: Calendar, title: "Demander un RDV", route: "/(tabs)/rdv" as const },
  { icon: Users, title: "Espace Papas", route: "/(tabs)/menu/espace-papas" as const },
  { icon: MessageCircle, title: "Messagerie", route: "/(tabs)/messagerie" as const },
  { icon: BookUser, title: "Annuaire", route: "/(tabs)/menu/annuaire" as const },
  { icon: CalendarDays, title: "Calendrier", route: "/(tabs)/calendrier" as const },
  { icon: Bell, title: "Notifications", route: "/(tabs)/notifications" as const },
];

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const prenom = user?.fullName?.split(" ")[0] ?? "Papa";

  const { data: categories } = useQuery({
    queryKey: ["forum-categories"],
    queryFn: async () => {
      const res = await api.get("/api/mobile/forum/categories");
      return res.data.categories as Category[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const firstSlug = categories?.[0]?.slug;
  const { data: discussionsData, isLoading: loadingDiscussions } = useQuery({
    queryKey: ["forum-recent-discussions", firstSlug],
    queryFn: async () => {
      const res = await api.get("/api/mobile/forum/discussions", {
        params: { categorySlug: firstSlug, limit: 5 },
      });
      return res.data as { discussions: Discussion[]; total: number };
    },
    enabled: !!firstSlug,
    staleTime: 2 * 60 * 1000,
  });

  const recentDiscussions = discussionsData?.discussions ?? [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Bonjour {prenom} 👋</Text>
        <Text style={styles.subtitle}>
          Bienvenue dans votre espace Papa pour la Vie.
        </Text>
      </View>

      {/* Grille services - 2 colonnes */}
      <View style={styles.gridContainer}>
        <View style={styles.grid}>
          {SERVICES.map((service) => (
            <View key={service.title} style={styles.gridItem}>
              <ServiceCard
                icon={service.icon}
                title={service.title}
                onPress={() => router.push(service.route)}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Forum des papas */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Forum des Papas</Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/forum/new")}
            style={styles.btnPrimarySmall}
          >
            <Plus size={18} color="#fff" />
            <Text style={styles.btnPrimarySmallText}>Poser une question</Text>
          </TouchableOpacity>
        </View>

        {loadingDiscussions ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        ) : recentDiscussions.length === 0 ? (
          <View style={[themeStyles.card, styles.emptyCard]}>
            <MessageSquare
              size={40}
              color={theme.colors.gray[400]}
              style={{ alignSelf: "center" }}
            />
            <Text style={styles.emptyText}>
              Aucune discussion récente. Posez la première question !
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/forum/new")}
              style={[styles.btnPrimary, { marginTop: 16 }]}
            >
              <Text style={styles.btnPrimaryText}>Poser une question</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.forumList}>
            {recentDiscussions.map((d) => (
              <View key={d.id} style={{ marginBottom: 8 }}>
                <ForumCard
                key={d.id}
                title={d.title}
                author={d.isAnonymous ? "Anonyme" : d.authorName}
                replyCount={d.messageCount}
                date={d.updatedAt}
                onPress={() =>
                  router.push(`/(tabs)/forum/discussion/${d.id}`)
                }
              />
              </View>
            ))}
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/forum")}
              style={styles.btnSecondary}
            >
              <Text style={styles.btnSecondaryText}>Voir tout le forum</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.gray[900],
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.gray[500],
    marginTop: 4,
  },
  gridContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: CARD_GAP,
  },
  gridItem: {
    width: CARD_WIDTH,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    flexWrap: "wrap",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.gray[900],
  },
  btnPrimarySmall: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.borderRadius,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  btnPrimarySmallText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 4,
  },
  btnPrimary: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.borderRadius,
    paddingVertical: 12,
    alignItems: "center",
  },
  btnPrimaryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  btnSecondary: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.spacing.borderRadius,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    marginTop: 8,
  },
  btnSecondaryText: {
    color: theme.colors.gray[700],
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center",
  },
  loadingBox: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyText: {
    color: theme.colors.gray[500],
    textAlign: "center",
    marginTop: 12,
    fontSize: 16,
  },
  emptyCard: {
    padding: 24,
  },
  forumList: {
    marginTop: 4,
  },
});
