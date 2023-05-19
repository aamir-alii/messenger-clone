"use client";
import useConversation from "@/app/hooks/useConversation";
import { MdOutlineGroupAdd } from "react-icons/md";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
}
const ConversationList: React.FC<ConversationListProps> = function ({
  initialItems,
  users,
}) {
  const session = useSession();
  const [items, setItems] = useState<FullConversationType[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { conversationId, isOpen } = useConversation();
  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) return;
    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }
        return [...current, conversation];
      });
    };
    const updateHandler = (updatedConversation: FullConversationType) => {
      // items[0].messages
      setItems((current) => {
        return current.map((currentConversation) => {
          if (currentConversation.id === updatedConversation.id)
            return {
              ...currentConversation,
              messages: updatedConversation.messages,
            };
          return currentConversation;
        });
      });
    };
    const deleteHandler = (conversation: FullConversationType) => {
      const copy = items;
      setItems(copy.filter((current) => current.id !== conversation.id));
      if (conversationId === conversation.id) {
        router.push("/conversation");
      }
    };

    pusherClient.subscribe(pusherKey);
    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:delete", deleteHandler);
    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:delete", deleteHandler);
      pusherClient.unbind("conversation:new", newHandler);
    };
  }, [pusherKey, items, router, conversationId]);
  return (
    <>
      <GroupChatModal
        isOpen={isModalOpen}
        users={users}
        onClose={() => {
          setIsModalOpen(false);
        }}
      ></GroupChatModal>
      <aside
        className={clsx(
          `fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200`,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral 800">Messages</div>

            <div
              className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={item.id === conversationId}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
