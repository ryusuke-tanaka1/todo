import { prisma } from "./prisma";

export const listRepository = {
  // Create: リストを作成
  create: async (data: { name: string; sortOrder?: number }) => {
    return await prisma.list.create({
      data,
    });
  },

  // Read: すべてのリストを取得（アーカイブされていないもの）
  findAll: async () => {
    return await prisma.list.findMany({
      where: {
        archivedAt: null,
      },
      orderBy: {
        sortOrder: "asc",
      },
      include: {
        items: {
          orderBy: [{ isDone: "asc" }, { sortOrder: "asc" }],
        },
      },
    });
  },

  // Read: IDでリストを取得
  findById: async (id: string) => {
    return await prisma.list.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: [{ isDone: "asc" }, { sortOrder: "asc" }],
        },
      },
    });
  },

  // Update: リストを更新
  update: async (id: string, data: { name?: string; sortOrder?: number }) => {
    return await prisma.list.update({
      where: { id },
      data,
    });
  },

  // Update: リストをアーカイブ
  archive: async (id: string) => {
    return await prisma.list.update({
      where: { id },
      data: {
        archivedAt: new Date(),
      },
    });
  },

  // Delete: リストを削除
  delete: async (id: string) => {
    return await prisma.list.delete({
      where: { id },
    });
  },
};
