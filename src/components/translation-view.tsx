import type { Component, ItemType, TreeNode } from "~/__generated__/types";

import type { SerializeFrom } from "@remix-run/node";
import { TranslationForm } from "~/components/translation-form";
import { TranslationProgress } from "~/components/translation-progress";
import { TranslationProperties } from "~/components/translation-properties";
import { TranslationToolbar } from "~/components/translation-toolbar";
import { useTranslations } from "~/core/use-translations";
import type { Property } from "~/use-cases/contracts/types";
import { TranslationTable } from "./translation-table";

type TranslationViewProps = {
  itemId: string;
  itemType: ItemType;
  availableLanguages: { code: string; name: string }[];
  fromLanguage: string;
  toLanguage: string | null;
  variantSku?: string | null;
  properties: SerializeFrom<Property[] | null>;
  components?: SerializeFrom<Component[] | null>;
  tree?: TreeNode | null;
};

export function TranslationView({
  itemId,
  itemType,
  fromLanguage,
  toLanguage,
  components,
  properties,
  availableLanguages,
  variantSku,
  tree,
}: TranslationViewProps) {
  const {
    componentWithTranslation,
    propertiesWithTranslation,
    onTranslate,
    currentProcessingTranslationsCount,
    totalProcessingTranslationsCount,
    selectedFields,
    toggleFieldSelection,
  } = useTranslations({
    itemId,
    itemType,
    fromLanguage,
    toLanguage,
    components,
    variantSku,
    properties,
  });

  return (
    <div className="pt-4 bg-gray-50">
      <TranslationToolbar
        availableLanguages={availableLanguages}
        toLanguage={toLanguage}
        fromLanguage={fromLanguage}
        onTranslate={onTranslate}
        selectedFields={selectedFields}
      />
      <TranslationProgress
        currentProcessingTranslationsCount={currentProcessingTranslationsCount}
        totalProcessingTranslationsCount={totalProcessingTranslationsCount}
      />
      <TranslationProperties
        properties={propertiesWithTranslation}
        selectedFields={selectedFields}
        toggleFieldSelection={toggleFieldSelection}
      />
      <TranslationForm
        components={componentWithTranslation}
        selectedFields={selectedFields}
        toggleFieldSelection={toggleFieldSelection}
      />
      {itemType === "folder" && (
        <TranslationTable tree={tree} selectedFields={selectedFields} toggleFieldSelection={toggleFieldSelection} />
      )}
    </div>
  );
}
