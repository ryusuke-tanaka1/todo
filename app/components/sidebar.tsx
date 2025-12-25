import { Link, Form } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "~/components/shadcn/sidebar";
import { Input } from "~/components/shadcn/input";
import { Button } from "~/components/shadcn/button";

export function AppSidebar({
  lists,
}: {
  lists: Array<{ id: string; name: string }>;
}) {
  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-lg font-semibold px-2">Todo Lists</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {lists.length === 0 ? (
            <SidebarMenuItem>
              <p className="text-sm text-gray-500 p-2">リストがありません</p>
            </SidebarMenuItem>
          ) : (
            lists.map((list) => (
              <SidebarMenuItem key={list.id}>
                <SidebarMenuButton asChild>
                  <Link to={`/list/${list.id}`}>{list.name}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Form method="post" className="p-2 space-y-2">
          <Input
            name="listName"
            placeholder="新リスト名を入力"
            required
            className="w-full"
          />
          <Button type="submit" className="w-full">
            リストを作成
          </Button>
        </Form>
      </SidebarFooter>
    </Sidebar>
  );
}
