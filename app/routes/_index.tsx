import type { Route } from "./+types/_index";
import { AppSidebar } from "~/components/sidebar";
import { listRepository } from "~/repository/list.repository";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "~/components/shadcn/sidebar";
import { redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const lists = await listRepository.findAll();
  return { lists };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const listName = formData.get("listName") as string;

  if (!listName || listName.trim() === "") {
    return { error: "リスト名を入力してください" };
  }

  const newList = await listRepository.create({
    name: listName.trim(),
  });

  return redirect(`/list/${newList.id}`);
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { lists } = loaderData;

  return (
    <SidebarProvider>
      <AppSidebar lists={lists} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold">Todo App</h1>
        </header>
        <div className="flex-1 p-8">
          {lists.length === 0 ? (
            <p className="text-gray-500">リストを作成してください</p>
          ) : (
            <p className="text-gray-500">
              左のサイドバーからリストを選択してください
            </p>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
