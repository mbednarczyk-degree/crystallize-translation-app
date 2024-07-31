import React from "react";
import type { ItemType, TreeNode } from "~/__generated__/types";
import { ParagraphCollection, RichText, SingleLine } from "./shape-components";

type TranslationTableProps = {
  tree?: TreeNode | null;
  selectedFields: { [key: string]: boolean };
  toggleFieldSelection: (key: string) => void;
};

const renderTable = (items: TreeNode[], itemType: ItemType, key: string) => {
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
    <div className="mb-8" key={key}>
      <h3 className="text-lg font-bold">{itemType} Items</h3>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={`header_${column}_${index}`} className="px-4 py-2 border">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, itemIndex) => (
            <tr key={`row_${itemIndex}_${item?.item?.name}`}>
              <td className="px-4 py-2 border">{item?.item?.name}</td>
              {columns.slice(1).map((column, cellIndex) => {
                const component = item?.item?.components?.find((comp) => comp.name === column);
                // const content = component ? component.content : null;
                // console.log({ content, component });

                return (
                  <td key={`cell_${column}_${itemIndex}_${cellIndex}`} className="px-4 py-2 border">
                    {/* {typeof content === "object" && content !== null ? JSON.stringify(content) : content} */}
                    {component?.type === "singleLine" && <SingleLine data={component} />}
                    {component?.type === "richText" && <RichText data={component} />}
                    {component?.type === "paragraphCollection" && <ParagraphCollection data={component} />}
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

  const itemsMap: { [key in ItemType]?: TreeNode[] } = {};

  tree?.children?.forEach((child) => {
    const itemType = child?.item?.type;
    if (itemType && !itemsMap[itemType]) {
      itemsMap[itemType] = [];
    }
    if (itemType) itemsMap[itemType]!.push(child);
  });

  return (
    <div>
      {Object.keys(itemsMap).map((itemType, key) =>
        renderTable(itemsMap[itemType as ItemType]!, itemType as ItemType, `table_${key}`),
      )}
    </div>
  );
};
