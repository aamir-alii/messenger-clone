import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentUser = await getCurrentUser();
    if (!currentUser?.id)
      return new NextResponse("Unathorized", { status: 401 });
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: body.name,
        image: body.image,
      },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log(error, "SETTING_UPDATE_ERRORS", { status: 500 });
  }
}
