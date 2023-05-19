import Sidebar from "@/app/components/sidebar/Sidebar";
import UserList from "@/app/users/components/UserList";
import DesktopSidebar from "../components/sidebar/DesktopSidebar";
import getUsers from "../actions/getUsers";
export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();
  return (
    // @ts-expect-error Server component
    <Sidebar>
      <UserList items={users} />
      <div className="h-full">{children}</div>
    </Sidebar>
  );
}
