"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PartnerCard } from "@/components/partner-card";
import { Search, Filter } from "lucide-react";

const partners: {
  name: string;
  type: string;
  description: string;
  city: string;
  email: string;
  phone?: string;
  website?: string;
}[] = [];

const filterTypes = [
  { value: "all", label: "Tous" },
  { value: "avocat", label: "Avocats" },
  { value: "mediateur", label: "Médiateurs" },
  { value: "coach", label: "Coachs" },
  { value: "psychologue", label: "Psychologues" },
];

export default function AnnuairePage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPartners = partners.filter((partner) => {
    const matchesType =
      activeFilter === "all" || partner.type === activeFilter;
    const matchesSearch =
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-6xl">
      {/* En-tête */}
      <div className="space-y-4 animate-fade-in-up">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Annuaire des partenaires
        </h1>
        <p className="text-muted-foreground">
          Retrouvez nos avocats, médiateurs, coachs et psychologues
          partenaires pour vous accompagner dans votre parcours.
        </p>
      </div>

        {/* Recherche et filtres */}
        <div className="space-y-5 animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par nom, ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {filterTypes.map((filter) => (
              <Button
                key={filter.value}
                variant={activeFilter === filter.value ? "default" : "outline"}
                size="sm"
                className="rounded-lg"
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

      {/* Grille de partenaires */}
      {filteredPartners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPartners.map((partner, i) => (
            <div
              key={partner.name}
              className="animate-fade-in-up"
              style={{ animationDelay: `${0.15 + i * 0.05}s`, animationFillMode: "both" }}
            >
              <PartnerCard {...partner} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery || activeFilter !== "all"
              ? "Aucun partenaire trouvé pour cette recherche."
              : "L'annuaire des partenaires est en cours de constitution."}
          </p>
        </div>
      )}
    </div>
  );
}
