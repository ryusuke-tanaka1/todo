import { prisma } from "./prisma";

export const itemRepository = {
  // Create: アイテムを作成
  create: async (data: {
    listId: string;
    title: string;
    note?: string | null;
    dueDate?: Date | null;
    sortOrder?: number;
  }) => {
    return await prisma.item.create({
      data,
    });
  },

  // Read: リスト内のすべてのアイテムを取得
  findByListId: async (listId: string) => {
    return await prisma.item.findMany({
      where: { listId },
      orderBy: [{ isDone: "asc" }, { sortOrder: "asc" }],
    });
  },

  // Read: IDでアイテムを取得
  findById: async (id: string) => {
    return await prisma.item.findUnique({
      where: { id },
    });
  },

  // Update: アイテムを更新
  update: async (
    id: string,
    data: {
      title?: string;
      note?: string | null;
      dueDate?: Date | null;
      isDone?: boolean;
      sortOrder?: number;
    }
  ) => {
    return await prisma.item.update({
      where: { id },
      data,
    });
  },

  // Update: アイテムを完了にする
  complete: async (id: string) => {
    return await prisma.item.update({
      where: { id },
      data: {
        isDone: true,
        completedAt: new Date(),
      },
    });
  },

  // Update: アイテムを未完了にする
  uncomplete: async (id: string) => {
    return await prisma.item.update({
      where: { id },
      data: {
        isDone: false,
        completedAt: null,
      },
    });
  },

  // Delete: アイテムを削除
  delete: async (id: string) => {
    return await prisma.item.delete({
      where: { id },
    });
  },
};
