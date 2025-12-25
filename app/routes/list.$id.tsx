import { useRef, useEffect, useState } from "react";
import type { Route } from "./+types/list.$id";
import { AppSidebar } from "~/components/sidebar";
import { listRepository } from "~/repository/list.repository";
import { itemRepository } from "~/repository/item.repository";
import { Card, CardContent } from "~/components/shadcn/card";
import { Input } from "~/components/shadcn/input";
import { Button } from "~/components/shadcn/button";
import { Form, redirect, useNavigation } from "react-router";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "~/components/shadcn/sidebar";

export async function loader({ params }: Route.LoaderArgs) {
  const list = await listRepository.findById(params.id);
  const allLists = await listRepository.findAll();
  if (!list) {
    throw new Response("List not found", { status: 404 });
  }
  return { list, allLists };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const listName = formData.get("listName") as string;
  const newListName = formData.get("newListName") as string;
  const itemTitle = formData.get("itemTitle") as string;
  const newItemTitle = formData.get("newItemTitle") as string;
  const itemId = formData.get("itemId") as string;
  const isDone = formData.get("isDone") === "true";
  const actionType = formData.get("actionType") as string;

  // リスト作成の場合
  if (listName && !actionType) {
    if (!listName.trim()) {
      return { error: "リスト名を入力してください" };
    }
    const newList = await listRepository.create({
      name: listName.trim(),
    });
    return redirect(`/list/${newList.id}`);
  }

  // リスト名更新の場合
  if (actionType === "updateList" && newListName) {
    if (!newListName.trim()) {
      return { error: "リスト名を入力してください" };
    }
    await listRepository.update(params.id, {
      name: newListName.trim(),
    });
    return redirect(`/list/${params.id}`);
  }

  // リスト削除の場合
  if (actionType === "deleteList") {
    await listRepository.delete(params.id);
    return redirect("/");
  }

  // アイテム作成の場合
  if (itemTitle && !actionType) {
    if (!itemTitle.trim()) {
      return { error: "アイテム名を入力してください" };
    }
    await itemRepository.create({
      listId: params.id,
      title: itemTitle.trim(),
    });
    return redirect(`/list/${params.id}`);
  }

  // アイテムタイトル更新の場合
  if (actionType === "updateItem" && itemId && newItemTitle) {
    if (!newItemTitle.trim()) {
      return { error: "アイテム名を入力してください" };
    }
    await itemRepository.update(itemId, {
      title: newItemTitle.trim(),
    });
    return redirect(`/list/${params.id}`);
  }

  // アイテム削除の場合
  if (actionType === "delete" && itemId) {
    await itemRepository.delete(itemId);
    return redirect(`/list/${params.id}`);
  }

  // アイテムのdone状態を切り替える場合
  if (itemId && isDone !== undefined && !actionType) {
    if (isDone) {
      await itemRepository.complete(itemId);
    } else {
      await itemRepository.uncomplete(itemId);
    }
    return redirect(`/list/${params.id}`);
  }

  return redirect(`/list/${params.id}`);
}

export default function ListDetail({ loaderData }: Route.ComponentProps) {
  const { list, allLists } = loaderData;
  const navigation = useNavigation();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditingListName, setIsEditingListName] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  useEffect(() => {
    if (navigation.state === "idle" && formRef.current) {
      formRef.current.reset();
      if (inputRef.current) {
        inputRef.current.focus();
      }
      setIsEditingListName(false);
      setEditingItemId(null);
    }
  }, [navigation.state]);

  return (
    <SidebarProvider>
      <AppSidebar lists={allLists} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          {isEditingListName ? (
            <Form
              method="post"
              className="flex-1 flex gap-2"
              onSubmit={() => setIsEditingListName(false)}
            >
              <input type="hidden" name="actionType" value="updateList" />
              <Input
                name="newListName"
                defaultValue={list.name}
                required
                className="flex-1"
                autoFocus
              />
              <Button type="submit" size="sm">
                保存
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsEditingListName(false)}
              >
                キャンセル
              </Button>
            </Form>
          ) : (
            <>
              <h1 className="text-xl font-semibold flex-1">{list.name}</h1>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsEditingListName(true)}
              >
                編集
              </Button>
              <Form method="post">
                <input type="hidden" name="actionType" value="deleteList" />
                <Button type="submit" size="sm" variant="destructive">
                  リストを削除
                </Button>
              </Form>
            </>
          )}
        </header>
        <div className="flex-1 p-8 overflow-y-auto">
          <Form ref={formRef} method="post" className="mb-6 flex gap-2">
            <Input
              ref={inputRef}
              name="itemTitle"
              placeholder="新しいアイテムを追加"
              required
              className="flex-1"
            />
            <Button type="submit">追加</Button>
          </Form>
          {list.items.length === 0 ? (
            <p className="text-gray-500">アイテムがありません</p>
          ) : (
            <div className="space-y-6">
              {/* Todo領域 */}
              {list.items.filter((item) => !item.isDone).length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Todo</h2>
                  <div className="space-y-1">
                    {list.items
                      .filter((item) => !item.isDone)
                      .map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-2">
                            {editingItemId === item.id ? (
                              <Form
                                method="post"
                                className="flex items-center gap-2"
                                onSubmit={() => setEditingItemId(null)}
                              >
                                <input
                                  type="hidden"
                                  name="actionType"
                                  value="updateItem"
                                />
                                <input
                                  type="hidden"
                                  name="itemId"
                                  value={item.id}
                                />
                                <Input
                                  name="newItemTitle"
                                  defaultValue={item.title}
                                  required
                                  className="flex-1"
                                  autoFocus
                                />
                                <Button type="submit" size="sm">
                                  保存
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingItemId(null)}
                                >
                                  キャンセル
                                </Button>
                              </Form>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="flex-1">{item.title}</span>
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingItemId(item.id)}
                                  >
                                    編集
                                  </Button>
                                  <Form method="post">
                                    <input
                                      type="hidden"
                                      name="itemId"
                                      value={item.id}
                                    />
                                    <input
                                      type="hidden"
                                      name="isDone"
                                      value="true"
                                    />
                                    <Button
                                      type="submit"
                                      size="sm"
                                      variant="outline"
                                    >
                                      完了
                                    </Button>
                                  </Form>
                                  <Form method="post">
                                    <input
                                      type="hidden"
                                      name="itemId"
                                      value={item.id}
                                    />
                                    <input
                                      type="hidden"
                                      name="actionType"
                                      value="delete"
                                    />
                                    <Button
                                      type="submit"
                                      size="sm"
                                      variant="destructive"
                                    >
                                      削除
                                    </Button>
                                  </Form>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )}

              {/* Done領域 */}
              {list.items.filter((item) => item.isDone).length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Done</h2>
                  <div className="space-y-1">
                    {list.items
                      .filter((item) => item.isDone)
                      .map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-2">
                            {editingItemId === item.id ? (
                              <Form
                                method="post"
                                className="flex items-center gap-2"
                                onSubmit={() => setEditingItemId(null)}
                              >
                                <input
                                  type="hidden"
                                  name="actionType"
                                  value="updateItem"
                                />
                                <input
                                  type="hidden"
                                  name="itemId"
                                  value={item.id}
                                />
                                <Input
                                  name="newItemTitle"
                                  defaultValue={item.title}
                                  required
                                  className="flex-1"
                                  autoFocus
                                />
                                <Button type="submit" size="sm">
                                  保存
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingItemId(null)}
                                >
                                  キャンセル
                                </Button>
                              </Form>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="flex-1 line-through text-gray-500">
                                  {item.title}
                                </span>
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingItemId(item.id)}
                                  >
                                    編集
                                  </Button>
                                  <Form method="post">
                                    <input
                                      type="hidden"
                                      name="itemId"
                                      value={item.id}
                                    />
                                    <input
                                      type="hidden"
                                      name="isDone"
                                      value="false"
                                    />
                                    <Button
                                      type="submit"
                                      size="sm"
                                      variant="outline"
                                    >
                                      復元
                                    </Button>
                                  </Form>
                                  <Form method="post">
                                    <input
                                      type="hidden"
                                      name="itemId"
                                      value={item.id}
                                    />
                                    <input
                                      type="hidden"
                                      name="actionType"
                                      value="delete"
                                    />
                                    <Button
                                      type="submit"
                                      size="sm"
                                      variant="destructive"
                                    >
                                      削除
                                    </Button>
                                  </Form>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
