import { CopyButton } from "~/components/copy-button";
import type { PropertyWithTranslation } from "~/use-cases/contracts/types";

type TranslationPropertiesProps = {
  properties: PropertyWithTranslation[] | null;
};

export function TranslationProperties({ properties }: TranslationPropertiesProps) {
  return (
    <div className="my-4">
      {properties?.map((property) => {
        const hasTranslation = property.translationState === "translated";
        const isTranslating = property.translationState === "translating";

        return (
          <div key={property.type} className="group">
            <div className="flex items-end justify-between gap-2 pt-2 pl-2">
              <div className="flex items-center gap-2 pb-2 text-sm font-medium capitalize h-7">
                {hasTranslation && (
                  <div className="bg-s-green-600 rounded-full justify-center w-4 h-4 text-[10px] font-medium flex items-center text-[#fff]">
                    ✓
                  </div>
                )}
                <span className="text-xs font-medium">{property.type}</span>
                {isTranslating && (
                  <div className="border-gray-200 h-4 w-4 animate-spin-slow rounded-full border-[3px] border-t-s-green-600" />
                )}
              </div>
            </div>

            <div className="relative shadow bg-[#fff] overflow-hidden rounded-md ">
              <input
                key={property.type}
                className={`${
                  !hasTranslation ? "text-base font-normal text-gray-400 italic" : "text-base font-normal"
                } px-6 py-4 !bg-[#fff] w-full`}
                value={property.content}
                disabled={property.translationState !== "translated"}
              />
              {hasTranslation && (
                <div className="group-hover:block hidden absolute top-2 p-0.5 rounded-md bg-purple-50 right-2">
                  <div className="flex flex-row justify-end w-full gap-2">
                    <CopyButton text={property.content} />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
