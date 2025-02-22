import { Button, Checkbox, Icon, Label } from "@crystallize/design-system";
import { useLocation, useNavigate } from "@remix-run/react";
import { useState } from "react";
import type { Preferences } from "../use-cases/contracts/types";
import Dropdown from "./dropdown";

type TranslationToolbarProps = {
  availableLanguages: { code: string; name: string }[];
  fromLanguage: string;
  toLanguage: string | null;
  onTranslate: ({ shouldPushTranslationToDraft, shouldIncludeAllVariants, customPromptFromUser }: Preferences) => void;
  selectedFields: { [key: string]: boolean };
};

export function TranslationToolbar({
  fromLanguage,
  toLanguage,
  availableLanguages,
  onTranslate,
  selectedFields,
}: TranslationToolbarProps) {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const selected = availableLanguages.find((lang) => lang.code === toLanguage);
  const [preferences, setPreferences] = useState({
    shouldPushTranslationToDraft: true,
    shouldIncludeAllVariants: false,
    customPromptFromUser: "",
  });

  const isAnyPropertySelected = Object.values(selectedFields).some((isSelected) => isSelected);

  return (
    <div className="overflow-hidden border-solid rounded-md shadow-md bg-cyan-50 shadow-cyan-500">
      <div className="flex items-center justify-between pr-6 border-0 border-b border-green-200">
        <input
          value={preferences.customPromptFromUser}
          className="pl-6 py-4 pt-6 w-full bg-[transparent] placeholder:italic outline-none focus:bg-[#fff]"
          placeholder="Add your own twist, i.e speak like a pirate (optional)."
          onChange={(e) =>
            setPreferences((prev) => ({
              ...prev,
              customPromptFromUser: e.target.value,
            }))
          }
        />
        <div className="flex gap-8 pl-6">
          <Button
            intent="action"
            onClick={() => onTranslate(preferences)}
            prepend={<Icon.Language width={20} height={20} />}
            disabled={!toLanguage || !isAnyPropertySelected}
          >
            Translate
          </Button>
        </div>
      </div>
      <div className="flex flex-row flex-wrap px-6 py-2 gap-y-6">
        <div className="flex flex-row items-center gap-2 pr-4 ">
          <div>
            <Dropdown
              options={availableLanguages}
              buttonText="Select language"
              selectedOption={fromLanguage}
              onSelectOption={(code) => {
                const query = new URLSearchParams(search);
                query.set("fromLanguage", code);
                navigate(`${pathname}?${query.toString()}`);
              }}
            />
          </div>
          <span>to </span>
          <div className="flex items-center gap-4">
            <Dropdown
              options={availableLanguages}
              selectedOption={toLanguage ?? undefined}
              buttonText="Select language"
              onSelectOption={(code) => {
                const query = new URLSearchParams(search);
                query.set("toLanguage", code);
                navigate(`${pathname}?${query.toString()}`);
              }}
            />
          </div>
        </div>
        <div className="flex flex-row gap-8">
          <Label className="flex items-center gap-2 text-xs cursor-pointer whitespace-nowrap">
            <Checkbox
              checked={preferences.shouldPushTranslationToDraft}
              onCheckedChange={(value: boolean) =>
                setPreferences((prev) => ({
                  ...prev,
                  shouldPushTranslationToDraft: value,
                }))
              }
            />
            Add all translations to {selected ? `${selected.name}` : ""} draft
          </Label>
          <Label className="flex items-center gap-2 text-xs cursor-pointer whitespace-nowrap">
            <Checkbox
              checked={preferences.shouldIncludeAllVariants}
              onCheckedChange={(value: boolean) =>
                setPreferences((prev) => ({
                  ...prev,
                  shouldIncludeAllVariants: value,
                }))
              }
            />
            Include all variants
          </Label>
        </div>
      </div>
    </div>
  );
}
