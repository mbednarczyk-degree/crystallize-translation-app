import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Component, Item, Maybe, TreeNode } from "~/__generated__/types";
import { ItemType } from "~/__generated__/types";
import { TranslationView } from "~/components/translation-view";
import { buildServices } from "~/core/services.server";
import { toComponentInput } from "~/core/to-component-input";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { api } = await buildServices(request);
  const url = new URL(request.url);
  const itemId = url.searchParams.get("itemId");
  const fromLanguage = url.searchParams.get("fromLanguage");
  const toLanguage = url.searchParams.get("toLanguage");
  const variantId = url.searchParams.get("variantId");

  if (!itemId || !fromLanguage) {
    // TODO: Redirect to a new page where the user can insert the ID manually
    throw redirect("/missing-item");
  }

  const isVariant = !!variantId;
  const promises = [api.getAvailableLanguages()];

  if (!isVariant) {
    promises.push(api.getItemComponents(itemId, fromLanguage));

    const [availableLanguages, item] = await Promise.all(promises);
    const { type, name, components, tree } = (item as Maybe<Item>) ?? {};

    return json({
      itemId,
      fromLanguage,
      toLanguage,
      availableLanguages,
      variantSku: null,
      itemType: type as ItemType,
      properties: [{ type: "name", content: name ?? "" }],
      components,
      tree,
    });
  }

  // we need the SKU first
  promises.push(api.getVariants(itemId, fromLanguage));

  const [availableLanguages, item] = await Promise.all(promises);
  const variantSku = (item as Awaited<ReturnType<typeof api.getVariants>>)?.variants.find(
    (variant) => variant.id === variantId,
  )?.sku;

  if (!variantSku) {
    throw redirect("/missing-item");
  }

  const data = await api.getVariantComponents(itemId, fromLanguage, variantSku);

  return json({
    itemId,
    variantSku,
    fromLanguage,
    toLanguage,
    availableLanguages,
    itemType: ItemType.Product,
    components: data?.variant?.components,
    properties: [{ type: "name", content: data?.variant?.name ?? "" }],
    tree: data?.tree,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { api } = await buildServices(request);

  try {
    const body = await request.formData();
    const { type, itemId, itemType, language, translation, variantSku } = JSON.parse(
      (body.get("data") ?? "") as string,
    );

    if (type === "property") {
      variantSku
        ? await api.updateVariantName({
            id: itemId,
            sku: variantSku,
            language,
            input: { name: translation.content },
          })
        : await api.updateItemName({
            id: itemId,
            itemType,
            language,
            input: { name: translation.content },
          });

      return json({ itemId, language, type: "refetchItem" });
    }

    const input = toComponentInput(translation as Component);

    if (variantSku) {
      await api.updateVariantComponent({
        input,
        language,
        sku: variantSku,
        productId: itemId,
      });
      return json({
        itemId,
        language,
        type: "refetchItemVariantComponents",
      });
    } else {
      await api.updateItemComponent({ itemId, language, input });
      return json({ itemId, language, type: "refetchItemComponents" });
    }
  } catch (e) {
    console.log(e);
  }

  return null;
};

export default function Index() {
  const { itemId, itemType, components, fromLanguage, toLanguage, variantSku, availableLanguages, properties, tree } =
    useLoaderData<typeof loader>();

  if (!itemId) {
    return <div>Something went wrong getting your item.</div>;
  }
  return (
    <div className="bg-gray-50">
      <div className="min-h-[100vh] pb-24 max-w-[1200px] mx-auto px-8">
        <TranslationView
          itemId={itemId}
          itemType={itemType}
          variantSku={variantSku}
          fromLanguage={fromLanguage}
          toLanguage={toLanguage}
          components={components}
          availableLanguages={availableLanguages}
          properties={properties}
          tree={tree as TreeNode}
        />
      </div>
    </div>
  );
}
