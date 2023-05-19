"use client";
import { FullConversationType } from "@/app/types";
import { User, Message, Conversation } from "@prisma/client";
import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import clsx from "clsx";
import useOtherUser from "@/app/hooks/useOtherUser";
import { useSession } from "next-auth/react";
import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";
interface ConversationBoxProps {
  selected?: boolean;
  data: FullConversationType;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();
  const handleClick = useCallback(() => {
    router.push(`conversations/${data.id}`);
  }, [router, data.id]);
  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    return messages[messages.length - 1];
  }, [data.messages]);
  const userEmail = useMemo(() => {
    return session?.data?.user?.email;
  }, [session?.data?.user?.email]);
  const hasSeen = useMemo(() => {
    if (!lastMessage) return false;
    const seenArray = lastMessage.seen || [];
    if (!userEmail) return false;
    return seenArray.filter((user) => user.email === userEmail).length != 0;
  }, [lastMessage, userEmail]);
  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) return "Sent an Image";
    if (lastMessage?.body) return lastMessage?.body;
    return "Start a conversation";
  }, [lastMessage?.image, lastMessage?.body]);
  return (
    <>
      <div
        onClick={handleClick}
        className={clsx(
          `w-full flex relative items-center space-x-3 hover:bg-neutral-100 p-3 rounded-lg transistion cursor-poingter`,
          selected ? "bg-neutral-100" : "bg-white"
        )}
      >
        {data.isGroup ? (
          <AvatarGroup users={data.users} />
        ) : (
          <Avatar user={otherUser} />
        )}
        <div className="min-2-0 flex-1">
          <div className="focus:outline-none">
            <div className="flex justify-between items-center">
              <p className="text-md font-medium text-gray-900">
                {data.name || otherUser.name}
              </p>
              {lastMessage?.createdAt && (
                <p className="text-xs text-gray-400 font-light">
                  {format(new Date(lastMessage?.createdAt), "p")}
                </p>
              )}
            </div>
            <p
              className={clsx(
                `truncate text-sm`,
                hasSeen ? "text-gray-500" : "text-black font-medium"
              )}
            >
              {lastMessageText}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConversationBox;
