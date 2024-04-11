import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;



export async function createBookmark(data) {
    const res = await prisma.bookmarks.create({
        data: data
    });
    return res
}