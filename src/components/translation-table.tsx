import React from "react";
import type { ItemType, TreeNode } from "~/__generated__/types";

type TranslationTableProps = {
  tree?: TreeNode | null;
};

const renderTable = (items: TreeNode[], itemType: ItemType) => {
  if (items.length === 0) return null;

  const columns = [
    "Name",
    ...Array.from(
      new Set(
        items.flatMap((item) =>
          item?.item?.components
            ?.filter((component) => ["paragraphCollection", "singleLine", "richText"].includes(component.type))
            ?.map((component) => component.name),
        ),
      ),
    ),
  ];

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold">{itemType} Items</h3>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-2 border">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.itemId}>
              <td className="px-4 py-2 border">{item?.item?.name}</td>
              {columns.slice(1).map((column) => {
                const component = item?.item?.components?.find((comp) => comp.name === column);
                const content = component ? component.content : null;
                return (
                  <td key={column} className="px-4 py-2 border">
                    {typeof content === "object" && content !== null ? JSON.stringify(content) : content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const TranslationTable: React.FC<TranslationTableProps> = ({ tree }: TranslationTableProps) => {
  if (!tree?.children || tree?.children?.length === 0) {
    return <div>No data available.</div>;
  }

  // Map to store items by their type
  const itemsMap: { [key in ItemType]?: TreeNode[] } = {};

  // Populate the itemsMap with tree
  tree?.children?.forEach((child) => {
    const itemType = child?.item?.type;
    if (itemType && !itemsMap[itemType]) {
      itemsMap[itemType] = [];
    }
    if (itemType) itemsMap[itemType]!.push(child);
  });

  return (
    <div>
      {Object.keys(itemsMap).map((itemType) => renderTable(itemsMap[itemType as ItemType]!, itemType as ItemType))}
    </div>
  );
};
